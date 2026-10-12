"use strict";
// Preserve shared links from the former single-page portfolio.
const legacy={about:"about.html",directions:"research.html",work:"projects.html",connect:"connect.html"};
const oldTarget=legacy[location.hash.slice(1)];
if(oldTarget && (location.pathname.endsWith("/")||location.pathname.endsWith("/index.html"))) location.replace(oldTarget+location.search);
const search=document.querySelector("#search");
if(search){
 const cards=[...document.querySelectorAll(".project")],status=document.querySelector("#results-status"),empty=document.querySelector("#empty"),pagination=document.querySelector("#pagination"),size=6;
 function render(focus=false){
  const params=new URLSearchParams(location.search),term=(params.get("q")||"").trim().toLowerCase();search.value=params.get("q")||"";
  const matched=cards.filter(card=>card.dataset.search.includes(term)),pages=Math.max(1,Math.ceil(matched.length/size));
  const requested=Number(params.get("page")||1);const page=Math.min(pages,Math.max(1,Number.isInteger(requested)?requested:1));
  cards.forEach(card=>card.hidden=true);matched.slice((page-1)*size,page*size).forEach(card=>card.hidden=false);
  empty.hidden=matched.length!==0;status.textContent=matched.length+" project"+(matched.length===1?"":"s")+(term?" matching your search":"")+" · page "+page+" of "+pages;
  pagination.replaceChildren();
  function link(label,n,current=false){const a=document.createElement("a"),next=new URLSearchParams(params);if(n===1)next.delete("page");else next.set("page",String(n));a.href=location.pathname+(next.size?"?"+next.toString():"");a.textContent=label;if(current)a.setAttribute("aria-current","page");a.addEventListener("click",event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();history.pushState({},"",a.href);render(true)});pagination.append(a)}
  if(pages>1){if(page>1)link("← Previous",page-1);for(let i=1;i<=pages;i++)link(String(i),i,i===page);if(page<pages)link("Next →",page+1)}
  if(focus){status.setAttribute("tabindex","-1");status.focus({preventScroll:true});document.querySelector("#work").scrollIntoView({behavior:"auto"})}
 }
 search.addEventListener("input",()=>{const params=new URLSearchParams(location.search);params.delete("page");if(search.value.trim())params.set("q",search.value);else params.delete("q");history.replaceState({},"",location.pathname+(params.size?"?"+params.toString():""));render()});
 window.addEventListener("popstate",()=>render());render();
}
