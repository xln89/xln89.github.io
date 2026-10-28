const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=k=>`assets/${encodeURIComponent(k)}${/\.(?:png|jpe?g|webp)$/i.test(k)?'':'.jpg'}`;
const projectUrl=id=>`project.html?id=${encodeURIComponent(id)}`;
const pubUrl=id=>`publication.html?id=${encodeURIComponent(id)}`;
const doiUrl=doi=>`https://doi.org/${encodeURIComponent(doi).replaceAll('%2F','/')}`;
const external='target="_blank" rel="noopener noreferrer"';
const authors=p=>p.authors.map(a=>a==='Lina Xu'?'<strong>Lina Xu'+(p.corresponding?'<sup class="corresponding-star" aria-label="Corresponding author">*</sup>':'')+'</strong>':esc(a)).join(', ');

function setupNavigation(){
 const menu=$('.menu-toggle'),nav=$('#main-nav');if(!menu||!nav)return;
 const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
 $$('a',nav).forEach(a=>a.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
}
function labels(p){return `<div class="pub-labels"><span>${esc(p.year)} · ${esc(p.status)}</span>${p.firstAuthor?'<span class="author-label">First author</span>':''}${p.corresponding?'<span class="author-label corresponding-label">Corresponding author</span>':''}${p.award?`<span class="award">${esc(p.award)}</span>`:''}</div>`;}
function journalMetrics(p){
 const m=p.metrics;if(!m||p.group!=='journal')return '';
 const badge=(label,url,title,extra='')=>`<a class="journal-metric ${extra}" href="${esc(url)}" ${external} title="${esc(title)}">${label}</a>`;
 return `<div class="journal-metrics" aria-label="Journal rankings and impact factor">${m.jcrQuartile?badge('JCR '+esc(m.jcrQuartile),m.quartileSource,`Best JCR quartile · ${m.jcrDataYear} data / 2026 release`):''}${m.casTier?badge('CAS Tier '+esc(m.casTier),m.casSource,`中科院${m.casTier}区 · ${m.casEdition}`):''}${badge('JIF '+esc(m.jif)+' <span class="metric-year">('+esc(m.jifYear)+')</span>',m.jifSource,`${m.jifYear} Journal Impact Factor · released 2026`)}${m.casTop?badge('CAS Top',m.casSource,`中科院 Top 期刊 · ${m.casEdition}`,'metric-top'):''}</div>`;
}
function pubRow(p){return `<article class="pub-picture-row" data-publication="${esc(p.slug)}"><a class="pub-picture" href="${pubUrl(p.slug)}" aria-label="Details: ${esc(p.title)}"><img src="${image(p.image)}" loading="lazy" alt="${esc(p.imageCaption)}" width="500" height="300"></a><div>${labels(p)}<h4><a href="${pubUrl(p.slug)}">${esc(p.title)}</a></h4><p class="pub-authors">${authors(p)}</p><p class="pub-venue">${esc(p.venue)}</p>${journalMetrics(p)}<p class="pub-details-line">${esc(p.details||'')}</p><p class="pub-description">${esc(p.contribution)}</p><div class="pub-links"><a href="${pubUrl(p.slug)}">Details →</a>${p.doi?`<a href="${doiUrl(p.doi)}" ${external}>DOI ↗</a>`:''}${p.project?`<a href="${projectUrl(p.project)}">Project →</a>`:''}</div></div></article>`;}
function renderPublications(pubs,filter='all'){
 const root=$('#publication-list');if(!root)return;
 const shown=pubs.filter(p=>filter==='all'||(filter==='first'?(p.firstAuthor||p.corresponding):(!p.firstAuthor&&!p.corresponding)));
 const groups=[['journal','Journal Articles'],['conference','Conference Papers & Proceedings'],['review','Manuscripts Under Review']];
 root.innerHTML=groups.map(([id,title])=>{const list=shown.filter(p=>p.group===id);return list.length?`<section class="pub-group" id="${id}-articles"><div class="pub-group-heading"><h3>${title}</h3><span>${list.length} ${list.length===1?'record':'records'}</span></div>${list.map(pubRow).join('')}</section>`:'';}).join('');
 const status=$('#pub-status');if(status)status.textContent=`Showing ${shown.length} records.`;
}
function bindPublicationFilters(pubs){$$('[data-pub-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-pub-filter]').forEach(x=>{const active=b===x;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});renderPublications(pubs,b.dataset.pubFilter);}));}
function workCard(p){return `<article><a class="work-card" href="${projectUrl(p.id)}"><div class="work-image ${esc(p.id)}"><img src="${image(p.image)}" alt="${esc(p.title)}" loading="lazy" width="800" height="510">${p.id==='cma'?`<img src="${image('cma_palette')}" alt="Original CMA colour-system specification" loading="lazy" width="400" height="200">`:''}</div><div class="work-caption"><div><h3>${esc(p.title)}</h3><p>${esc(p.short)}</p></div><span class="work-arrow" aria-hidden="true">↗</span></div></a></article>`;}
function renderWorks(projects,category='All'){
 const featured=$('#featured-projects');if(featured)featured.innerHTML=projects.filter(p=>p.kind==='Design'&&p.featured).sort((a,b)=>a.featuredOrder-b.featuredOrder).map(workCard).join('');
 const all=$('#all-projects');if(all){const list=projects.filter(p=>p.kind==='Design'&&(category==='All'||p.category===category));all.innerHTML=list.map(workCard).join('');const counter=$('#archive-count');if(counter)counter.textContent=`${list.length} projects${category==='All'?'':' / '+category}`;}
}
function renderTeaching(projects){const root=$('#teaching-cases');if(!root)return;root.innerHTML=projects.filter(p=>p.kind==='Teaching').map((p,i)=>`<article class="course-feature"><div><a class="course-cover" href="${projectUrl(p.id)}"><img src="${image(p.image)}" alt="${esc(p.credit)}" loading="lazy" width="1000" height="650"></a></div><div class="course-copy"><p class="eyebrow">0${i+1} / UNDERGRADUATE MODULE</p><h3>${esc(p.title)}</h3><p>${esc(p.intro)}</p><p class="course-credit">${esc(p.credit)}</p><div class="course-student-links" aria-label="Selected student projects">${(p.studentCases||[]).map(c=>`<a href="${projectUrl(p.id)}#student-${esc(c.id)}">${esc(c.student)} ↗</a>`).join('')}</div><a class="text-link" href="${projectUrl(p.id)}">View ${p.studentCases?.length||''} student projects & course case →</a></div></article>`).join('');}
function studentShowcase(cases){
 if(!cases?.length)return '';
 return `<section class="student-showcase" aria-labelledby="student-work-title"><div class="student-showcase-heading"><div><p class="eyebrow">STUDENT WORK / INSTRUCTOR: LINA XU</p><h2 id="student-work-title">Selected student projects</h2></div></div><nav class="student-jump-links" aria-label="Student projects">${cases.map(c=>`<a href="#student-${esc(c.id)}">${esc(c.student)} →</a>`).join('')}</nav>${cases.map((c,i)=>`<article class="student-case ${c.layout==='phone'?'phone-case':''}" id="student-${esc(c.id)}"><div class="student-case-heading"><div><p class="eyebrow">0${i+1} / ${esc(c.student)}</p><h3>${esc(c.title)}</h3></div><p>${esc(c.focus)}</p></div>${gallery(c.images)}</article>`).join('')}</section>`;
}
function processShowcase(items){
 if(!items?.length)return '';
 return `<section class="process-showcase"><h2>Research & development</h2>${gallery(items)}</section>`;
}

