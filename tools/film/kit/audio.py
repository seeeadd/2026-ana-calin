"""The sound of a video, from one cue list: videos/<id>/audio.json. Generalised from tools/film/sfx_mix.py and work/adobe/build.py.
python3 tools/film/kit/audio.py <video> cut     her recording cut to the edit, to upload to Adobe Enhance Speech
python3 tools/film/kit/audio.py <video> words   word swaps from the list, level and tone matched, then loudness and padding: the voice
python3 tools/film/kit/audio.py <video> mix     voice + effects + sea + music: the file the config's `audio` names
python3 tools/film/kit/audio.py <video> hear    faster-whisper on each swapped word, to check them by ear on paper (needs work/adobe's model)
Times in cue lists: a plain number is seconds of her recording, through the edit. {"cut": x} is seconds of the cut before any speed-up, {"at": x} is seconds of the finished file. [x, y] is recording second x, then y seconds later, whatever the speed; [x, y, 1] scales y with the speed.
"voiced" names an existing voice file for mix to use instead of the one words writes. "speed": 1.25 in the list makes the voice and every cue time follow a sped-up picture (kit.js --speed 1.25); effects and music keep their pitch and length."""
import json,os,re,subprocess,sys,tempfile
import numpy as np
FILM=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SR=48000
VIDEO,STEP=sys.argv[1:3]; C=json.load(open(f'{FILM}/videos/{VIDEO}/audio.json')); ex=lambda p:os.path.expanduser(p)
OUT=ex(C.get('out','~/AnaVideo/out/kit')); os.makedirs(OUT,exist_ok=True); P=lambda n:f'{OUT}/{VIDEO}-{n}.wav'   # everything is written here, so a finished video's files are never touched
SPEED=float(C.get('speed',1))   # her voice and the picture sped up; effects and music are not, so cue times are divided and clips stay as they are
DIR=ex(C.get('sfx_dir','')); E=json.loads(re.search(r'window\.EDL=(\[\[.*?\]\])',open(f"{FILM}/{C['edl_from']}").read()).group(1))
def T(x):
    o=0
    for p,q in E:
        if x<p: return o/SPEED
        if x<=q: return (o+x-p)/SPEED
        o+=q-p
    return o/SPEED
def at(x):
    if isinstance(x,dict): return x['at'] if 'at' in x else x['cut']/SPEED
    if isinstance(x,list): return at(x[0])+(x[1]/SPEED if len(x)>2 else x[1])    # a third value: the gap follows the speed-up too
    return T(x)
def rd(p,flt=None):
    a=['ffmpeg','-nostdin','-v','error','-i',p]+(['-af',flt] if flt else [])+['-ac','2','-ar',str(SR),'-f','f32le','-']
    return np.frombuffer(subprocess.run(a,capture_output=True).stdout,dtype=np.float32).reshape(-1,2).copy()
def wr(x,path,codec='pcm_s16le',af=None):
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-']+(['-af',af] if af else [])+['-c:a',codec,path],input=x.astype(np.float32).tobytes(),check=True)
def rms(x): return float(np.sqrt(np.mean(x**2))+1e-9)
def src(n): return os.path.join(DIR,n) if not n.startswith(('~','/')) else ex(n)

def step_cut():
    c=C['voice']; fc=[]; n=len(E)
    for i,(a,b) in enumerate(E): fc.append(f'[0:a]atrim={a}:{b},asetpts=N/SR/TB,afade=t=in:d=0.02,afade=t=out:st={b-a-.03:.3f}:d=0.03[a{i}]')
    fc.append(''.join(f'[a{i}]' for i in range(n))+f"concat=n={n}:v=0:a=1,{c.get('cut_filter','highpass=f=85,afftdn=nr=8:nf=-35,loudnorm=I=-16:TP=-1.5:LRA=7')}")
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',ex(c['recording']),'-filter_complex',';'.join(fc),'-ar',str(SR),'-ac','2','-c:a','pcm_s16le',P('cut')],check=True); print('upload to Adobe Enhance Speech:',P('cut'))

