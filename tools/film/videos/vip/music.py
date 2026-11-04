"""Builds the VIP music bed from her song: one "oooh", then a sample-aligned instrumental loop, then the close into the hook. Writes ~/AnaVideo/out/kit/vip-bed.wav and prints the numbers audio.json needs.
Why a built bed and not clips: loop points must line up to the sample and the song's bar is measured here, not guessed."""
import os,subprocess,numpy as np
from scipy.signal import stft
SR=48000; F=os.path.expanduser('~/Downloads/ana calin sound effects/Each Day Gets Better.mp3'); O=os.path.expanduser('~/AnaVideo/out/kit/vip-bed.wav')
s=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',F,'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout,'f4').reshape(-1,2); m=s.mean(1)
_,_,Z=stft(m,SR,nperseg=2048,noverlap=1536); hop=512/SR; f=np.arange(Z.shape[0])*SR/2048; M=np.log1p(np.abs(Z[f<2500])*50)
def sim(x,y,d=.9):
    i,j,n=int(x/hop),int(y/hop),int(d/hop); A,B=M[:,i:i+n].ravel(),M[:,j:j+n].ravel(); return float(np.corrcoef(A,B)[0,1])
def align(y,x,w=.05,d=.3):  # sample-accurate: slide x so the waves after the join agree
    a=m[int(y*SR):int((y+d)*SR)]; best,bo=-2,0
    for o in range(-int(w*SR),int(w*SR),8):
        b=m[int(x*SR)+o:int(x*SR)+o+len(a)]; c=float(np.dot(a,b)/(np.linalg.norm(a)*np.linalg.norm(b)+1e-9))
        if c>best: best,bo=c,o
    return x+bo/SR,best
VOX=10.05  # her song's first "oooh" starts just after this
# the loop: longest clean one inside the intro
cands=[]
for L in (4.8,7.2,2.4):
    for y in np.arange(4.5,VOX-.95,.01):
        for dL in np.arange(-.04,.041,.005):
            x=y-L-dL
            if x>=1.5: cands.append((sim(y,x),L,round(x,3),round(y,3)))
    cands=sorted(cands,reverse=True)[:3] if L==4.8 else cands
print('loop candidates',sorted(cands,reverse=True)[:4])
top={L:max(c for c in cands if c[1]==L) for L in set(c[1] for c in cands)}
v,L,x,y=top.get(4.8) if top.get(4.8,(0,))[0]>.86 else max(top.values())
x,c=align(y,x); print('loop',round(x,4),round(y,4),'len',round(y-x,4),'sim',round(v,3),'wave',round(c,3))
XF=int(.07*SR); r=np.linspace(0,np.pi/2,XF); fo,fi=np.cos(r)[:,None],np.sin(r)[:,None]
def join(b,seg):
    b=b.copy(); b[-XF:]=b[-XF:]*fo+seg[:XF]*fi; return np.vstack([b,seg[XF:]])
# open: the song from the start through the one "oooh", into the loop
best=max((sim(Y,X,.5),Y,X) for Y in np.arange(14.6,15.95,.02) for X in np.arange(max(x,2),y-.6,.01)); Y1,X1=best[1],best[2]; X1,c1=align(Y1,X1); print('out of the oooh',round(Y1,3),'to',round(X1,3),'sim',round(best[0],3),'wave',round(c1,3))
bed=s[int(.95*SR):int((Y1+.07)*SR)]; bed=join(bed,s[int(X1*SR):int((y+.07)*SR)])
while len(bed)<36*SR: bed=join(bed,s[int(x*SR):int((y+.07)*SR)])
P=len(bed)/SR
# close: instrumental into the hook, which lands at song 26.18
H=26.18; b2=max((sim(Y,H-.5,.5),Y) for Y in np.arange(7,VOX-.1,.01)); Y2=b2[1]+.5; 
Y2,c2=align(H,Y2,.06); print('into the hook from',round(Y2,3),'sim',round(b2[0],3),'wave',round(c2,3))
lead=s[int((Y2-(y-x))*SR):int((Y2+.07)*SR)]; lead0=s[int((Y2-2*(y-x))*SR):int((Y2-(y-x)+.07)*SR)] if Y2-2*(y-x)>1.5 else s[int(x*SR):int((y+.07)*SR)]
cl=join(lead0,lead); hook_at=len(cl)/SR-.07; cl=join(cl,s[int(H*SR):int((H+14)*SR)])
gap=np.zeros((SR,2),'f4'); out=np.vstack([bed,gap,cl]); Q=(len(bed)+len(gap))/SR
subprocess.run(['ffmpeg','-y','-nostdin','-v','error','-f','f32le','-ar',str(SR),'-ac','2','-i','-',O],input=out.tobytes(),check=True)
print('open_len',round(P,3),'close_start',round(Q,3),'hook_after',round(hook_at,3))
