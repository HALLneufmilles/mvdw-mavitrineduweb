(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const d of l)if(d.type==="childList")for(const r of d.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function i(l){const d={};return l.integrity&&(d.integrity=l.integrity),l.referrerPolicy&&(d.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?d.credentials="include":l.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function c(l){if(l.ep)return;l.ep=!0;const d=i(l);fetch(l.href,d)}})();var je={exports:{}};(function(t){(function(s,i){var c=i(s,s.document,Date);s.lazySizes=c,t.exports&&(t.exports=c)})(typeof window<"u"?window:{},function(i,c,l){var d,r;if(function(){var n,a={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",fastLoadedClass:"ls-is-cached",iframeLoadMode:0,srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:!0,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:!0,ricTimeout:0,throttleDelay:125};r=i.lazySizesConfig||i.lazysizesConfig||{};for(n in a)n in r||(r[n]=a[n])}(),!c||!c.getElementsByClassName)return{init:function(){},cfg:r,noSupport:!0};var F=c.documentElement,U=i.HTMLPictureElement,q="addEventListener",z="getAttribute",_=i[q].bind(i),P=i.setTimeout,de=i.requestAnimationFrame||P,se=i.requestIdleCallback,ee=/^picture$/i,ie=["load","error","lazyincluded","_lazyloaded"],$={},ne=Array.prototype.forEach,Y=function(n,a){return $[a]||($[a]=new RegExp("(\\s|^)"+a+"(\\s|$)")),$[a].test(n[z]("class")||"")&&$[a]},G=function(n,a){Y(n,a)||n.setAttribute("class",(n[z]("class")||"").trim()+" "+a)},E=function(n,a){var u;(u=Y(n,a))&&n.setAttribute("class",(n[z]("class")||"").replace(u," "))},v=function(n,a,u){var b=u?q:"removeEventListener";u&&v(n,a),ie.forEach(function(y){n[b](y,a)})},p=function(n,a,u,b,y){var f=c.createEvent("Event");return u||(u={}),u.instance=d,f.initEvent(a,!b,!y),f.detail=u,n.dispatchEvent(f),f},C=function(n,a){var u;!U&&(u=i.picturefill||r.pf)?(a&&a.src&&!n[z]("srcset")&&n.setAttribute("srcset",a.src),u({reevaluate:!0,elements:[n]})):a&&a.src&&(n.src=a.src)},A=function(n,a){return(getComputedStyle(n,null)||{})[a]},T=function(n,a,u){for(u=u||n.offsetWidth;u<r.minSize&&a&&!n._lazysizesWidth;)u=a.offsetWidth,a=a.parentNode;return u},S=function(){var n,a,u=[],b=[],y=u,f=function(){var m=y;for(y=u.length?b:u,n=!0,a=!1;m.length;)m.shift()();n=!1},L=function(m,g){n&&!g?m.apply(this,arguments):(y.push(m),a||(a=!0,(c.hidden?P:de)(f)))};return L._lsFlush=f,L}(),H=function(n,a){return a?function(){S(n)}:function(){var u=this,b=arguments;S(function(){n.apply(u,b)})}},R=function(n){var a,u=0,b=r.throttleDelay,y=r.ricTimeout,f=function(){a=!1,u=l.now(),n()},L=se&&y>49?function(){se(f,{timeout:y}),y!==r.ricTimeout&&(y=r.ricTimeout)}:H(function(){P(f)},!0);return function(m){var g;(m=m===!0)&&(y=33),!a&&(a=!0,g=b-(l.now()-u),g<0&&(g=0),m||g<9?L():P(L,g))}},N=function(n){var a,u,b=99,y=function(){a=null,n()},f=function(){var L=l.now()-u;L<b?P(f,b-L):(se||y)(y)};return function(){u=l.now(),a||(a=P(f,b))}},fe=function(){var n,a,u,b,y,f,L,m,g,I,V,Q,Me=/^img$/i,ke=/^iframe$/i,Pe="onscroll"in i&&!/(gle|ing)bot/.test(navigator.userAgent),Re=0,le=0,j=0,re=-1,he=function(e){j--,(!e||j<0||!e.target)&&(j=0)},pe=function(e){return Q==null&&(Q=A(c.body,"visibility")=="hidden"),Q||!(A(e.parentNode,"visibility")=="hidden"&&A(e,"visibility")=="hidden")},Ie=function(e,o){var h,x=e,M=pe(e);for(m-=o,V+=o,g-=o,I+=o;M&&(x=x.offsetParent)&&x!=c.body&&x!=F;)M=(A(x,"opacity")||1)>0,M&&A(x,"overflow")!="visible"&&(h=x.getBoundingClientRect(),M=I>h.left&&g<h.right&&V>h.top-1&&m<h.bottom+1);return M},ge=function(){var e,o,h,x,M,k,W,D,J,K,X,ae,O=d.elements;if((b=r.loadMode)&&j<8&&(e=O.length)){for(o=0,re++;o<e;o++)if(!(!O[o]||O[o]._lazyRace)){if(!Pe||d.prematureUnveil&&d.prematureUnveil(O[o])){ce(O[o]);continue}if((!(D=O[o][z]("data-expand"))||!(k=D*1))&&(k=le),K||(K=!r.expand||r.expand<1?F.clientHeight>500&&F.clientWidth>500?500:370:r.expand,d._defEx=K,X=K*r.expFactor,ae=r.hFac,Q=null,le<X&&j<1&&re>2&&b>2&&!c.hidden?(le=X,re=0):b>1&&re>1&&j<6?le=K:le=Re),J!==k&&(f=innerWidth+k*ae,L=innerHeight+k,W=k*-1,J=k),h=O[o].getBoundingClientRect(),(V=h.bottom)>=W&&(m=h.top)<=L&&(I=h.right)>=W*ae&&(g=h.left)<=f&&(V||I||g||m)&&(r.loadHidden||pe(O[o]))&&(a&&j<3&&!D&&(b<3||re<4)||Ie(O[o],k))){if(ce(O[o]),M=!0,j>9)break}else!M&&a&&!x&&j<4&&re<4&&b>2&&(n[0]||r.preloadAfterLoad)&&(n[0]||!D&&(V||I||g||m||O[o][z](r.sizesAttr)!="auto"))&&(x=n[0]||O[o])}x&&!M&&ce(x)}},B=R(ge),ye=function(e){var o=e.target;if(o._lazyCache){delete o._lazyCache;return}he(e),G(o,r.loadedClass),E(o,r.loadingClass),v(o,be),p(o,"lazyloaded")},Be=H(ye),be=function(e){Be({target:e.target})},Fe=function(e,o){var h=e.getAttribute("data-load-mode")||r.iframeLoadMode;h==0?e.contentWindow.location.replace(o):h==1&&(e.src=o)},qe=function(e){var o,h=e[z](r.srcsetAttr);(o=r.customMedia[e[z]("data-media")||e[z]("media")])&&e.setAttribute("media",o),h&&e.setAttribute("srcset",h)},Ne=H(function(e,o,h,x,M){var k,W,D,J,K,X;(K=p(e,"lazybeforeunveil",o)).defaultPrevented||(x&&(h?G(e,r.autosizesClass):e.setAttribute("sizes",x)),W=e[z](r.srcsetAttr),k=e[z](r.srcAttr),M&&(D=e.parentNode,J=D&&ee.test(D.nodeName||"")),X=o.firesLoad||"src"in e&&(W||k||J),K={target:e},G(e,r.loadingClass),X&&(clearTimeout(u),u=P(he,2500),v(e,be,!0)),J&&ne.call(D.getElementsByTagName("source"),qe),W?e.setAttribute("srcset",W):k&&!J&&(ke.test(e.nodeName)?Fe(e,k):e.src=k),M&&(W||J)&&C(e,{src:k})),e._lazyRace&&delete e._lazyRace,E(e,r.lazyClass),S(function(){var ae=e.complete&&e.naturalWidth>1;(!X||ae)&&(ae&&G(e,r.fastLoadedClass),ye(K),e._lazyCache=!0,P(function(){"_lazyCache"in e&&delete e._lazyCache},9)),e.loading=="lazy"&&j--},!0)}),ce=function(e){if(!e._lazyRace){var o,h=Me.test(e.nodeName),x=h&&(e[z](r.sizesAttr)||e[z]("sizes")),M=x=="auto";(M||!a)&&h&&(e[z]("src")||e.srcset)&&!e.complete&&!Y(e,r.errorClass)&&Y(e,r.lazyClass)||(o=p(e,"lazyunveilread").detail,M&&oe.updateElem(e,!0,e.offsetWidth),e._lazyRace=!0,j++,Ne(e,o,M,x,h))}},Oe=N(function(){r.loadMode=3,B()}),ze=function(){r.loadMode==3&&(r.loadMode=2),Oe()},ve=function(){if(!a){if(l.now()-y<999){P(ve,999);return}a=!0,r.loadMode=3,B(),_("scroll",ze,!0)}};return{_:function(){y=l.now(),d.elements=c.getElementsByClassName(r.lazyClass),n=c.getElementsByClassName(r.lazyClass+" "+r.preloadClass),_("scroll",B,!0),_("resize",B,!0),_("pageshow",function(e){if(e.persisted){var o=c.querySelectorAll("."+r.loadingClass);o.length&&o.forEach&&de(function(){o.forEach(function(h){h.complete&&ce(h)})})}}),i.MutationObserver?new MutationObserver(B).observe(F,{childList:!0,subtree:!0,attributes:!0}):(F[q]("DOMNodeInserted",B,!0),F[q]("DOMAttrModified",B,!0),setInterval(B,999)),_("hashchange",B,!0),["focus","mouseover","click","load","transitionend","animationend"].forEach(function(e){c[q](e,B,!0)}),/d$|^c/.test(c.readyState)?ve():(_("load",ve),c[q]("DOMContentLoaded",B),P(ve,2e4)),d.elements.length?(ge(),S._lsFlush()):B()},checkElems:B,unveil:ce,_aLSL:ze}}(),oe=function(){var n,a=H(function(f,L,m,g){var I,V,Q;if(f._lazysizesWidth=g,g+="px",f.setAttribute("sizes",g),ee.test(L.nodeName||""))for(I=L.getElementsByTagName("source"),V=0,Q=I.length;V<Q;V++)I[V].setAttribute("sizes",g);m.detail.dataAttr||C(f,m.detail)}),u=function(f,L,m){var g,I=f.parentNode;I&&(m=T(f,I,m),g=p(f,"lazybeforesizes",{width:m,dataAttr:!!L}),g.defaultPrevented||(m=g.detail.width,m&&m!==f._lazysizesWidth&&a(f,I,g,m)))},b=function(){var f,L=n.length;if(L)for(f=0;f<L;f++)u(n[f])},y=N(b);return{_:function(){n=c.getElementsByClassName(r.autosizesClass),_("resize",y)},checkElems:y,updateElem:u}}(),te=function(){!te.i&&c.getElementsByClassName&&(te.i=!0,oe._(),fe._())};return P(function(){r.init&&te()}),d={cfg:r,autoSizer:oe,loader:fe,init:te,uP:C,aC:G,rC:E,hC:Y,fire:p,gW:T,rAF:S},d})})(je);class ue{constructor(s=0,i="Network Error"){this.status=s,this.text=i}}const He=()=>{if(!(typeof localStorage>"u"))return{get:t=>Promise.resolve(localStorage.getItem(t)),set:(t,s)=>Promise.resolve(localStorage.setItem(t,s)),remove:t=>Promise.resolve(localStorage.removeItem(t))}},w={origin:"https://api.emailjs.com",blockHeadless:!1,storageProvider:He()},me=t=>t?typeof t=="string"?{publicKey:t}:t.toString()==="[object Object]"?t:{}:{},Ve=(t,s="https://api.emailjs.com")=>{if(!t)return;const i=me(t);w.publicKey=i.publicKey,w.blockHeadless=i.blockHeadless,w.storageProvider=i.storageProvider,w.blockList=i.blockList,w.limitRate=i.limitRate,w.origin=i.origin||s},Ee=async(t,s,i={})=>{const c=await fetch(w.origin+t,{method:"POST",headers:i,body:s}),l=await c.text(),d=new ue(c.status,l);if(c.ok)return d;throw d},Le=(t,s,i)=>{if(!t||typeof t!="string")throw"The public key is required. Visit https://dashboard.emailjs.com/admin/account";if(!s||typeof s!="string")throw"The service ID is required. Visit https://dashboard.emailjs.com/admin";if(!i||typeof i!="string")throw"The template ID is required. Visit https://dashboard.emailjs.com/admin/templates"},We=t=>{if(t&&t.toString()!=="[object Object]")throw"The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/"},Ce=t=>t.webdriver||!t.languages||t.languages.length===0,Se=()=>new ue(451,"Unavailable For Headless Browser"),De=(t,s)=>{if(!Array.isArray(t))throw"The BlockList list has to be an array";if(typeof s!="string")throw"The BlockList watchVariable has to be a string"},Ke=t=>{var s;return!((s=t.list)!=null&&s.length)||!t.watchVariable},Ue=(t,s)=>t instanceof FormData?t.get(s):t[s],xe=(t,s)=>{if(Ke(t))return!1;De(t.list,t.watchVariable);const i=Ue(s,t.watchVariable);return typeof i!="string"?!1:t.list.includes(i)},_e=()=>new ue(403,"Forbidden"),$e=(t,s)=>{if(typeof t!="number"||t<0)throw"The LimitRate throttle has to be a positive number";if(s&&typeof s!="string")throw"The LimitRate ID has to be a non-empty string"},Ye=async(t,s,i)=>{const c=Number(await i.get(t)||0);return s-Date.now()+c},Te=async(t,s,i)=>{if(!s.throttle||!i)return!1;$e(s.throttle,s.id);const c=s.id||t;return await Ye(c,s.throttle,i)>0?!0:(await i.set(c,Date.now().toString()),!1)},we=()=>new ue(429,"Too Many Requests"),Je=async(t,s,i,c)=>{const l=me(c),d=l.publicKey||w.publicKey,r=l.blockHeadless||w.blockHeadless,F=l.storageProvider||w.storageProvider,U={...w.blockList,...l.blockList},q={...w.limitRate,...l.limitRate};return r&&Ce(navigator)?Promise.reject(Se()):(Le(d,t,s),We(i),i&&xe(U,i)?Promise.reject(_e()):await Te(location.pathname,q,F)?Promise.reject(we()):Ee("/api/v1.0/email/send",JSON.stringify({lib_version:"4.4.1",user_id:d,service_id:t,template_id:s,template_params:i}),{"Content-type":"application/json"}))},Ge=t=>{if(!t||t.nodeName!=="FORM")throw"The 3rd parameter is expected to be the HTML form element or the style selector of the form"},Qe=t=>typeof t=="string"?document.querySelector(t):t,Xe=async(t,s,i,c)=>{const l=me(c),d=l.publicKey||w.publicKey,r=l.blockHeadless||w.blockHeadless,F=w.storageProvider||l.storageProvider,U={...w.blockList,...l.blockList},q={...w.limitRate,...l.limitRate};if(r&&Ce(navigator))return Promise.reject(Se());const z=Qe(i);Le(d,t,s),Ge(z);const _=new FormData(z);return xe(U,_)?Promise.reject(_e()):await Te(location.pathname,q,F)?Promise.reject(we()):(_.append("lib_version","4.4.1"),_.append("service_id",t),_.append("template_id",s),_.append("user_id",d),Ee("/api/v1.0/email/send-form",_))},Ae={init:Ve,send:Je,sendForm:Xe,EmailJSResponseStatus:ue};Ae.init("SSGMoBteY1IqEzwlA");document.addEventListener("DOMContentLoaded",function(){console.log("DOM Content Loaded");const t=document.querySelector(".side-nav"),s=document.querySelector(".toggle-btn"),i=document.querySelectorAll(".links, .footer-links");s.addEventListener("click",()=>{t.classList.toggle("active"),s.classList.toggle("active")}),i.forEach(E=>{E.addEventListener("click",v=>{v.preventDefault();const p=E.getAttribute("href").slice(1),C=document.getElementById(p);C&&c(C)})});function c(E){const v=window.scrollY,C=E.getBoundingClientRect().top+v-v,A=2e3;let T=null;function S(R){T||(T=R);const N=R-T,fe=Math.min(N/A,1),oe=H(fe),te=v+C*oe;window.scrollTo(0,te),N<A&&requestAnimationFrame(S)}function H(R){return R<.5?2*R*R:1-Math.pow(-2*R+2,2)/2}requestAnimationFrame(S)}const l=new Promise((E,v)=>{var p=document.createElement("link");p.rel="preload",p.as="image",window.matchMedia("(min-width: 1024px)").matches?p.href="/20-fond-hero-section-1400.webp":p.href="/20-fond-hero-section-800.webp",p.onload=()=>E(),p.onerror=()=>v(new Error("Erreur lors du chargement de l'image")),document.head.appendChild(p)});function d(){const E=document.querySelector("#footer");if(!E){console.error("L'élément #footer n'existe pas dans le DOM.");return}const v=document.querySelectorAll(".box"),p=A=>{A.forEach(T=>{T.isIntersecting?v.forEach(S=>{S.classList.add("visible-box"),S.classList.remove("hidden-box")}):v.forEach(S=>{S.classList.add("hidden"),S.classList.remove("visible")})})};new IntersectionObserver(p,{threshold:.1}).observe(E)}function r(){particlesJS("particles-js",{particles:{number:{value:65,density:{enable:!0,value_area:800}},color:{value:"#ffffff"},shape:{type:"circle",stroke:{width:0,color:"#000000"},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:.5,random:!1,anim:{enable:!1,speed:1,opacity_min:.1,sync:!1}},size:{value:3,random:!0,anim:{enable:!1,speed:40,size_min:.1,sync:!1}},line_linked:{enable:!0,distance:236.74429248968178,color:"#ffffff",opacity:.4,width:1},move:{enable:!0,speed:5,direction:"none",random:!1,straight:!1,out_mode:"out",bounce:!1,attract:{enable:!1,rotateX:600,rotateY:1200}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:!0,mode:"repulse"},onclick:{enable:!0,mode:"push"},resize:!0},modes:{grab:{distance:400,line_linked:{opacity:1}},bubble:{distance:400,size:40,duration:2,opacity:8,speed:3},repulse:{distance:200,duration:.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:!0})}function F(){console.log("handleColorInversion appelée");const E=document.querySelector("#prix");if(!E){console.error("La section #prix n'existe pas dans le DOM.");return}console.log(E);const v=C=>{C.forEach(A=>{A.isIntersecting?document.documentElement.classList.add("root-inverted"):document.documentElement.classList.remove("root-inverted")})};new IntersectionObserver(v,{threshold:.5}).observe(E)}class U{constructor(v){this.el=v,this.chars="01",this.update=this.update.bind(this)}setText(v){const p=this.el.innerText,C=Math.max(p.length,v.length),A=new Promise(T=>this.resolve=T);this.queue=[];for(let T=0;T<C;T++){const S=p[T]||"",H=v[T]||"",R=Math.floor(Math.random()*80),N=R+Math.floor(Math.random()*80);this.queue.push({from:S,to:H,start:R,end:N})}return cancelAnimationFrame(this.frameRequest),this.frame=0,this.update(),A}update(){let v="",p=0;for(let C=0,A=this.queue.length;C<A;C++){let{from:T,to:S,start:H,end:R,char:N}=this.queue[C];this.frame>=R?(p++,v+=S):this.frame>=H?((!N||Math.random()<.28)&&(N=this.randomChar(),this.queue[C].char=N),v+=`<span class="dud">${N}</span>`):v+=T}this.el.innerHTML=v,p===this.queue.length?this.resolve():(this.frameRequest=requestAnimationFrame(this.update),this.frame++)}randomChar(){return this.chars[Math.floor(Math.random()*this.chars.length)]}}const q=["01000100 11000011 10101001"],z=["MaVitrineDuWeb.fr"],_=["Développeur Web"],P=["A La Rochelle"],de=document.getElementById("text1"),se=document.getElementById("text2"),ee=new U(de),ie=new U(se);let $=0,ne=0;const Y=()=>{ee.setText(q[$]).then(()=>{setTimeout(()=>{ie.setText(z[ne]).then(()=>{setTimeout(()=>{ee.setText(_[$]).then(()=>{ie.setText(P[ne]).then(()=>{setTimeout(Y,900)})})},200)})},200)})},G=()=>{ee.setText(_[$]).then(()=>{ie.setText(P[ne]).then(()=>{setTimeout(Y,500)})})};l.then(()=>{console.log("Image préchargée, initialisation des particules et inversion des couleurs"),r(),G(),F(),d()}).catch(E=>{console.error("Une erreur s'est produite :",E)})});const Z=ScrollReveal({origin:"bottom",distance:"60px",duration:1e3,delay:100,easing:"ease-in-out"});Z.reveal(".presentation",{delay:200,distance:"200px"});Z.reveal(".services-flex",{delay:200,distance:"400px"});Z.reveal(".stape-card",{delay:200,distance:"400px"});Z.reveal("#themes",{delay:200,distance:"400px"});Z.reveal(".skills",{delay:200,distance:"400px"});Z.reveal(".contact-form",{delay:400,distance:"300px"});Z.reveal(".buton-phone",{delay:600});window.sendMail=function(){const t=document.getElementById("contact-form");let s={user_name:document.getElementById("user_name").value,user_email:document.getElementById("user_email").value,subject:document.getElementById("subject").value,message:document.getElementById("message").value,contact_number:document.getElementById("contact_number").value};console.log("params:",s),Ae.send("service_e1lshyl","template_nroyljv",s).then(i=>{alert("Email Sent!"),console.log("SUCCESS",i),t.reset()}).catch(i=>{console.error("Failed to send email: ",i),console.log("afetr catch params:",s)})};
