const glow=document.querySelector('.cursor-glow');
const cursorGrid=document.querySelector('.cursor-grid');
const opening=document.querySelector('.opening');
const openingType=document.querySelector('.opening-type');
const openingCopy=openingType?.dataset.copy||'';
let openingIndex=0;
const typeOpening=()=>{
  if(!openingType||openingIndex>=openingCopy.length)return;
  openingType.textContent+=openingCopy[openingIndex++];
  setTimeout(typeOpening,openingCopy[openingIndex-1]===','?95:38);
};
let openingStarted=false;
const startOpening=()=>{
  if(openingStarted)return;
  openingStarted=true;
  opening?.classList.add('started');
  setTimeout(typeOpening,180);
  setTimeout(()=>opening?.remove(),3200);
};
if(document.fonts?.load){
  Promise.race([document.fonts.load("600 1em Caveat"),new Promise(resolve=>setTimeout(resolve,600))]).then(startOpening);
}else startOpening();
let lastDot=0;
window.addEventListener('pointermove',e=>{
  glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';
  const now=performance.now();
  if(now-lastDot>38&&e.pointerType!=='touch'){
    const dot=document.createElement('i');dot.className='trail-dot';
    dot.style.left=(e.clientX-23)+'px';dot.style.top=(e.clientY-23)+'px';
    document.body.appendChild(dot);setTimeout(()=>dot.remove(),760);lastDot=now;
  }
},{passive:true});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const skills=['micro-controllers','circuit analysis','embedded C','Python','C','C++','HTML','CSS','Git','VS Code','Windows Terminal','Cursor','Bash','digital logic design'];
document.querySelectorAll('.skill-note').forEach(note=>{
  let dragging=false,moved=false,startX=0,startY=0,baseX=0,baseY=0;
  const shuffle=()=>{const current=Number(note.dataset.skill);const next=(current+7)%skills.length;note.dataset.skill=String(next);const label=skills[next];const skill=note.querySelector('strong');skill.classList.remove('skill-pop');void skill.offsetWidth;skill.innerHTML=label.replace('-', '-<br>').replace(' ','<br>');skill.classList.add('skill-pop');note.setAttribute('aria-label',`${label}. Tap to shuffle or drag to move.`)};
  note.addEventListener('pointerdown',e=>{dragging=true;moved=false;note.setPointerCapture(e.pointerId);startX=e.clientX;startY=e.clientY;baseX=Number(note.dataset.x||0);baseY=Number(note.dataset.y||0);note.classList.add('dragging')});
  note.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.hypot(dx,dy)>5)moved=true;const x=baseX+dx,y=baseY+dy;note.dataset.x=String(x);note.dataset.y=String(y);note.style.translate=`${x}px ${y}px`});
  note.addEventListener('pointerup',()=>{dragging=false;note.classList.remove('dragging');if(!moved)shuffle()});
  note.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();shuffle()}});
});

document.querySelectorAll('.timeline-toggle').forEach(toggle=>toggle.addEventListener('click',()=>{
  const item=toggle.closest('.timeline-item');
  const open=item.classList.toggle('open');
  toggle.setAttribute('aria-expanded',String(open));
}));

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(filter=>filter.classList.remove('active'));
  button.classList.add('active');
  const selected=button.dataset.filter;
  document.querySelectorAll('.timeline-item').forEach(item=>{
    item.classList.toggle('hidden',selected!=='all'&&item.dataset.category!==selected);
  });
}));

const photoCards=[...document.querySelectorAll('.photo-card')];let photoIndex=0;
const showPhoto=index=>{photoIndex=index;photoCards.forEach((card,i)=>{const distance=(i-photoIndex+photoCards.length)%photoCards.length;card.style.zIndex=String(photoCards.length-distance);card.classList.toggle('is-top',distance===0)})};
photoCards.forEach((card,index)=>card.addEventListener('click',()=>{if(index!==photoIndex)return;showPhoto((photoIndex+1)%photoCards.length)}));
showPhoto(0);