def build_voice():
    def welch(y,sr,nperseg=8192):    # averaged power spectrum, numpy only
        w=np.hanning(nperseg+1)[:-1]; st=np.arange(0,len(y)-nperseg+1,nperseg//2); X=np.lib.stride_tricks.sliding_window_view(y,nperseg)[st]; X=X-X.mean(1,keepdims=True); return np.fft.rfftfreq(nperseg,1/sr),(np.abs(np.fft.rfft(X*w,axis=1))**2).mean(0)
    c=C['voice']; V=rd(src(c['clean'])); S={k:rd(src(v['file']),v.get('filter')) for k,v in c['sources'].items()}; n=min([len(V)]+[len(x) for k,x in S.items() if c['sources'][k].get('same_length',True)]); V=V[:n]
    # make each source sit in the cleaned voice's tone: long-term spectrum ratio, smoothed to third octaves
    f,Pv=welch(V.mean(1),SR,nperseg=8192)
    def smooth(Q):
        out=np.zeros_like(Q)
        for i,fi in enumerate(f):
            lo,hi=fi/2**(1/6),fi*2**(1/6); m=(f>=lo)&(f<=hi); out[i]=Q[m].mean() if m.any() else Q[i]
        return out
    def match(x):
        _,Q=welch(x.mean(1),SR,nperseg=8192); h=np.sqrt(smooth(Pv)/np.maximum(smooth(Q),1e-14)); h=np.clip(h,10**(-18/20),10**(10/20)); return h/np.median(h[(f>300)&(f<3000)])
    def eq(x,h):
        X=np.fft.rfft(x,axis=0); fr=np.fft.rfftfreq(len(x),1/SR); X*=np.interp(fr,f,h)[:,None]; return np.fft.irfft(X,len(x),axis=0).astype(np.float32)
    H={k:match(S[k][:n] if c['sources'][k].get('tone_from') is None else S[c['sources'][k]['tone_from']][:n]) for k in S}; Q={k:eq(S[k][:n] if c['sources'][k].get('same_length',True) else S[k],H[k]) for k in S}
    def splice(out,piece,a,fade=.022):
        i=int(a*SR); L=len(piece); F=int(fade*SR); w=np.ones(L); r=np.linspace(0,np.pi/2,F); w[:F]=np.sin(r); w[-F:]=np.cos(r); bw=np.zeros(L); bw[:F]=np.cos(r); bw[-F:]=np.sin(r)
        out[i:i+L]=out[i:i+L]*bw[:,None]+piece*w[:,None]
    # swaps snap to the nearest quiet in the reference, so no word is clipped
    ENV=np.convolve(np.abs(S[c['snap_on']][:n].mean(1)),np.ones(480)/480,'same') if c.get('snap_on') else None
    def snap(t,lo,hi):
        if ENV is None: return t
        i,j=int((t+lo)*SR),int((t+hi)*SR); return (i+int(np.argmin(ENV[i:j])))/SR
    A=V.copy(); spots=[]
    for nm,a0,b0,s in c.get('swaps',[]):     # cut seconds: the Adobe files are already cut
        a,b=snap(a0,-.14,.02),snap(b0,-.02,.14); i,j=int(a*SR),int(b*SR); g=np.clip(rms(V[i:j])/rms(Q[s][i:j]),.25,1.8); splice(A,Q[s][i:j]*g,a); spots.append((nm,a0,b0)); print('swap',nm,s,round(a,3),round(b,3),'gain',round(float(g),2))
    for nm,a0,slot,e,s in c.get('stretches',[]):   # the word runs a0 to e in the source and must fit a0 to slot
        p=Q[s][int(a0*SR):int(e*SR)]; speed=(e-a0)/(slot-a0); tmp=tempfile.mktemp(suffix='.wav'); subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-af',f'atempo={speed:.4f}',tmp],input=p.tobytes(),check=True)
        q=rd(tmp); os.remove(tmp); L=int((slot-a0)*SR); q=q[:L] if len(q)>=L else np.vstack([q,np.zeros((L-len(q),2),np.float32)]); i=int(a0*SR); g=np.clip(rms(V[i:i+L])/rms(q),.25,1.6); splice(A,q*g,a0); spots.append((nm,a0,slot)); print('stretch',nm,'speed',round(speed,3),'gain',round(float(g),2))
    return A,spots

def step_words():
    A,_=build_voice(); c=C['voice']; wr(A,P('voice-raw'),'pcm_s24le'); dur=c.get('pad_to')
    af=c.get('finish','loudnorm=I=-16:TP=-1.5:LRA=7')+(f',apad=whole_dur={dur}' if dur else '')
    if SPEED!=1: af=c.get('finish','loudnorm=I=-16:TP=-1.5:LRA=7')+f',atempo={SPEED}'+(f',apad=whole_dur={dur/SPEED}' if dur else '')
    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',P('voice-raw'),'-af',af,'-ar',str(SR),'-c:a','pcm_s16le',P('voice')],check=True); print('voice:',P('voice'))

def step_hear():
    from faster_whisper import WhisperModel
    m=WhisperModel('small.en',device='cpu',compute_type='int8',cpu_threads=4); A,spots=build_voice()
    for nm,a,b in spots:
        x=A[int((a-2.4)*SR):int((b+2.4)*SR)].mean(1)[::3].astype(np.float32); s,_=m.transcribe(x,beam_size=5,vad_filter=False,condition_on_previous_text=False,language='en'); print(nm,'|',' '.join(g.text.strip() for g in s))

def step_mix():
    F=C['files']; S={k:rd(src(v)) for k,v in F.items()}; v=rd(ex(C['voiced']) if 'voiced' in C else P('voice')); N=len(v); t=np.arange(N)/SR
    # her first words ease in, so the video doesn't open with a jolt
    if C.get('ease_in'):
        z=C['ease_in']; FI=int(z['sec']*SR); v[:FI]*=(z['floor']+(1-z['floor'])*np.sin(np.linspace(0,np.pi/2,FI))**z['pow'])[:,None]
    # ---------- effects: [name, when, from, to, dB, {semi, fin, fout}] ----------
    fx=np.zeros((N,2),np.float32)
    def put(name,when,a,b,db,o=None):
        o=o or {}; semi,fin,fout=o.get('semi',0),o.get('fin',.004),o.get('fout',.04); b=a+(b-a)/SPEED if o.get('fit') else b    # fit: the clip follows an action, so it shortens with the speed-up
        x=S[name][int(a*SR):int(b*SR)].copy(); x/=float(np.abs(x).max())+1e-9
        if semi:
            r=2**(semi/12); idx=np.arange(0,len(x)-1,r); x=np.stack([np.interp(idx,np.arange(len(x)),x[:,c]) for c in (0,1)],1).astype(np.float32)
        L=len(x); w=np.ones(L); fi,fo=int(fin*SR),min(int(fout*SR),L//2); w[:fi]=np.linspace(0,1,fi); w[-fo:]=np.linspace(1,0,fo); x=x*w[:,None]*10**(db/20)
        i=int(at(when)*SR); j=min(i+L,N); fx[i:j]+=x[:j-i]
    for row in C.get('sfx',[]): put(*row)
    # ---------- the sea: looped under everything, clear on the coast, muffled in the rooms ----------
    bed=np.zeros((N,2),np.float32); z=C.get('sea')
    if z:
        kn=int(z.get('smooth',.5)*SR); sm=lambda m,k=kn:np.convolve(np.pad(m.astype(float),(k,k),mode='edge'),np.ones(k)/k,'same')[k:k+N]
        sea=S[z['file']][int(z['loop'][0]*SR):int(z['loop'][1]*SR)]; xf=int(z.get('xfade',2)*SR); A=np.zeros((N+xf,2),np.float32); pos=0; ramp=np.linspace(0,1,xf)[:,None]
        while pos<N:
            L=min(len(sea),N+xf-pos); seg=sea[:L].copy(); seg[:xf]*=ramp[:min(xf,L)]
            if L==len(sea): seg[-xf:]*=ramp[::-1]
            A[pos:pos+L]+=seg; pos+=len(sea)-xf
        A=A[:N]; A/=np.sqrt(np.mean(A**2))+1e-9
        def lowpass(x,fc):
            X=np.fft.rfft(x,axis=0); fr=np.fft.rfftfreq(len(x),1/SR); X*=(1/np.sqrt(1+(fr/fc)**4))[:,None]; return np.fft.irfft(X,len(x),axis=0).astype(np.float32)
        AL=lowpass(A,z.get('room_lowpass',650)); AL/=np.sqrt(np.mean(AL**2))+1e-9; A=lowpass(A,z.get('coast_lowpass',3800)); A/=np.sqrt(np.mean(A**2))+1e-9
        coast=np.ones(N)
        for when,st in z['places'][1:]: coast=np.where(t>=T(when),st,coast)
        coast=sm(coast); lv=np.full(N,10**(z['coast_db']/20))*coast+10**(z['room_db']/20)*(1-coast)
        for a,b,amt in z.get('quiet',[]): lv*=1-amt*sm((t>=T(a))&(t<T(b)))   # less of it on a quiet story
        un=z.get('under')    # it steps back under the music: cut seconds
        if un: lv*=1-un['amount']*sm((t<un['until'])|(t>=at(un['from'])),kn*2)
        bed=(A*coast[:,None]+AL*(1-coast)[:,None])*lv[:,None]
    # ---------- music: clips placed by hand, then room is made for her words ----------
    mus=np.zeros((N,2),np.float32); z=C.get('music')
    if z:
        SONG=S[z['file']]; g=10**(z['db']/20)/(float(np.sqrt(np.mean(SONG[int(z['ref'][0]*SR):int(z['ref'][1]*SR)]**2)))+1e-9)
        for when,a,b,fi,fo in z['clips']:
            st0=at(when); b=a+(N/SR-st0) if b=='end' else b
            x=SONG[int(a*SR):int(b*SR)].copy(); L=len(x); w=np.ones(L); i,o=int(fi*SR),int(fo*SR); w[:i]=np.linspace(0,1,i)**.5 if fi<.2 else np.sin(np.linspace(0,np.pi/2,i)); w[-o:]=np.cos(np.linspace(0,np.pi/2,o)); st=int(st0*SR); e=min(st+L,N); mus[st:e]+=(x*w[:,None]*g)[:e-st]
        for a,b in z.get('fade_out',[]): i,j=int(a*SR),int(b*SR); mus[i:j]*=np.cos(np.linspace(0,np.pi/2,j-i))[:,None]
        for a,b in z.get('silence',[]): mus[int(a*SR):int(b*SR)]=0
        # the music gives up the band her consonants live in, and dips while she speaks
        cv=z.get('carve')
        if cv: Xm=np.fft.rfft(mus,axis=0); frq=np.fft.rfftfreq(N,1/SR); Xm*=np.interp(frq,[p[0] for p in cv],[p[1] for p in cv])[:,None]; mus=np.fft.irfft(Xm,N,axis=0).astype(np.float32)
        dz=z.get('duck')
        if dz:
            vm=v.mean(1); hp=int(.03*SR); env=np.sqrt(np.convolve(vm**2,np.ones(hp)/hp,'same')); act=(env>10**(dz['threshold_db']/20)).astype(float)
            ka=int(dz['attack']*SR); kr=int(dz['release']*SR); dk=np.convolve(act,np.ones(ka+kr)/(ka+kr),'same'); dk=np.clip(dk*dz.get('gain',1.6),0,1); mus*=(1-dz['amount']*dk)[:,None]
        bo=z.get('boost')    # [[cut second, dB], ...]
        if bo: mus*=np.interp(t,[p[0] for p in bo]+[N/SR],[10**(p[1]/20) for p in bo]+[10**(bo[-1][1]/20)])[:,None]
    mix=v+fx+bed+mus; print('peak before limiter',round(float(np.abs(mix).max()),3),'effects',len(C.get('sfx',[])))
    wr(mix,ex(C['mix_out']) if 'mix_out' in C else P('mix'),af=C.get('limiter','alimiter=limit=0.84:level=disabled:attack=3:release=60')); print('mix:',ex(C['mix_out']) if 'mix_out' in C else P('mix'))

{'cut':step_cut,'words':step_words,'hear':step_hear,'mix':step_mix}[STEP]()
