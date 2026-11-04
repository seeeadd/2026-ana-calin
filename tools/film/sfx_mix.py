"""Ana's registration video: sound effects and a soft sea under her cleaned voice.
python tools/film/sfx_mix.py <voice.wav> <sfx folder> <out.wav>   Times are recording seconds through T(), or cut seconds as C(x)."""
import json,os,re,subprocess,sys
import numpy as np
VOICE,DIR,OUT=sys.argv[1:4]; SR=48000; ROOT=os.path.dirname(os.path.abspath(__file__))
E=json.loads(re.search(r'window\.EDL=(\[\[.*?\]\])',open(ROOT+'/_local/full-data.js').read()).group(1))
SPEED=float(os.environ.get('SPEED',1))   # her voice and the picture are sped up beforehand; effects and music are not
def T0(x):
    o=0
    for p,q in E:
        if x<p: return o
        if x<=q: return o+x-p
        o+=q-p
    return o
def T(x): return T0(x)/SPEED
def C(x): return x/SPEED
def rd(p):
    x=np.frombuffer(subprocess.run(['ffmpeg','-nostdin','-v','error','-i',p,'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout,dtype=np.float32)
    return x.reshape(-1,2).copy()
F={'key':'Brass Key Ring Sound Effect.mp3','sea':'Calm Sea Waves.mp3','tick':'Clock Ticking Sound Effect (1).mp3','stamp':'Ink Stamp Sound Effect.mp3','kal':'Kalimba Octave Pluck Effect.mp3','mar':'Marimba Sound Effect.mp3','pen':'Pen on Paper Sound Effect.mp3','run':'Run on Wood Sound Effect.mp3','bell':'Small Bell Ringing Sound Effect.mp3','ship':'Two Small Ship Bells.mp3','type':'Typewriter Sound Effect.mp3','chime':'Wind Chimes Sound Effect.mp3','door':'Wooden Swinging Door Sound Effect (1).mp3'}
F['click']=[f for f in os.listdir(DIR) if f.startswith('Magic Mouse')][0]
F['song']='Each Day Gets Better.mp3'
S={k:rd(os.path.join(DIR,v)) for k,v in F.items()}
v=rd(VOICE); N=len(v)
# her first words ease in, so the video doesn't open with a jolt
FI=int(2.0*SR); v[:FI]*=(.22+.78*np.sin(np.linspace(0,np.pi/2,FI))**1.4)[:,None]
fx=np.zeros((N,2),np.float32); log=[]
def put(name,at,a,b,db,semi=0,fin=.004,fout=.04):
    x=S[name][int(a*SR):int(b*SR)].copy(); pk=float(np.abs(S[name][int(a*SR):int(b*SR)]).max())+1e-9; x/=pk
    if semi:
        r=2**(semi/12); idx=np.arange(0,len(x)-1,r); x=np.stack([np.interp(idx,np.arange(len(x)),x[:,c]) for c in (0,1)],1).astype(np.float32)
    L=len(x); w=np.ones(L); fi,fo=int(fin*SR),min(int(fout*SR),L//2); w[:fi]=np.linspace(0,1,fi); w[-fo:]=np.linspace(1,0,fo); x=x*w[:,None]*10**(db/20)
    i=int(at*SR); j=min(i+L,N); fx[i:j]+=x[:j-i]; log.append((name,round(at,2),a,b,db,semi))
# the world changing: shutters swing, a breath of chimes when we arrive in a room
DOOR=[(.42,1.32),(1.45,2.05),(2.9,3.72),(.42,1.32),(1.45,2.05)]
for k,(s,place) in enumerate([(52.54,'room'),(90.98,'room'),(121.84,'out'),(161.92,'room'),(202.96,'out')]):
    tc=T(s); a,b=DOOR[k]; put('door',tc-.3,a,b,-17,fout=.12)
    if place=='room': put('chime',tc-.05,1.2+k*1.2,3.0+k*1.2,-27,fin=.12,fout=.7)
# handmade: rubber stamp on FREE and PROOF (single clean hits, not the double at 2.91), pen on each crossed-out word
put('stamp',C(6.40),1.60,2.30,-11); put('stamp',T(37.2),5.13,5.45,-11)
for s in (17.0,17.85,45.2,47.05): put('pen',T(s)-.05,1.1,1.62,-20,fin=.02,fout=.1)
put('pen',T(48.86),2.2,3.2,-27,fin=.05,fout=.3); put('pen',T(152.0),3.1,4.4,-27,fin=.05,fout=.4)
# the sunflower: wooden footsteps when he runs, a kalimba pluck on each leap
put('run',0,.28,.28+4.0/SPEED,-33,fout=.5)
for at,a,b in ((T(29.22),.3,2.3),(T(52.54),.8,1.6),(T(95.3),1.6,2.2),(T(139.42),2.4,3.0),(T(145.32),.3,.9),(T(148.32),1.0,1.6),(T(204.1)-.9,3.0,3.8),(T(205.76),2.0,2.6)): put('run',at,a,b,-25,fout=.15)
for t0,s in ((C(1.06)-.26,0),(C(2.76)-.26,3)): put('kal',t0,.06,1.0,-17,s,fout=.4)
for s,sem in ((22.5,0),(49.38,2),(60.26,0),(73.12,3),(77.5,-2),(134.18,2),(147.82,4),(193.1,0)): put('kal',T(s)-.03,.06,.9,-19,sem,fout=.35)
# things landing: a soft marimba note climbing through each list, a small bell on each day
LIST=[95.72,97.22,98.56,99.4,100.46]
for k,s in enumerate(LIST): put('mar',T(s),.12,.72,-21,[0,2,4,5,7][k],fout=.25)
for k,s in enumerate((164.76,167.46,170.68)): put('mar',T(s),.12,.72,-21,[0,4,7][k],fout=.25)
for k,s in enumerate((139.42,141.4,143.6)): put('mar',T(s),1.12,1.72,-22,[0,2,4][k],fout=.25)
for k,s in enumerate((121.9,132.8,145.38)): put('bell',T(s),.07,1.5,-17,[0,2,4][k],fout=.6)
put('bell',T(161.98),.07,1.5,-18,7,fout=.6)
# 16,000 counting up: clock ticks in a quick run
for k in range(9): put('tick',T(66.6)+k*.11/SPEED,.34,.52,-23,k*.5,fout=.05)
# the calculator: her key opens the lock, typed goal, one click to show the numbers
put('key',T(186.45),2.28,2.92,-17,fout=.2)
put('type',T(188.66),1.27,1.27+.83/SPEED,-20,fout=.08); put('click',T(189.9),3.66,3.9,-15,fout=.06)
# the form: typed name and email, click on the button
put('type',T(203.2),.2,.2+.66/SPEED,-20,fout=.06); put('type',T(203.95),1.15,1.15+.91/SPEED,-20,fout=.06); put('click',T(205.4),3.66,3.9,-13,fout=.06)
# the close: the ship's bell rings twice on "live", then the clock under "block the time"
put('ship',T(206.94)-.04,.55,3.0,-11,fout=.9)
for k,t0 in enumerate((T(207.2)+.1,T(207.2)+1.1,T(207.2)+2.05)): put('tick',t0,1.36+k,1.6+k,-21,fout=.05)
# the sea: looped under everything, heard clearly on the coast, muffled through the door in the rooms, with less of it on the quiet story
sea=S['sea'][int(.2*SR):int(61.5*SR)]; xf=int(2*SR); out=[]; A=np.zeros((N+xf,2),np.float32); pos=0; ramp=np.linspace(0,1,xf)[:,None]
while pos<N:
    L=min(len(sea),N+xf-pos); seg=sea[:L].copy(); seg[:xf]*=ramp[:min(xf,L)]; 
    if L==len(sea): seg[-xf:]*=ramp[::-1]
    A[pos:pos+L]+=seg; pos+=len(sea)-xf
A=A[:N]; A/=np.sqrt(np.mean(A**2))+1e-9
def lowpass(x,fc):
    X=np.fft.rfft(x,axis=0); fr=np.fft.rfftfreq(len(x),1/SR); X*=(1/np.sqrt(1+(fr/fc)**4))[:,None]; return np.fft.irfft(X,len(x),axis=0).astype(np.float32)
AL=lowpass(A,650); AL/=np.sqrt(np.mean(AL**2))+1e-9
A=lowpass(A,3800); A/=np.sqrt(np.mean(A**2))+1e-9   # less hiss, so the waves sit further back
CH=[(0,1),(T(52.54),0),(T(90.98),0),(T(121.84),1),(T(161.92),0),(T(202.96),1)]
t=np.arange(N)/SR; coast=np.ones(N); 
for k,(t0,st) in enumerate(CH[1:]): coast=np.where(t>=t0,st,coast)
kn=int(.5*SR); coast=np.convolve(np.pad(coast,(kn,kn),mode='edge'),np.ones(kn)/kn,'same')[kn:kn+N]
lv=np.full(N,10**(-47/20)); room=10**(-52/20); lv=lv*coast+room*(1-coast)
quiet=(t>=T(77.3))&(t<T(83.9)); qs=np.convolve(np.pad(quiet.astype(float),(kn,kn),mode='edge'),np.ones(kn)/kn,'same')[kn:kn+N]; lv*=1-.45*qs
under=((t<35.0)|(t>=T(206.94)-9.63)).astype(float); un=np.convolve(np.pad(under,(kn*2,kn*2),mode='edge'),np.ones(kn*2)/(kn*2),'same')[kn*2:kn*2+N]; lv*=1-.6*un   # the sea steps back under the music
bed=(A*coast[:,None]+AL*(1-coast)[:,None])*lv[:,None]
print('sea rms dB coast/room:',round(20*np.log10(float(np.sqrt(np.mean(bed[t<T(50)]**2)))),1),round(20*np.log10(float(np.sqrt(np.mean(bed[(t>T(60))&(t<T(75)) ]**2)))),1))
# music at the two ends, clearly above the sea: 35 s of the instrumental intro, then 12 s into the close.
# The close plays the intro under her call to action and joins the same chords just before the hook (24.6 to 26.18, same bars as 15.0 to 16.6),
# so "each day gets better" starts as she says "live" and no singing runs under her words.
MUSIC_DB=-31.0; SONG=S['song']; g=10**(MUSIC_DB/20)/(float(np.sqrt(np.mean(SONG[int(2*SR):int(16*SR)]**2)))+1e-9)
mus=np.zeros((N,2),np.float32)
def place(at,a,b,fi,fo):
    x=SONG[int(a*SR):int(b*SR)].copy(); L=len(x); w=np.ones(L); i,o=int(fi*SR),int(fo*SR); w[:i]=np.linspace(0,1,i)**.5 if fi<.2 else np.sin(np.linspace(0,np.pi/2,i)); w[-o:]=np.cos(np.linspace(0,np.pi/2,o)); st=int(at*SR); e=min(st+L,N); mus[st:e]+=(x*w[:,None]*g)[:e-st]
HOOK=T(206.94); XF=.07
# 35 s at the opening: the intro's repeating 9.62 s passage (6.24 to 15.86) loops cleanly, so no singing runs under her
place(0,.95,15.86+XF,.7,XF); at=14.91
for rep in range(2): place(at,6.24,15.86+XF,XF,XF); at+=9.62
place(at,6.24,6.24+(35.1-at),XF,.1)
fo0,fo1=int(32.2*SR),int(35.0*SR); mus[fo0:fo1]*=np.cos(np.linspace(0,np.pi/2,fo1-fo0))[:,None]; mus[fo1:int(36*SR)]=0
place(HOOK-9.63,6.97,16.6+XF,1.3,XF)
place(HOOK,26.18,26.18+(N/SR-HOOK),XF,.55)
# room for her words: the music gives up the band her consonants live in, and dips while she speaks
Xm=np.fft.rfft(mus,axis=0); frq=np.fft.rfftfreq(N,1/SR); Xm*=np.interp(frq,[0,900,1500,5000,7500,24000],[1,1,.42,.42,.8,.8])[:,None]; mus=np.fft.irfft(Xm,N,axis=0).astype(np.float32)
vm=v.mean(1); hp=int(.03*SR); env=np.sqrt(np.convolve(vm**2,np.ones(hp)/hp,'same')); act=(env>10**(-36/20)).astype(float)
ka=int(.04*SR); kr=int(.28*SR); dk=np.convolve(act,np.ones(ka+kr)/(ka+kr),'same'); dk=np.clip(dk*1.6,0,1); mus*=(1-.5*dk)[:,None]
up=np.interp(np.arange(N)/SR,[0,10,12.5,N/SR],[10**(3/20),10**(3/20),1,1]); mus*=up[:,None]   # a little more in the first 10 s
mix=v+fx+bed+mus; print('peak before limiter',round(float(np.abs(mix).max()),3),'clips',len(log))
tmp=OUT+'.tmp.wav'; subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','-','-af','alimiter=limit=0.84:level=disabled:attack=3:release=60','-c:a','pcm_s16le',OUT],input=mix.astype(np.float32).tobytes())
json.dump(log,open(os.path.expanduser('~/AnaVideo/work/sfx/cues.json'),'w'))
for n,a,b,c,db,s in log[:0]: pass
