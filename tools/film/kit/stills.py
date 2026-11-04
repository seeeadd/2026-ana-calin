import asyncio,os,sys
from playwright.async_api import async_playwright
from PIL import Image
# python3 tools/film/kit/stills.py <video> <tag> "12.3,45.6,..."   recording seconds, both shapes, plus one contact sheet per shape. The cheapest way to check a note: look at the sheet, not at frames.
video,tag=sys.argv[1:3]; times=[float(x) for x in sys.argv[3].split(',')]; OUT=os.path.expanduser('~/AnaVideo/work/sheet/kit/'); os.makedirs(OUT,exist_ok=True)
async def run(p,shape,w,h,q):
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':w,'height':h}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('requestfailed',lambda r:errs.append('FAIL '+r.url) if 'fonts.g' not in r.url else None)
    await pg.goto(f'http://localhost:8768/tools/film/kit.html?video={video}{q}',wait_until='load'); await pg.wait_for_selector('body[data-ready]',timeout=90000,state='attached'); fs=[]
    for s in times:
        t=await pg.evaluate('(s)=>window.__T(s)',s); await pg.evaluate('(t)=>window.render(t)',t); f=OUT+f'{tag}-{shape}-{s:07.2f}.jpg'; await pg.screenshot(path=f,type='jpeg',quality=82); fs.append(f)
    print(shape,errs[:6] or 'no errors'); await b.close(); return fs
async def main():
    async with async_playwright() as p: a,c=await asyncio.gather(run(p,'d',1560,1008,''),run(p,'p',1080,1920,'&v=p'))
    for n,fs,tw,cols in (('d',a,620,3),('p',c,300,6)):
        ims=[Image.open(f) for f in fs]; th=int(ims[0].height*tw/ims[0].width); rows=(len(ims)+cols-1)//cols; S=Image.new('RGB',(cols*tw,rows*th),'white')
        for i,m in enumerate(ims): S.paste(m.resize((tw,th)),(i%cols*tw,i//cols*th))
        S.save(OUT+f'{tag}-sheet-{n}.jpg',quality=84); print(OUT+f'{tag}-sheet-{n}.jpg')
asyncio.run(main())
