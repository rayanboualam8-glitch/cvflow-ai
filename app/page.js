'use client';
import { useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const STRIPE_LINK = 'https://buy.stripe.com/bJe7sLaTH98Z8Yw4Tpes000';
const templates = [
  ['executive','Executive','Classic premium layout for corporate jobs'],
  ['modern','Modern','Clean tech startup resume'],
  ['sidebar','Sidebar','Strong left panel with contact info'],
  ['minimal','Minimal','Simple ATS-friendly style'],
  ['bold','Bold','Big name and strong section headings'],
  ['elegant','Elegant','Refined professional design'],
  ['student','Student','Great for students and first jobs'],
  ['creative','Creative','More visual and modern'],
  ['compact','Compact','Fits more info on one page'],
  ['international','International','Neutral global resume style']
];

const dict = {
  en: { hero:'Create a professional resume in minutes', sub:'Build your resume for free. Unlock AI optimization, ATS score and a cover letter for only $1.', start:'Start free', ai:'Unlock AI Pro — $1', pdf:'Download PDF', improve:'Improve with AI', cover:'Cover letter', score:'ATS score', lang:'FR', name:'Full name', title:'Target job title', email:'Email', phone:'Phone', city:'City / Country', summary:'Professional summary', experience:'Experience', education:'Education', skills:'Skills', job:'Job offer (optional)', choose:'Choose your template' },
  fr: { hero:'Crée un CV professionnel en quelques minutes', sub:'Crée ton CV gratuitement. Débloque l’optimisation IA, le score ATS et la lettre de motivation pour 1 $.', start:'Commencer gratuitement', ai:'Débloquer AI Pro — 1 $', pdf:'Télécharger PDF', improve:'Améliorer avec IA', cover:'Lettre de motivation', score:'Score ATS', lang:'EN', name:'Nom complet', title:'Poste recherché', email:'Email', phone:'Téléphone', city:'Ville / Pays', summary:'Résumé professionnel', experience:'Expérience', education:'Études', skills:'Compétences', job:'Offre d’emploi (optionnel)', choose:'Choisis ton modèle' }
};

export default function Page(){
  const [lang,setLang]=useState('en'); const t=dict[lang];
  const [tpl,setTpl]=useState('modern');
  const [loading,setLoading]=useState(false); const [ai,setAi]=useState(null); const [modal,setModal]=useState(false);
  const [form,setForm]=useState({name:'Alex Morgan',title:'Marketing Assistant',email:'alex@example.com',phone:'+1 555 0100',city:'Toronto, Canada',summary:'Motivated professional with experience in customer service, communication and organization.',experience:'Customer Service Associate — Helped customers, handled transactions, solved problems and supported daily operations.',education:'Business Administration Diploma — 2025',skills:'Communication, teamwork, Microsoft Office, customer service, problem solving',job:''});
  const update=e=>setForm({...form,[e.target.name]:e.target.value});
  async function improve(){ setLoading(true); setModal(false); try{ const r=await fetch('/api/improve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const j=await r.json(); setAi(j); }catch(e){ alert('AI error. Check OPENAI_API_KEY on Vercel.'); } setLoading(false); }
  async function downloadPDF(){ const el=document.getElementById('resume'); const canvas=await html2canvas(el,{scale:2}); const img=canvas.toDataURL('image/png'); const pdf=new jsPDF('p','mm','a4'); const w=210; const h=canvas.height*w/canvas.width; pdf.addImage(img,'PNG',0,0,w,h); pdf.save('cvflow-resume.pdf'); }
  const content=useMemo(()=>({summary:ai?.improvedSummary||form.summary, exp:ai?.improvedExperience||form.experience, skills:ai?.improvedSkills||form.skills}),[ai,form]);
  return <main>
    <nav><b>CVFlow AI</b><div><button onClick={()=>setLang(lang==='en'?'fr':'en')}>{t.lang}</button><a className="ghost" href={STRIPE_LINK} target="_blank">Stripe</a></div></nav>
    <section className="hero"><div><span className="badge">AI Resume Builder</span><h1>{t.hero}</h1><p>{t.sub}</p><a href="#builder" className="cta">{t.start}</a></div><div className="heroCard"><div className="score">94</div><p>ATS optimized resume + cover letter</p></div></section>
    <section id="builder" className="grid">
      <div className="panel"><h2>{t.choose}</h2><div className="templates">{templates.map(x=><button key={x[0]} onClick={()=>setTpl(x[0])} className={tpl===x[0]?'active':''}><b>{x[1]}</b><small>{x[2]}</small></button>)}</div><h2>Information</h2>{['name','title','email','phone','city'].map(k=><input key={k} name={k} value={form[k]} onChange={update} placeholder={t[k]} />)}<textarea name="summary" value={form.summary} onChange={update} placeholder={t.summary}/><textarea name="experience" value={form.experience} onChange={update} placeholder={t.experience}/><textarea name="education" value={form.education} onChange={update} placeholder={t.education}/><textarea name="skills" value={form.skills} onChange={update} placeholder={t.skills}/><textarea name="job" value={form.job} onChange={update} placeholder={t.job}/><div className="actions"><button onClick={downloadPDF}>{t.pdf}</button><button className="pro" onClick={()=>setModal(true)}>{t.ai}</button></div></div>
      <div className="preview"><div id="resume" className={'resume '+tpl}><header><h1>{form.name}</h1><h3>{form.title}</h3><p>{form.email} · {form.phone} · {form.city}</p></header><section><h2>Profile</h2><p>{content.summary}</p></section><section><h2>Experience</h2><p>{content.exp}</p></section><section><h2>Education</h2><p>{form.education}</p></section><section><h2>Skills</h2><p>{content.skills}</p></section></div>{ai&&<div className="aiBox"><h2>{t.score}: {ai.score || 88}/100</h2><ul>{(ai.improvements||[]).slice(0,5).map((x,i)=><li key={i}>{x}</li>)}</ul><h3>{t.cover}</h3><p>{ai.coverLetter}</p></div>}</div>
    </section>
    {modal&&<div className="modal"><div><button className="x" onClick={()=>setModal(false)}>×</button><h2>AI Pro</h2><p>Unlock resume rewrite, ATS score, personalized cover letter and interview tips for only $1.</p><a className="cta" href={STRIPE_LINK} target="_blank">Pay $1 with Stripe</a><button onClick={improve} disabled={loading}>{loading?'Improving...':'Demo / Run AI now'}</button></div></div>}
  </main>
}