const caseStudies={
  perform:{
    kicker:'ENTERPRISE PLATFORM · PRODUCT DESIGN · DATA',title:'PERFORM+',summary:'An enterprise performance platform that turns complex metrics into clear, actionable views for teams and leadership.',
    challenge:'PERFORM+ needed to turn raw performance metrics into something people across the organization — including leadership — could actually track and act on, not just a data dump of numbers.',
    approach:"I designed the platform's UI/UX using Figma, Sketch, and Adobe XD, then built out the functionality myself with Python scripts and SQL queries, and used Power BI to track the performance metrics the interface displayed. Because I owned both the interface and the data pipeline behind it, the design decisions were grounded in what the data could actually support.",
    result:'I presented the finished demo directly to the Assistant Vice President of Platforms and the project team, tracking requirement changes and communicating status throughout development. The platform went from concept to a working demo that stakeholders reviewed and gave feedback on.',
    visual:`<div class="case-gallery" aria-label="PERFORM+ project images"><button class="gallery-photo is-active" type="button" aria-label="Show next image"><img src="citiustech-dashboard.png" alt="PERFORM+ reporting and analytics dashboard"></button><button class="gallery-photo" type="button" aria-label="Show next image"><img src="citiustech-measure-year.png" alt="PERFORM+ measure-year comparison and implementation impact"></button><button class="gallery-photo" type="button" aria-label="Show next image"><img src="citiustech-cover.png" alt="CitiusTech data analytics internship presentation cover"></button><p class="gallery-hint">tap the image to flip through</p><p class="gallery-count" aria-live="polite">1 / 3</p></div>`
  },
  dreambreathe:{
    kicker:'MEDICAL DEVICE · PRODUCT DESIGN · IDEATHON',title:'DreamBreathe',summary:'A concept microCPAP device with a companion app, from physical mockup to interface.',
    challenge:"A microCPAP has to work while someone's asleep — it can't demand attention, and the interface has to communicate clearly to someone who isn't fully alert. That constraint applies to the physical device and the app equally: what the hardware can sense and hold shapes what the interface is allowed to ask of the person using it.",
    approach:"I designed both halves of the concept myself: the physical device mock-up in SolidWorks, and the companion app's interface. Rather than treating them as separate problems, I used the device's physical limits — size and sensor placement — to inform what the app's layout could realistically show, keeping the focus on UI, design, and layout clarity throughout.",
    result:'A single, connected concept — a physical device and its companion app designed with the same constraints in mind, rather than a device with an interface bolted on afterward.',
    links:[{label:'view live prototype',url:'https://wool-made-82112071.figma.site/'},{label:'view presentation',url:'https://1drv.ms/p/c/79d38c00bed11d68/IQAVFzICkaU5R6-bsRywl9MwAZMUM-Z7MqwkTYuOeUzsIIU?e=3SwTV9&nav=eyJzSWQiOjI1NiwiY0lkIjowfQ'}],
    visual:`<div class="case-gallery" aria-label="DreamBreathe project images"><button class="gallery-photo is-active" type="button" aria-label="Show next image"><img src="dreambreathe-device-front.png" alt="DreamBreathe microCPAP device assembly model"></button><button class="gallery-photo" type="button" aria-label="Show next image"><img src="dreambreathe-device-angle.png" alt="DreamBreathe microCPAP device model from above"></button><button class="gallery-photo" type="button" aria-label="Show next image"><img src="dreambreathe-cover.png" alt="DreamBreathe project presentation cover"></button><button class="gallery-photo" type="button" aria-label="Show next image"><img src="dreambreathe-site.png" alt="DreamBreathe companion website interface"></button><p class="gallery-hint">tap the image to flip through</p><p class="gallery-count" aria-live="polite">1 / 4</p></div>`
  },
  nasaorbit:{
    kicker:'HEALTH TECH · UI/UX · HACKATHON',title:'NASAOrbit',summary:"A vital-sign tracking interface for astronauts, aligned with NASA's HERA research program.",
    challenge:"NASA's HERA missions simulate long-duration spaceflight by isolating a small crew for weeks at a time, tracking their vitals continuously through wearable biosensors — heart rate, respiration, sleep, and activity. That's a lot of raw physiological data streaming in around the clock. The real problem isn't collecting it — it's making it something a mission team can actually watch without needing to stare at a live feed 24/7.",
    approach:"I independently designed the UI/UX and front-end layout for a website and app that tracks astronaut vitals over time, aligning the interface with HERA's ongoing research so it reflected the kind of longitudinal data these missions actually generate. The design question I kept coming back to was: what does a mission team need to see immediately, versus what can wait for a daily review?",
    result:'The result was a focused monitoring concept that turns continuous biometric streams into clear, reviewable patterns. Immediate changes stay visible for quick attention, while longer-term trends remain easy to revisit during daily mission review.',
    links:[{label:'view workplan',url:'https://figma.com/board/qCaMkIgMQakkj7c1ywHhk6/FigJam-Framework?node-id=0-1&t=2eQlY5Z760TiF9Xe-1'},{label:'view demo',url:'https://bone-oak-01116411.figma.site'}],
    visual:`<div class="case-gallery" aria-label="NASAOrbit project images"><button class="gallery-photo is-active" type="button" aria-label="Show next image"><img src="nasaorbit-cover.png" alt="NASAOrbit Mission Control to Man project cover"></button><button class="gallery-photo" type="button" aria-label="Show next image"><img src="nasaorbit-workplan.jpg" alt="NASAOrbit FigJam project framework and workplan"></button><button class="gallery-photo" type="button" aria-label="Show next image"><img src="nasaorbit-dashboard.png" alt="NASAOrbit cognitive performance progress dashboard"></button><p class="gallery-hint">tap the image to flip through</p><p class="gallery-count" aria-live="polite">1 / 3</p></div>`
  }
};
const dialog=document.querySelector('#case-dialog');
const openCase=key=>{
  const data=caseStudies[key];if(!data)return;
  document.querySelector('#case-kicker').textContent=data.kicker;
  document.querySelector('#case-title').textContent=data.title;
  document.querySelector('#case-summary').textContent=data.summary;
  const links=document.querySelector('#case-links');
  links.replaceChildren();
  (data.links||[]).forEach(({label,url})=>{const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label+' ↗';links.append(a)});
  document.querySelector('#case-challenge').textContent=data.challenge;
  document.querySelector('#case-approach').textContent=data.approach;
  document.querySelector('#case-result').textContent=data.result;
  document.querySelector('#case-visual').innerHTML=data.visual;
  const gallery=document.querySelector('.case-gallery');
  if(gallery){
    const photos=[...gallery.querySelectorAll('.gallery-photo')];let active=0;
    const count=gallery.querySelector('.gallery-count');
    const show=next=>{photos[active].classList.remove('is-active');active=(next+photos.length)%photos.length;photos[active].classList.add('is-active');count.textContent=`${active+1} / ${photos.length}`};
    photos.forEach(photo=>photo.addEventListener('click',event=>{event.stopPropagation();show(active+1)}));
  }
  dialog.showModal();document.body.style.overflow='hidden';dialog.scrollTop=0;
};
document.querySelectorAll('.project[data-project]').forEach(project=>{
  project.addEventListener('click',()=>openCase(project.dataset.project));
  project.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCase(project.dataset.project)}});
});
const closeCase=()=>{if(dialog.classList.contains('closing'))return;dialog.classList.add('closing');setTimeout(()=>{dialog.close();dialog.classList.remove('closing');document.body.style.overflow=''},230)};
document.querySelector('.case-close').addEventListener('click',closeCase);
dialog.addEventListener('click',e=>{if(e.target===dialog)closeCase()});
dialog.addEventListener('close',()=>document.body.style.overflow='');
