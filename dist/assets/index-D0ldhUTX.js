(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const d of l)if(d.type==="childList")for(const r of d.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function s(l){const d={};return l.integrity&&(d.integrity=l.integrity),l.referrerPolicy&&(d.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?d.credentials="include":l.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function c(l){if(l.ep)return;l.ep=!0;const d=s(l);fetch(l.href,d)}})();var He={exports:{}};(function(t){(function(i,s){var c=s(i,i.document,Date);i.lazySizes=c,t.exports&&(t.exports=c)})(typeof window<"u"?window:{},function(s,c,l){var d,r;if(function(){var n,a={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",fastLoadedClass:"ls-is-cached",iframeLoadMode:0,srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:!0,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:!0,ricTimeout:0,throttleDelay:125};r=s.lazySizesConfig||s.lazysizesConfig||{};for(n in a)n in r||(r[n]=a[n])}(),!c||!c.getElementsByClassName)return{init:function(){},cfg:r,noSupport:!0};var R=c.documentElement,K=s.HTMLPictureElement,A="addEventListener",y="getAttribute",S=s[A].bind(s),T=s.setTimeout,Q=s.requestAnimationFrame||T,$=s.requestIdleCallback,Z=/^picture$/i,ne=["load","error","lazyincluded","_lazyloaded"],re={},N=Array.prototype.forEach,z=function(n,a){return re[a]||(re[a]=new RegExp("(\\s|^)"+a+"(\\s|$)")),re[a].test(n[y]("class")||"")&&re[a]},b=function(n,a){z(n,a)||n.setAttribute("class",(n[y]("class")||"").trim()+" "+a)},F=function(n,a){var u;(u=z(n,a))&&n.setAttribute("class",(n[y]("class")||"").replace(u," "))},H=function(n,a,u){var g=u?A:"removeEventListener";u&&H(n,a),ne.forEach(function(p){n[g](p,a)})},M=function(n,a,u,g,p){var f=c.createEvent("Event");return u||(u={}),u.instance=d,f.initEvent(a,!g,!p),f.detail=u,n.dispatchEvent(f),f},J=function(n,a){var u;!K&&(u=s.picturefill||r.pf)?(a&&a.src&&!n[y]("srcset")&&n.setAttribute("srcset",a.src),u({reevaluate:!0,elements:[n]})):a&&a.src&&(n.src=a.src)},O=function(n,a){return(getComputedStyle(n,null)||{})[a]},Y=function(n,a,u){for(u=u||n.offsetWidth;u<r.minSize&&a&&!n._lazysizesWidth;)u=a.offsetWidth,a=a.parentNode;return u},B=function(){var n,a,u=[],g=[],p=u,f=function(){var v=p;for(p=u.length?g:u,n=!0,a=!1;v.length;)v.shift()();n=!1},E=function(v,h){n&&!h?v.apply(this,arguments):(p.push(v),a||(a=!0,(c.hidden?T:Q)(f)))};return E._lsFlush=f,E}(),oe=function(n,a){return a?function(){B(n)}:function(){var u=this,g=arguments;B(function(){n.apply(u,g)})}},ke=function(n){var a,u=0,g=r.throttleDelay,p=r.ricTimeout,f=function(){a=!1,u=l.now(),n()},E=$&&p>49?function(){$(f,{timeout:p}),p!==r.ricTimeout&&(p=r.ricTimeout)}:oe(function(){T(f)},!0);return function(v){var h;(v=v===!0)&&(p=33),!a&&(a=!0,h=g-(l.now()-u),h<0&&(h=0),v||h<9?E():T(E,h))}},fe=function(n){var a,u,g=99,p=function(){a=null,n()},f=function(){var E=l.now()-u;E<g?T(f,g-E):($||p)(p)};return function(){u=l.now(),a||(a=T(f,g))}},ve=function(){var n,a,u,g,p,f,E,v,h,w,q,G,Ae=/^img$/i,we=/^iframe$/i,Pe="onscroll"in s&&!/(gle|ing)bot/.test(navigator.userAgent),Re=0,ae=0,j=0,ee=-1,me=function(e){j--,(!e||j<0||!e.target)&&(j=0)},he=function(e){return G==null&&(G=O(c.body,"visibility")=="hidden"),G||!(O(e.parentNode,"visibility")=="hidden"&&O(e,"visibility")=="hidden")},Fe=function(e,o){var m,C=e,_=he(e);for(v-=o,q+=o,h-=o,w+=o;_&&(C=C.offsetParent)&&C!=c.body&&C!=R;)_=(O(C,"opacity")||1)>0,_&&O(C,"overflow")!="visible"&&(m=C.getBoundingClientRect(),_=w>m.left&&h<m.right&&q>m.top-1&&v<m.bottom+1);return _},pe=function(){var e,o,m,C,_,x,W,V,U,D,X,te,I=d.elements;if((g=r.loadMode)&&j<8&&(e=I.length)){for(o=0,ee++;o<e;o++)if(!(!I[o]||I[o]._lazyRace)){if(!Pe||d.prematureUnveil&&d.prematureUnveil(I[o])){ie(I[o]);continue}if((!(V=I[o][y]("data-expand"))||!(x=V*1))&&(x=ae),D||(D=!r.expand||r.expand<1?R.clientHeight>500&&R.clientWidth>500?500:370:r.expand,d._defEx=D,X=D*r.expFactor,te=r.hFac,G=null,ae<X&&j<1&&ee>2&&g>2&&!c.hidden?(ae=X,ee=0):g>1&&ee>1&&j<6?ae=D:ae=Re),U!==x&&(f=innerWidth+x*te,E=innerHeight+x,W=x*-1,U=x),m=I[o].getBoundingClientRect(),(q=m.bottom)>=W&&(v=m.top)<=E&&(w=m.right)>=W*te&&(h=m.left)<=f&&(q||w||h||v)&&(r.loadHidden||he(I[o]))&&(a&&j<3&&!V&&(g<3||ee<4)||Fe(I[o],x))){if(ie(I[o]),_=!0,j>9)break}else!_&&a&&!C&&j<4&&ee<4&&g>2&&(n[0]||r.preloadAfterLoad)&&(n[0]||!V&&(q||w||h||v||I[o][y](r.sizesAttr)!="auto"))&&(C=n[0]||I[o])}C&&!_&&ie(C)}},P=ke(pe),ge=function(e){var o=e.target;if(o._lazyCache){delete o._lazyCache;return}me(e),b(o,r.loadedClass),F(o,r.loadingClass),H(o,ye),M(o,"lazyloaded")},Be=oe(ge),ye=function(e){Be({target:e.target})},Ie=function(e,o){var m=e.getAttribute("data-load-mode")||r.iframeLoadMode;m==0?e.contentWindow.location.replace(o):m==1&&(e.src=o)},je=function(e){var o,m=e[y](r.srcsetAttr);(o=r.customMedia[e[y]("data-media")||e[y]("media")])&&e.setAttribute("media",o),m&&e.setAttribute("srcset",m)},Ne=oe(function(e,o,m,C,_){var x,W,V,U,D,X;(D=M(e,"lazybeforeunveil",o)).defaultPrevented||(C&&(m?b(e,r.autosizesClass):e.setAttribute("sizes",C)),W=e[y](r.srcsetAttr),x=e[y](r.srcAttr),_&&(V=e.parentNode,U=V&&Z.test(V.nodeName||"")),X=o.firesLoad||"src"in e&&(W||x||U),D={target:e},b(e,r.loadingClass),X&&(clearTimeout(u),u=T(me,2500),H(e,ye,!0)),U&&N.call(V.getElementsByTagName("source"),je),W?e.setAttribute("srcset",W):x&&!U&&(we.test(e.nodeName)?Ie(e,x):e.src=x),_&&(W||U)&&J(e,{src:x})),e._lazyRace&&delete e._lazyRace,F(e,r.lazyClass),B(function(){var te=e.complete&&e.naturalWidth>1;(!X||te)&&(te&&b(e,r.fastLoadedClass),ge(D),e._lazyCache=!0,T(function(){"_lazyCache"in e&&delete e._lazyCache},9)),e.loading=="lazy"&&j--},!0)}),ie=function(e){if(!e._lazyRace){var o,m=Ae.test(e.nodeName),C=m&&(e[y](r.sizesAttr)||e[y]("sizes")),_=C=="auto";(_||!a)&&m&&(e[y]("src")||e.srcset)&&!e.complete&&!z(e,r.errorClass)&&z(e,r.lazyClass)||(o=M(e,"lazyunveilread").detail,_&&ue.updateElem(e,!0,e.offsetWidth),e._lazyRace=!0,j++,Ne(e,o,_,C,m))}},qe=fe(function(){r.loadMode=3,P()}),be=function(){r.loadMode==3&&(r.loadMode=2),qe()},ce=function(){if(!a){if(l.now()-p<999){T(ce,999);return}a=!0,r.loadMode=3,P(),S("scroll",be,!0)}};return{_:function(){p=l.now(),d.elements=c.getElementsByClassName(r.lazyClass),n=c.getElementsByClassName(r.lazyClass+" "+r.preloadClass),S("scroll",P,!0),S("resize",P,!0),S("pageshow",function(e){if(e.persisted){var o=c.querySelectorAll("."+r.loadingClass);o.length&&o.forEach&&Q(function(){o.forEach(function(m){m.complete&&ie(m)})})}}),s.MutationObserver?new MutationObserver(P).observe(R,{childList:!0,subtree:!0,attributes:!0}):(R[A]("DOMNodeInserted",P,!0),R[A]("DOMAttrModified",P,!0),setInterval(P,999)),S("hashchange",P,!0),["focus","mouseover","click","load","transitionend","animationend"].forEach(function(e){c[A](e,P,!0)}),/d$|^c/.test(c.readyState)?ce():(S("load",ce),c[A]("DOMContentLoaded",P),T(ce,2e4)),d.elements.length?(pe(),B._lsFlush()):P()},checkElems:P,unveil:ie,_aLSL:be}}(),ue=function(){var n,a=oe(function(f,E,v,h){var w,q,G;if(f._lazysizesWidth=h,h+="px",f.setAttribute("sizes",h),Z.test(E.nodeName||""))for(w=E.getElementsByTagName("source"),q=0,G=w.length;q<G;q++)w[q].setAttribute("sizes",h);v.detail.dataAttr||J(f,v.detail)}),u=function(f,E,v){var h,w=f.parentNode;w&&(v=Y(f,w,v),h=M(f,"lazybeforesizes",{width:v,dataAttr:!!E}),h.defaultPrevented||(v=h.detail.width,v&&v!==f._lazysizesWidth&&a(f,w,h,v)))},g=function(){var f,E=n.length;if(E)for(f=0;f<E;f++)u(n[f])},p=fe(g);return{_:function(){n=c.getElementsByClassName(r.autosizesClass),S("resize",p)},checkElems:p,updateElem:u}}(),le=function(){!le.i&&c.getElementsByClassName&&(le.i=!0,ue._(),ve._())};return T(function(){r.init&&le()}),d={cfg:r,autoSizer:ue,loader:ve,init:le,uP:J,aC:b,rC:F,hC:z,fire:M,gW:Y,rAF:B},d})})(He);class se{constructor(i=0,s="Network Error"){this.status=i,this.text=s}}const Oe=()=>{if(!(typeof localStorage>"u"))return{get:t=>Promise.resolve(localStorage.getItem(t)),set:(t,i)=>Promise.resolve(localStorage.setItem(t,i)),remove:t=>Promise.resolve(localStorage.removeItem(t))}},L={origin:"https://api.emailjs.com",blockHeadless:!1,storageProvider:Oe()},de=t=>t?typeof t=="string"?{publicKey:t}:t.toString()==="[object Object]"?t:{}:{},We=(t,i="https://api.emailjs.com")=>{if(!t)return;const s=de(t);L.publicKey=s.publicKey,L.blockHeadless=s.blockHeadless,L.storageProvider=s.storageProvider,L.blockList=s.blockList,L.limitRate=s.limitRate,L.origin=s.origin||i},ze=async(t,i,s={})=>{const c=await fetch(L.origin+t,{method:"POST",headers:s,body:i}),l=await c.text(),d=new se(c.status,l);if(c.ok)return d;throw d},Ee=(t,i,s)=>{if(!t||typeof t!="string")throw"The public key is required. Visit https://dashboard.emailjs.com/admin/account";if(!i||typeof i!="string")throw"The service ID is required. Visit https://dashboard.emailjs.com/admin";if(!s||typeof s!="string")throw"The template ID is required. Visit https://dashboard.emailjs.com/admin/templates"},Ve=t=>{if(t&&t.toString()!=="[object Object]")throw"The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/"},Ce=t=>t.webdriver||!t.languages||t.languages.length===0,Le=()=>new se(451,"Unavailable For Headless Browser"),De=(t,i)=>{if(!Array.isArray(t))throw"The BlockList list has to be an array";if(typeof i!="string")throw"The BlockList watchVariable has to be a string"},Ke=t=>{var i;return!((i=t.list)!=null&&i.length)||!t.watchVariable},Ue=(t,i)=>t instanceof FormData?t.get(i):t[i],Se=(t,i)=>{if(Ke(t))return!1;De(t.list,t.watchVariable);const s=Ue(i,t.watchVariable);return typeof s!="string"?!1:t.list.includes(s)},_e=()=>new se(403,"Forbidden"),$e=(t,i)=>{if(typeof t!="number"||t<0)throw"The LimitRate throttle has to be a positive number";if(i&&typeof i!="string")throw"The LimitRate ID has to be a non-empty string"},Je=async(t,i,s)=>{const c=Number(await s.get(t)||0);return i-Date.now()+c},Te=async(t,i,s)=>{if(!i.throttle||!s)return!1;$e(i.throttle,i.id);const c=i.id||t;return await Je(c,i.throttle,s)>0?!0:(await s.set(c,Date.now().toString()),!1)},xe=()=>new se(429,"Too Many Requests"),Ye=async(t,i,s,c)=>{const l=de(c),d=l.publicKey||L.publicKey,r=l.blockHeadless||L.blockHeadless,R=l.storageProvider||L.storageProvider,K={...L.blockList,...l.blockList},A={...L.limitRate,...l.limitRate};return r&&Ce(navigator)?Promise.reject(Le()):(Ee(d,t,i),Ve(s),s&&Se(K,s)?Promise.reject(_e()):await Te(location.pathname,A,R)?Promise.reject(xe()):ze("/api/v1.0/email/send",JSON.stringify({lib_version:"4.4.1",user_id:d,service_id:t,template_id:i,template_params:s}),{"Content-type":"application/json"}))},Ge=t=>{if(!t||t.nodeName!=="FORM")throw"The 3rd parameter is expected to be the HTML form element or the style selector of the form"},Xe=t=>typeof t=="string"?document.querySelector(t):t,Qe=async(t,i,s,c)=>{const l=de(c),d=l.publicKey||L.publicKey,r=l.blockHeadless||L.blockHeadless,R=L.storageProvider||l.storageProvider,K={...L.blockList,...l.blockList},A={...L.limitRate,...l.limitRate};if(r&&Ce(navigator))return Promise.reject(Le());const y=Xe(s);Ee(d,t,i),Ge(y);const S=new FormData(y);return Se(K,S)?Promise.reject(_e()):await Te(location.pathname,A,R)?Promise.reject(xe()):(S.append("lib_version","4.4.1"),S.append("service_id",t),S.append("template_id",i),S.append("user_id",d),ze("/api/v1.0/email/send-form",S))},Me={init:We,send:Ye,sendForm:Qe,EmailJSResponseStatus:se};Me.init("SSGMoBteY1IqEzwlA");document.addEventListener("DOMContentLoaded",function(){console.log("DOM Content Loaded");const t=document.querySelector(".side-nav"),i=document.querySelector(".toggle-btn");i.addEventListener("click",()=>{t.classList.toggle("active"),i.classList.toggle("active")});const s=new Promise((N,z)=>{var b=document.createElement("link");b.rel="preload",b.as="image",window.matchMedia("(min-width: 1024px)").matches?b.href="/20-fond-hero-section-1400.jpeg":b.href="/20-fond-hero-section-800.jpeg",b.onload=()=>N(),b.onerror=()=>z(new Error("Erreur lors du chargement de l'image")),document.head.appendChild(b)});function c(){particlesJS("particles-js",{particles:{number:{value:65,density:{enable:!0,value_area:800}},color:{value:"#ffffff"},shape:{type:"circle",stroke:{width:0,color:"#000000"},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:.5,random:!1,anim:{enable:!1,speed:1,opacity_min:.1,sync:!1}},size:{value:3,random:!0,anim:{enable:!1,speed:40,size_min:.1,sync:!1}},line_linked:{enable:!0,distance:236.74429248968178,color:"#ffffff",opacity:.4,width:1},move:{enable:!0,speed:5,direction:"none",random:!1,straight:!1,out_mode:"out",bounce:!1,attract:{enable:!1,rotateX:600,rotateY:1200}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:!0,mode:"repulse"},onclick:{enable:!0,mode:"push"},resize:!0},modes:{grab:{distance:400,line_linked:{opacity:1}},bubble:{distance:400,size:40,duration:2,opacity:8,speed:3},repulse:{distance:200,duration:.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:!0})}function l(){console.log("handleColorInversion appelée");const N=document.querySelector("#prix");if(!N){console.error("La section #prix n'existe pas dans le DOM.");return}console.log(N);const z=F=>{F.forEach(H=>{H.isIntersecting?document.documentElement.classList.add("root-inverted"):document.documentElement.classList.remove("root-inverted")})};new IntersectionObserver(z,{threshold:.5}).observe(N)}class d{constructor(z){this.el=z,this.chars="01",this.update=this.update.bind(this)}setText(z){const b=this.el.innerText,F=Math.max(b.length,z.length),H=new Promise(M=>this.resolve=M);this.queue=[];for(let M=0;M<F;M++){const J=b[M]||"",O=z[M]||"",Y=Math.floor(Math.random()*80),B=Y+Math.floor(Math.random()*80);this.queue.push({from:J,to:O,start:Y,end:B})}return cancelAnimationFrame(this.frameRequest),this.frame=0,this.update(),H}update(){let z="",b=0;for(let F=0,H=this.queue.length;F<H;F++){let{from:M,to:J,start:O,end:Y,char:B}=this.queue[F];this.frame>=Y?(b++,z+=J):this.frame>=O?((!B||Math.random()<.28)&&(B=this.randomChar(),this.queue[F].char=B),z+=`<span class="dud">${B}</span>`):z+=M}this.el.innerHTML=z,b===this.queue.length?this.resolve():(this.frameRequest=requestAnimationFrame(this.update),this.frame++)}randomChar(){return this.chars[Math.floor(Math.random()*this.chars.length)]}}const r=["01000100 11000011 10101001"],R=["MaVitrineDuWeb.fr"],K=["Développeur Web"],A=["A La Rochelle"],y=document.getElementById("text1"),S=document.getElementById("text2"),T=new d(y),Q=new d(S);let $=0,Z=0;const ne=()=>{T.setText(r[$]).then(()=>{setTimeout(()=>{Q.setText(R[Z]).then(()=>{setTimeout(()=>{T.setText(K[$]).then(()=>{Q.setText(A[Z]).then(()=>{setTimeout(ne,900)})})},200)})},200)})};(()=>{T.setText(K[$]).then(()=>{Q.setText(A[Z]).then(()=>{setTimeout(ne,500)})})})(),s.then(()=>{console.log("Image préchargée, initialisation des particules et inversion des couleurs"),c(),l()}).catch(N=>{console.error("Une erreur s'est produite :",N)})});const k=ScrollReveal({origin:"bottom",distance:"60px",duration:1e3,delay:100,easing:"ease-in-out"});k.reveal(".contact-form h1");k.reveal(".contact-form p",{delay:300});k.reveal(".contact-form form input:nth-child(2)",{delay:400});k.reveal(".contact-form form input:nth-child(3)",{delay:500});k.reveal(".contact-form form input:nth-child(4)",{delay:600});k.reveal(".contact-form form textarea",{delay:700});k.reveal(".submit-form-btn",{delay:200});k.reveal(".presentation",{delay:200});k.reveal(".div-phone",{delay:300});k.reveal(".services-flex",{delay:300});k.reveal(".stape-card",{delay:300});k.reveal(".pricing",{delay:500});k.reveal(".skills",{delay:300});k.reveal("#themes",{delay:300});window.sendMail=function(){const t=document.getElementById("contact-form");let i={user_name:document.getElementById("user_name").value,user_email:document.getElementById("user_email").value,subject:document.getElementById("subject").value,message:document.getElementById("message").value,contact_number:document.getElementById("contact_number").value};console.log("params:",i),Me.send("service_e1lshyl","template_nroyljv",i).then(s=>{alert("Email Sent!"),console.log("SUCCESS",s),t.reset()}).catch(s=>{console.error("Failed to send email: ",s),console.log("afetr catch params:",i)})};
