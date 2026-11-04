"""A new video, from her recording to what the engine needs. Reads videos/<id>/cut.json and videos/<id>/captions.txt. Generalised from work/gen_full.py, extract_full.sh, facefull.py.
python3 tools/film/kit/prep.py <video> words    transcribe the recording with word times (once; whisper is slow): _local/<id>/transcript.json
python3 tools/film/kit/prep.py <video> data     timed captions and the edit: _local/<id>/data.js. Run again after any change to cut.json or captions.txt
python3 tools/film/kit/prep.py <video> frames   her cut, one image per frame (f her, b b2 the sky wash), and the face track: _local/<id>/face.js
cut.json: {"recording": path, "end": seconds, "cuts": [[from, to], ...] removed from the recording, "prompt": names for the transcriber}
captions.txt: one caption per line. *word is a key word (soft yellow). A line starting with - is timed but not shown: a graphic carries it."""
import difflib,json,os,re,subprocess,sys
import numpy as np
FILM=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); VIDEO,STEP=sys.argv[1:3]; V=f'{FILM}/videos/{VIDEO}'; C=json.load(open(f'{V}/cut.json')); ex=os.path.expanduser
L=ex(C.get('local',f'{FILM}/_local/{VIDEO}')); os.makedirs(L,exist_ok=True); W=f'{L}/transcript.json'; REC=ex(C['recording']); FPS=30
EDL=[];p=0
for a,b in C['cuts']:
    if a>p: EDL.append([p,a])   # a cut from the very start leaves no empty piece
    p=b
EDL.append([p,C['end']])
def T(s):
    o=0
    for a,b in EDL:
        if s<a: return o
        if s<=b: return o+s-a
        o+=b-a
    return o

def words():
    from faster_whisper import WhisperModel
    m=WhisperModel('small.en',device='cpu',compute_type='int8'); segs,_=m.transcribe(REC,word_timestamps=True,vad_filter=False,beam_size=5,condition_on_previous_text=True,initial_prompt=C.get('prompt',''))
    res=[]
    for s in segs:
        res.append(dict(start=s.start,end=s.end,text=s.text.strip(),words=[dict(w=w.word,s=w.start,e=w.end,p=w.probability) for w in s.words])); print(f'{int(s.start//60)}:{s.start%60:05.2f}  {s.text.strip()}',flush=True)
    json.dump(res,open(W,'w'),indent=0); print('now write captions.txt from these words, then run: data')

def data():
    Wd=[w for s in json.load(open(ex(C.get('transcript',W)))) for w in s['words']]; kept=[w for w in Wd if any(a<=w['s']+.03 and w['s']<b for a,b in EDL)]
    norm=lambda x:re.sub(r'[^a-z0-9$]','',x.lower().replace(*C.get('hears_as',['\0','\0'])))
    toks=[];chunks=[]
    for l in open(f'{V}/captions.txt').read().strip().split('\n'):
        hide=l.startswith('-'); l=l[1:] if hide else l; idx=[]
        for t in l.split(): idx.append(len(toks)); toks.append(t)
        chunks.append(dict(hide=hide,idx=idx))
    A=[norm(t) for t in toks]; B=[norm(w['w']) for w in kept]; tm=[None]*len(A)
    for m in difflib.SequenceMatcher(None,A,B,autojunk=False).get_matching_blocks():
        for i in range(m.size): tm[m.a+i]=kept[m.b+i]['s']
    known=[i for i,v in enumerate(tm) if v is not None]; print('tokens',len(A),'kept words',len(B),'unmatched:',[toks[i] for i,v in enumerate(tm) if v is None])
    for i,v in enumerate(tm):
        if v is None:
            lo=max([k for k in known if k<i],default=None); hi=min([k for k in known if k>i],default=None)
            tm[i]=tm[lo]+(tm[hi]-tm[lo])*(i-lo)/(hi-lo) if lo is not None and hi is not None else (tm[lo] if lo is not None else tm[hi])
    out=[]
    for ci,c in enumerate(chunks):
        w=[dict(x=toks[i].lstrip('*'),h=int(toks[i].startswith('*')),t=round(T(tm[i]),3),s=round(tm[i],3)) for i in c['idx']]
        nxt=chunks[ci+1]['idx'][0] if ci+1<len(chunks) else None; t1=round(T(tm[nxt]),3) if nxt is not None else round(T(C['end']),3)
        out.append(dict(t0=w[0]['t'],t1=t1,hide=int(c['hide']),w=w))
    D=sum(b-a for a,b in EDL); o=ex(C.get('data_out',f'{L}/data.js'))
    open(o,'w').write('window.EDL='+json.dumps(EDL)+';window.DUR='+str(round(D,3))+';window.CAPS='+json.dumps(out,separators=(',',':'))+';\n')
    print('duration',round(D,2),'chunks',len(out),'longest caption',max(len(' '.join(w['x'] for w in c['w'])) for c in out),'characters ->',o)

