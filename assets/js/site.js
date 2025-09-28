// Highlight current page in nav
(function(){
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('nav a').forEach(a=>{
    const href = (a.getAttribute('href')||'').toLowerCase();
    if(href && page === href) a.classList.add('active');
  });
})();