function gallery(items,showCaptions=false){return `<div class="project-gallery">${items.map(([key,caption],i)=>`<figure${i===0?' class="wide"':''}><button class="gallery-button" data-image="${image(key)}" data-caption="${showCaptions?esc(caption):''}" aria-label="Enlarge: ${esc(caption)}"><img src="${image(key)}" alt="${esc(caption)}" ${i?'loading="lazy"':''}></button>${showCaptions&&caption?`<figcaption>${esc(caption)}</figcaption>`:''}</figure>`).join('')}</div>`;}
function bindViewer(){const viewer=$('#image-viewer');if(!viewer)return;$$('[data-image]').forEach(b=>b.addEventListener('click',()=>{const pic=$('img',viewer);pic.src=b.dataset.image;pic.alt=b.dataset.caption;$('p',viewer).textContent=b.dataset.caption;viewer.showModal();}));$('.viewer-close',viewer)?.addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target!==viewer)return;const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();});}
function renderProject(projects){
 const root=$('#page-content');const id=new URLSearchParams(location.search).get('id');const p=projects.find(x=>x.id===id);
 if(!p){root.innerHTML='<h1>Project not found</h1><a href="projects.html">Browse all projects →</a>';return;}
 document.title=`${p.title} — Lina Xu`;const teaching=p.kind==='Teaching';
 root.innerHTML=`<a class="back-link" href="${teaching?'index.html#teaching':p.kind==='Research'?'index.html#publications':'projects.html'}">← ${teaching?'Teaching':p.kind==='Research'?'Publications':'All projects'}</a><p class="eyebrow">${esc(p.kind)} / ${esc(p.meta)}</p><h1 class="project-title">${esc(p.title)}</h1><p class="project-intro">${esc(p.intro)}</p><dl class="project-meta"><div><dt>CONTEXT</dt><dd>${esc(p.meta)}</dd></div><div><dt>MY ROLE</dt><dd>${esc(p.role)}</dd></div></dl>${p.kind==='Design'?`<div class="case-sections design-overview"><section><h2>About the project</h2><p>${esc(p.overview)}</p></section></div>`:`<div class="case-sections"><section><h2>${teaching?'Learning objectives':p.kind==='Research'?'Research question':'The project'}</h2><p>${esc(p.question)}</p></section><section><h2>${teaching?'Teaching sequence':p.kind==='Research'?'Approach':'Practice & process'}</h2><p>${esc(p.approach)}</p></section>${p.assessment?`<section class="assessment-section"><h2>Assessment & evidence</h2><p>${esc(p.assessment)}</p></section>`:''}</div>`}${p.credit?`<p class="course-caption">${esc(p.credit)}</p>`:''}${teaching?studentShowcase(p.studentCases):''}${p.gallery.length?gallery(p.gallery,p.kind==='Research'):''}${processShowcase(p.processGallery)}<div class="project-return">${p.doi?`<a href="${doiUrl(p.doi)}" ${external}>Publication ↗</a>`:''}<a href="${teaching?'index.html#teaching':'projects.html'}">${teaching?'Other teaching cases':'All projects'} →</a></div>`;bindViewer();if(location.hash)requestAnimationFrame(()=>document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
}
function renderPublication(pubs){
 const root=$('#page-content'),id=new URLSearchParams(location.search).get('id'),p=pubs.find(x=>x.slug===id);
 if(!p){root.innerHTML='<h1>Publication not found</h1><a href="publications.html">All publications →</a>';return;}
 document.title=`${p.title} — Lina Xu`;
 root.innerHTML=`<a class="back-link" href="index.html#publications">← All publications</a>${labels(p)}<h1 class="publication-title">${esc(p.title)}</h1><div class="publication-detail-meta"><p class="pub-authors">${authors(p)}</p><p class="pub-venue">${esc(p.venue)}</p>${journalMetrics(p)}<p class="pub-details-line">${esc(p.details||'')}</p></div><p class="paper-overview">${esc(p.contribution)}</p><figure class="publication-figure"><button class="gallery-button" data-image="${image(p.image)}" data-caption="${esc(p.imageCaption)}" aria-label="Enlarge research figure"><img src="${image(p.image)}" alt="${esc(p.imageCaption)}"></button><figcaption>${esc(p.imageCaption)}</figcaption></figure><a class="figure-original-link" href="${image(p.image)}" ${external}>Open full-resolution figure ↗</a><div class="project-return">${p.doi?`<a href="${doiUrl(p.doi)}" ${external}>Read publication / DOI ↗</a>`:''}${p.project?`<a href="${projectUrl(p.project)}">Explore the research case →</a>`:''}<a href="publications.html">Full publication list →</a></div>`;bindViewer();
}
function renderArchive(projects){
 const root=$('#page-content');const categories=['All',...new Set(projects.filter(p=>p.kind==='Design').map(p=>p.category))];
 root.innerHTML=`<p class="eyebrow">PERSONAL PROJECT ARCHIVE</p><h1>Projects</h1><p class="subpage-lede">Visual identities, interactive installations, digital experiences, publications and image-making. Each project opens a dedicated page with its original outcomes and supporting material.</p><div class="archive-filters" role="group" aria-label="Filter projects">${categories.map((c,i)=>`<button data-category="${esc(c)}" class="${i?'':'active'}" aria-pressed="${!i}">${esc(c)}</button>`).join('')}</div><p class="archive-count" id="archive-count" aria-live="polite"></p><div class="work-grid" id="all-projects"></div>`;
 renderWorks(projects);$$('[data-category]').forEach(b=>b.addEventListener('click',()=>{$$('[data-category]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderWorks(projects,b.dataset.category);}));
}
function renderPublicationPage(pubs){$('#page-content').innerHTML='<p class="eyebrow">RESEARCH & SCHOLARSHIP</p><h1>Publications</h1><p class="subpage-lede">Journal articles and conference proceedings, first-author work first within each group. Manuscripts under review are separate.</p><div class="publication-filters" role="group" aria-label="Filter publications"><button class="active" data-pub-filter="all" aria-pressed="true">All publications</button><button data-pub-filter="first" aria-pressed="false">First & corresponding author</button><button data-pub-filter="collaborative" aria-pressed="false">Collaborative</button></div><p class="sr-only" id="pub-status" aria-live="polite"></p><div id="publication-list"></div>';renderPublications(pubs);bindPublicationFilters(pubs);}
function renderCv(pubs){$('#page-content').innerHTML=`<div class="cv-summary"><p class="eyebrow">ACADEMIC PROFILE / SELECTED RECORD</p><h1>Lina Xu <span lang="zh-Hans">徐丽娜</span></h1><p class="subpage-lede">PhD Candidate in Computational Media and Arts<br>The Hong Kong University of Science and Technology (Guangzhou)<br>Expected graduation: 2027</p><div class="cv-actions"><button class="print-button" id="print-cv">Print / save PDF</button><a href="mailto:lxu582@connect.hkust-gz.edu.cn">Email ↗</a></div><section><h2>Research</h2><p>Colour cognition; neuroergonomics; physiological computing; visual design and cognitive performance; controlled experiments; fNIRS; EEG; eye tracking; EDA; interpretable multimodal modelling.</p><p>Extending research in colour and visual cognition towards evidence-informed, cognition-aware, personalised and adaptive human–AI interaction.</p></section><section><h2>Education</h2><dl><dt>PhD, Computational Media and Arts</dt><dd>HKUST (Guangzhou) · Expected 2027</dd><dt>MA, Interaction Design Communication</dt><dd>University of the Arts London · 2019–2021</dd><dt>BA, Visual Communication Design</dt><dd>Beijing Institute of Graphic Communication · 2015–2019</dd></dl></section><section><h2>University teaching</h2><p><strong>Full-time Lecturer</strong> · Sichuan University of Media and Communications<br>February 2021–June 2023</p><p>Independent course teaching and assessment: UI Design, App Design and New Media Web Design.</p></section><section class="academic-section" id="background" aria-labelledby="background-title">
  <div class="section-heading"><div><p class="eyebrow">ACADEMIC BACKGROUND</p><h2 id="background-title">Education & Experience</h2></div></div>
  <div class="background-grid">
    <div><h3 class="record-group-title">Education</h3>
      <article class="education-record"><a class="institution-logo hkust-mark" href="https://www.hkust-gz.edu.cn/" target="_blank" rel="noopener noreferrer" aria-label="HKUST Guangzhou website"><img src="assets/logo-hkust.png" width="104" height="72" alt="HKUST Guangzhou logo" loading="lazy"></a><div><h4>PhD in Computational Media and Arts</h4><p>The Hong Kong University of Science and Technology (Guangzhou)</p><p class="record-date">2023 – 2027 (expected)</p><p class="record-detail">Full scholarship · Supervisors: Luwen Yu and Yuyang Wang</p></div></article>
      <article class="education-record"><a class="institution-logo ual-mark" href="https://www.arts.ac.uk/" target="_blank" rel="noopener noreferrer" aria-label="University of the Arts London website"><img src="assets/logo-ual.png" width="104" height="72" alt="University of the Arts London logo" loading="lazy"></a><div><h4>MA in Interaction Design Communication</h4><p>University of the Arts London</p><p class="record-date">Sep 2019 – Mar 2021</p></div></article>
      <article class="education-record"><a class="institution-logo bigc-mark" href="https://www.bigc.edu.cn/" target="_blank" rel="noopener noreferrer" aria-label="Beijing Institute of Graphic Communication website"><img src="assets/logo-bigc.jpg" width="104" height="72" alt="Beijing Institute of Graphic Communication logo" loading="lazy"></a><div><h4>BA in Visual Communication Design</h4><p>Beijing Institute of Graphic Communication</p><p class="record-date">Sep 2015 – Jun 2019</p><p class="record-detail">Outstanding Graduate</p></div></article>
    </div>
    <div><h3 class="record-group-title">Teaching appointments</h3>
      <article class="experience-record institution-experience"><a class="institution-logo sumc-mark" href="https://www.scmc.edu.cn/" target="_blank" rel="noopener noreferrer" aria-label="Sichuan University of Media and Communications website"><img src="assets/logo-sumc.png" width="72" height="72" alt="Sichuan University of Media and Communications logo" loading="lazy"></a><div><h4>Full-time Lecturer</h4><p>Sichuan University of Media and Communications</p><p class="record-date">Feb 2021 – Jun 2023</p><p class="record-detail">Independent teaching and assessment: UI Design, App Design and New Media Web Design.</p></div></article>
      <article class="experience-record"><h4>Teaching Assistant</h4><p>HKUST (Guangzhou)</p><p class="record-date">Spring 2026</p><p class="record-detail">CMAA5041 · Experiment Design for Protocol Optimization. Postgraduate research methods, paper discussions and first marking under formal double marking.</p></article>
      
    </div>
  </div>
  <div class="academic-records-grid">
    <section aria-labelledby="honours-title"><h3 class="recognition-heading" id="honours-title">Awards & Recognition</h3>
      <article class="academic-record award-record"><span class="record-year">2024</span><div><h4>Best Paper Award</h4><p>International Colour Association Conference</p><a class="record-link" href="publication.html?id=reading-background-colour-gender">View the paper →</a></div></article>
      <article class="academic-record"><span class="record-year">2022</span><div><h4>Outstanding Instructor Award</h4><p>Sichuan Original Animation Competition</p></div></article>
      <article class="academic-record"><span class="record-year">2025</span><div><h4>Certificate of Appreciation</h4><p>First Sino-Arab Innovation & Entrepreneurship Forum</p></div></article>
      <article class="academic-record"><span class="record-year">2024</span><div><h4>Certificate of Recognition</h4><p>HKUST(GZ) Computational Media and Arts visual identity</p></div></article>
    </section>
    <section aria-labelledby="funding-title"><h3 id="funding-title">Research Funding & Mobility</h3>
      <article class="funding-record"><p class="record-kicker">RESEARCH CONTRIBUTOR · JUN 2025 – JUN 2026</p><h4>Guangdong Basic and Applied Basic Research Funding</h4><p class="record-date">Project AGP2024M0022</p><p class="record-detail">Contributed to cognitive experiments, multimodal analysis and interpretable modelling.</p></article>
      <article class="funding-record"><p class="record-kicker">CSC FUNDING AWARDED · FORTHCOMING VISIT</p><h4>Visiting PhD Research Practicum</h4><p>UNSW Sydney · Host: Prof. Benjamin Tag</p><p class="record-detail">Human-centred sensing and personalised interaction.</p></article>
      <div class="academic-service"><h3>Academic Service</h3><p>Peer reviewer for ACM CHI, <i>Educational Technology Research and Development</i>, <i>International Journal of Human–Computer Interaction</i> and <i>Journal of Computer Assisted Learning</i>.</p></div>
    </section>
  </div>
</section>
<section><h2>Publications</h2><div id="publication-list"></div></section></div>`;renderPublications(pubs);$('#print-cv')?.addEventListener('click',()=>window.print());}
async function start(){setupNavigation();try{
 const data=window.siteData||await (async()=>{const [projects,publications]=await Promise.all(['projects.json','publications.json'].map(u=>fetch(u).then(r=>{if(!r.ok)throw Error(u);return r.json();})));return {projects,publications};})();
 const {projects,publications}=data,page=document.body.dataset.page;
 if(page==='home'){renderPublications(publications);renderWorks(projects);renderTeaching(projects);bindPublicationFilters(publications);}
 if(page==='project')renderProject(projects);
 if(page==='projects')renderArchive(projects);
 if(page==='publication')renderPublication(publications);
 if(page==='publications')renderPublicationPage(publications);
 if(page==='cv')renderCv(publications);
 }catch(e){console.error(e);const root=$('#page-content')||$('#publication-list');if(root)root.innerHTML='<p class="prototype-note">Content could not load. Keep the complete website folder together, including content.js and assets.</p>';}}
start();