def frames():
    # f = her crop above any burned-in words, b = landscape sky wash, b2 = phone sky wash. crop: [w, h, x, y] of the recording
    cw,ch,cx,cy=C.get('crop',[720,835,0,90]); sk=C.get('sky_crop',[720,104,0,0]); F=ex(C.get('frames_out',f'{L}/frames'))
    for d in ('f','b','b2'): os.makedirs(f'{F}/{d}',exist_ok=True)
    LUT="format=gray,normalize=strength=0.85:smoothing=45,format=rgb24,lutrgb=r='128+(255-128)*pow(val/255\\,1.25)':g='172+(248-172)*pow(val/255\\,1.25)':b='220+(238-220)*pow(val/255\\,1.25)'"
    n,acc=1,0.0; marks=[0]
    for a,b in EDL:
        c=round((acc+b-a)*FPS)-round(acc*FPS)
        fc=f"fps={FPS},split[v][s];[v]crop={cw}:{ch}:{cx}:{cy}[of];[s]crop={sk[0]}:{sk[1]}:{sk[2]}:{sk[3]},split[a][z];[a]scale=390:170,gblur=sigma=12:sigmaV=2,{LUT}[oa];[z]transpose=1,scale=300:430,gblur=sigma=9,{LUT}[ob]"
        subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-ss',str(a),'-i',REC,'-t',str(b-a+.2),'-filter_complex',fc]+sum([['-map',f'[{m}]','-frames:v',str(c),'-q:v',q,'-start_number',str(n),f'{F}/{d}/%05d.jpg'] for m,d,q in (('of','f','3'),('oa','b','5'),('ob','b2','5'))],[]),check=True)
        n+=c; acc+=b-a; marks.append(n-1); print('segment',a,b,'to frame',n-1,flush=True)
    # the face track: Vision every 3rd frame, then smoothed inside each piece of the cut so a cut may jump and a shot may not
    log=f'{L}/face.txt'; open(log,'w').write(subprocess.run([ex('~/AnaVideo/work/facebin'),f'{F}/f/'],capture_output=True,text=True).stdout); nf=marks[-1]; a=np.full(nf,np.nan)
    for l in open(log):
        i,y,h=l.split()
        if y!='none' and int(i)<nf: a[int(i)]=float(y)*ch
    res=np.zeros(nf)
    for s,e in zip(marks,marks[1:]):
        seg=a[s:e]; idx=np.arange(len(seg)); ok=~np.isnan(seg); f=np.interp(idx,idx[ok],seg[ok]) if ok.any() else np.full(len(seg),np.nanmedian(a))
        k=min(75,max(3,len(seg)|1)); ker=np.hanning(k+2)[1:-1]; ker/=ker.sum(); res[s:e]=np.convolve(np.pad(f,k//2,mode='edge'),ker,'valid')[:e-s]
    open(f'{L}/face.js','w').write('window.FACE='+json.dumps([round(float(v),1) for v in res],separators=(',',':'))+';\n'); print('frames',nf,'face found on',int(np.sum(~np.isnan(a))))

{'words':words,'data':data,'frames':frames}[STEP]()
