import './live-premium.css';
import './commerce-premium.css';
import './marketplace-fallback-motion.js';
import './marketplace-premium.css';
import './style.css';
import './premium.css';
import './motion.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildContactUrl } from './data.js';

import { renderHome } from './render.js';
import { initMotion, animateFilter } from './motion/index.js';
if (!document.querySelector('.services-grid')) document.querySelector('#app').innerHTML=renderHome();

const menu = document.querySelector('.menu-toggle');
const closeMenu = () => {menu.setAttribute('aria-expanded','false'); document.querySelector('#navigation').classList.remove('open');};
menu.addEventListener('click',()=>{ const open=menu.getAttribute('aria-expanded')!=='true'; menu.setAttribute('aria-expanded',String(open)); document.querySelector('#navigation').classList.toggle('open',open); });
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{
  document.querySelector('select[name="service"]').value=link.dataset.service;
}));
document.querySelector('#briefing').addEventListener('submit', e=>{ e.preventDefault(); window.open(buildContactUrl(Object.fromEntries(new FormData(e.currentTarget))), '_blank','noopener,noreferrer'); });
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const show=p=>button.dataset.filter==='Todos' || p.dataset.category===button.dataset.filter;
  // Flip needs inline display (the [hidden] rule is !important), so visibility is toggled via style.
  animateFilter(()=>document.querySelectorAll('.project').forEach(p=>{p.style.display=show(p)?'':'none';}));
  const count=[...document.querySelectorAll('.project')].filter(show).length;
  document.querySelector('.portfolio-count').textContent=`${count} PROJETOS / ${button.dataset.filter.toUpperCase()}`;
  ScrollTrigger.refresh();
}));
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.create({start:60,onUpdate:self=>document.querySelector('.header').classList.toggle('scrolled',self.scroll()>60)});
gsap.to('.reading-progress span',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});
document.querySelectorAll('nav a[href^="#"]').forEach(link=>{
  ScrollTrigger.create({trigger:link.getAttribute('href'),start:'top 35%',end:'bottom 35%',onToggle:self=>{
    if(self.isActive) link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  }});
});
initMotion();
// Pins are created inside matchMedia after content triggers: re-sort so every
// trigger below the pinned manifesto accounts for its spacing.
ScrollTrigger.sort();
ScrollTrigger.refresh();

import './portfolio-refined.css';
