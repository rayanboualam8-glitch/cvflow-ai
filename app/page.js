'use client';
import { useState } from 'react';

const stripeLink = process.env.NEXT_PUBLIC_STRIPE_LINK || 'https://buy.stripe.com/fZu3cvaTH1Gx8Yw71xes002';
const templateNames = ['ATS Classic','Modern','Executive','Tech','Creative','Minimal','Corporate','Elegant','Sidebar','Premium'];

export default function Home(){
  const [lang,setLang]=useState('EN');
  const [modal,setModal]=useState(false);
  const [template,setTemplate]=useState('ATS Classic');
  const [ai,setAi]=useState(null);
  const [loading,setLoading]=useState(false);
  const [f,setF]=useState({name:'Your Name', title:'Customer Service Associate', email:'email@example.com', phone:'(000) 000-0000', city:'Your City', summary:'Motivated and reliable candidate with strong communication, teamwork and problem-solving skills.', experience:'Customer Service Associate — 2023-2025\n• Helped customers with orders and questions\n• Worked in a fast-paced team environment\n• Handled daily responsibilities with reliability', education:'High School Diploma — 2024', skills:'Communication, teamwork, customer service, Microsoft Office, organization', job:'Retail Associate'});
  const t = {
    EN:{hero:'Create a professional resume in minutes', sub:'Build one free ATS-friendly resume. Unlock 10 premium resumes, 3 cover letters, ATS score and interview prep for only $1.29 CAD.', start:'Create my resume', pro:'Unlock AI Pro — $1.29 CAD', free:'Continue free', download:'Download free CV'},
    FR:{hero:'Crée un CV professionnel en quelques minutes', sub:'Génère 1 CV gratuit compatible ATS. Débloque 10 CV premium, 3 lettres, score ATS et préparation entretien pour seulement 1,29 $ CAD.', start:'Créer mon CV', pro:'Débloquer AI Pro — 1,29 $ CAD', free:'Continuer gratuitement', download:'Télécharger le CV gratuit'}
  }[lang];
  const update=(k,v)=>setF({...f,[k]:v});
  const localAts = scoreResume(f);
  const cls = template.toLowerCase().split(' ')[0];
  async function runAi(){
    setLoading(true);
    try{const r=await fetch('/api/improve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f, localScore: localAts.score})});setAi(await r.json());}
    catch(e){setAi({atsScore:80, improvements:['Demo mode active'], coverLetters:['Add OpenAI API key in Vercel to activate real AI.'], interviewQuestions:['Tell me about yourself.']});}
    setLoading(false);
  }
  function printCv(){window.print()}
  return <main>
    <nav className="nav"><div className="logo">CVFlow <span>AI</span></div><div className="nav-actions"><button className="btn ghost" onClick={()=>setLang(lang==='EN'?'FR':'EN')}>{lang==='EN'?'FR':'EN'}</button><button className="btn primary" onClick={()=>setModal(true)}>{t.pro}</button></div></nav>
    <section className="hero">
      <div><div className="badge">🚀 Launch offer — $1.29 CAD</div><h1>{t.hero}</h1><p>{t.sub}</p><div className="nav-actions"><button className="btn primary" onClick={()=>document.getElementById('builder')?.scrollIntoView({behavior:'smooth'})}>{t.start}</button><button className="btn ghost" onClick={()=>setModal(true)}>See Pro Pack</button></div><div className="stats"><div className="stat"><b>1</b><br/>Free resume</div><div className="stat"><b>10</b><br/>Premium CVs</div><div className="stat"><b>3</b><br/>Cover letters</div></div></div>
      <div className="hero-card"><div className="resume-preview"><h2>{f.name}</h2><p>{f.title}</p><div className="line"/><div className="line" style={{width:'70%'}}/><h3>Experience</h3><div className="line"/><div className="line"/><h3>Skills</h3><div className="line"/><div className="line" style={{width:'55%'}}/></div></div>
    </section>
    <section className="section" id="builder"><div className="builder">
      <div className="panel"><h2>Resume Builder</h2><label>Name</label><input value={f.name} onChange={e=>update('name',e.target.value)}/><label>Job title</label><input value={f.title} onChange={e=>update('title',e.target.value)}/><div className="grid2"><div><label>Email</label><input value={f.email} onChange={e=>update('email',e.target.value)}/></div><div><label>Phone</label><input value={f.phone} onChange={e=>update('phone',e.target.value)}/></div></div><label>City / Country</label><input value={f.city} onChange={e=>update('city',e.target.value)}/><label>Professional summary</label><textarea value={f.summary} onChange={e=>update('summary',e.target.value)}/><label>Experience</label><textarea value={f.experience} onChange={e=>update('experience',e.target.value)}/><label>Education</label><textarea value={f.education} onChange={e=>update('education',e.target.value)}/><label>Skills</label><textarea value={f.skills} onChange={e=>update('skills',e.target.value)}/><label>Target job</label><input value={f.job} onChange={e=>update('job',e.target.value)}/><h3>Free template</h3><div className="templates">{templateNames.map((n,i)=><button key={n} className={'tpl '+(template===n?'active':'')} onClick={()=> i===0?setTemplate(n):setModal(true)}>{n}{i>0?' 🔒':''}</button>)}</div><button className="btn" onClick={printCv}>{t.download}</button><button className="btn primary" onClick={()=>setModal(true)} style={{width:'100%',marginTop:12}}>{t.pro}</button></div>
      <div className="panel"><div className="ats-box"><h2>Free ATS Check</h2><div className="score">{localAts.score}/100</div><ul>{localAts.notes.map((n,i)=><li key={i}>{n}</li>)}</ul></div><Resume f={f} cls={cls}/>{ai&&<div className="ai-output" style={{display:'block'}}><h2>AI Pro Results</h2><div className="score">{ai.atsScore || ai.score || 82}/100</div><h3>Improvements</h3><ul>{(ai.improvements||[]).map((x,i)=><li key={i}>{x}</li>)}</ul><h3>Cover Letters</h3>{(ai.coverLetters||[]).slice(0,3).map((x,i)=><p key={i}><b>Version {i+1}:</b> {x}</p>)}<h3>Interview Questions</h3><ul>{(ai.interviewQuestions||[]).map((x,i)=><li key={i}>{x}</li>)}</ul></div>}</div>
    </div></section>
    <PayModal open={modal} close={()=>setModal(false)} runAi={runAi} loading={loading}/>
    <footer className="footer">CVFlow AI — Launch version. Free resume + AI Pro pack for $1.29 CAD.</footer>
  </main>
}
function Resume({f,cls}){return <div className={'resume '+cls} id="cv"><div className={cls==='sidebar'?'side':''}><h1>{f.name}</h1><p className="muted">{f.title}</p><p>{f.email} · {f.phone} · {f.city}</p></div><div><h3>Profile</h3><p>{f.summary}</p><h3>Experience</h3><p style={{whiteSpace:'pre-line'}}>{f.experience}</p><h3>Education</h3><p style={{whiteSpace:'pre-line'}}>{f.education}</p><h3>Skills</h3><p>{f.skills}</p></div></div>}

function scoreResume(f){
  let score = 0;
  const notes = [];
  const has = (v,min=3)=> String(v||'').trim().length >= min;
  const wordCount = (v)=> String(v||'').trim().split(/\s+/).filter(Boolean).length;
  if(has(f.name)){ score+=8; } else notes.push('Add your full name.');
  if(has(f.title)){ score+=7; } else notes.push('Add a clear job title.');
  if(/\S+@\S+\.\S+/.test(f.email||'')){ score+=8; } else notes.push('Add a valid email address.');
  if(String(f.phone||'').replace(/\D/g,'').length>=7){ score+=7; } else notes.push('Add a phone number.');
  if(has(f.city)){ score+=5; } else notes.push('Add your city/country.');
  const sw=wordCount(f.summary);
  if(sw>=20 && sw<=70){ score+=15; } else notes.push('Write a professional summary of 20–70 words.');
  if(wordCount(f.experience)>=25){ score+=20; } else notes.push('Add more details in your experience section.');
  if(/[•\-]/.test(f.experience||'')){ score+=5; } else notes.push('Use bullet points for experience.');
  if(has(f.education)){ score+=8; } else notes.push('Add your education.');
  const skills=(f.skills||'').split(',').filter(x=>x.trim().length>1).length;
  if(skills>=5){ score+=10; } else notes.push('Add at least 5 skills separated by commas.');
  const actionWords=['managed','improved','created','supported','organized','resolved','helped','led','trained','increased','developed','achieved','assisted','served','built'];
  if(actionWords.some(w=>String(f.experience||'').toLowerCase().includes(w))){ score+=7; } else notes.push('Use stronger action verbs in your experience.');
  score=Math.min(score,100);
  if(notes.length===0) notes.push('Good structure. Your CV looks complete and ATS-friendly.');
  return {score, notes: notes.slice(0,5)};
}

function PayModal({open,close,runAi,loading}){if(!open)return null;return <div className="pay-modal" style={{display:'flex'}}><div className="pay-box"><div className="pay-head"><h2>Unlock CVFlow AI Pro</h2><button className="x" onClick={close}>×</button></div><div className="pricing"><div className="price-card"><h3>Free</h3><div className="list"><span>✅ 1 ATS resume template</span><span>✅ Basic PDF download</span><span>✅ Resume preview</span></div><button className="btn ghost" onClick={close} style={{marginTop:16}}>Continue free</button></div><div className="price-card pro"><h3>AI Pro — $1.29 CAD</h3><div className="list"><span>📄 10 premium CV templates</span><span>✉️ 3 cover letters</span><span>📊 ATS score and improvement plan</span><span>🎤 Interview questions for your target job</span><span>🤖 AI resume optimization</span></div><a href={stripeLink} target="_blank"><button className="btn primary" style={{marginTop:16,width:'100%'}}>Pay $1.29 and unlock</button></a><button className="btn ghost" onClick={runAi} disabled={loading} style={{marginTop:10,width:'100%'}}>{loading?'Generating...':'Test AI demo'}</button></div></div></div></div>}
