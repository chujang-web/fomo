
(function(){
  const SUPPORTED = ['ko','ro','en'];
  const LABELS = {ko:'🇰🇷 한국어', ro:'🇷🇴 Română', en:'🇺🇸 English'};
  const STORAGE_KEY = 'fw_lang';
  let dict = {}, base = {};
  let applying = false;
  function detectLang(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if(SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || 'ko').slice(0,2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : 'ko';
  }
  function normalize(s){ return (s||'').replace(/\s+/g,' ').trim(); }
  function translateTextNode(node){
    const raw = node.nodeValue;
    const key = normalize(raw);
    if(!key || !dict[key] || dict[key]===key) return;
    const leading = (raw.match(/^\s*/) || [''])[0];
    const trailing = (raw.match(/\s*$/) || [''])[0];
    node.nodeValue = leading + dict[key] + trailing;
  }
  function translateElement(el){
    if(!el || el.closest && el.closest('script,style,noscript')) return;
    for(const attr of ['placeholder','title','aria-label']){
      const v = el.getAttribute && el.getAttribute(attr);
      const k = normalize(v);
      if(k && dict[k]) el.setAttribute(attr, dict[k]);
    }
  }
  function walk(root){
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(n){
        if(n.nodeType===1 && ['SCRIPT','STYLE','NOSCRIPT'].includes(n.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let n;
    while(n = walker.nextNode()){
      if(n.nodeType===3) translateTextNode(n);
      else translateElement(n);
    }
  }
  function injectSwitcher(lang){
    if(document.getElementById('fwLangSwitcher')) return;
    const wrap = document.createElement('div');
    wrap.id = 'fwLangSwitcher';
    wrap.innerHTML = `<select id="fwLangSelect" aria-label="Language">
      ${SUPPORTED.map(l=>`<option value="${l}">${LABELS[l]}</option>`).join('')}
    </select>`;
    document.body.appendChild(wrap);
    const css = document.createElement('style');
    css.textContent = `#fwLangSwitcher{position:fixed;right:14px;bottom:14px;z-index:100000;background:rgba(5,9,20,.88);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:6px;box-shadow:0 12px 40px rgba(0,0,0,.35)}#fwLangSwitcher select{background:#0b1220;color:#f8fafc;border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:8px 10px;font-weight:800;outline:none} @media(max-width:700px){#fwLangSwitcher{right:10px;bottom:10px}#fwLangSwitcher select{font-size:12px;padding:7px 8px}}`;
    document.head.appendChild(css);
    const sel = document.getElementById('fwLangSelect');
    sel.value = lang;
    sel.addEventListener('change', async e => {
      localStorage.setItem(STORAGE_KEY, e.target.value);
      location.reload();
    });
  }
  async function loadDict(lang){
    try{
      const res = await fetch(`./locales/${lang}.json`, {cache:'no-cache'});
      dict = await res.json();
      document.documentElement.lang = lang;
    }catch(e){ console.warn('i18n load failed', e); dict = {}; }
  }
  async function init(){
    const lang = detectLang();
    await loadDict(lang);
    injectSwitcher(lang);
    walk(document.body);
    document.title = dict[document.title] || document.title;
    const obs = new MutationObserver(muts=>{
      if(applying) return; applying = true;
      requestAnimationFrame(()=>{
        for(const m of muts){
          for(const n of m.addedNodes){
            if(n.nodeType===3) translateTextNode(n);
            else if(n.nodeType===1) walk(n);
          }
          if(m.type==='characterData') translateTextNode(m.target);
        }
        applying = false;
      });
    });
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});
    window.fwSetLang = (l)=>{ if(SUPPORTED.includes(l)){localStorage.setItem(STORAGE_KEY,l); location.reload();} };
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
