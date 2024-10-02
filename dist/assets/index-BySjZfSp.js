(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))c(l);new MutationObserver(l=>{for(const d of l)if(d.type==="childList")for(const a of d.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&c(a)}).observe(document,{childList:!0,subtree:!0});function r(l){const d={};return l.integrity&&(d.integrity=l.integrity),l.referrerPolicy&&(d.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?d.credentials="include":l.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function c(l){if(l.ep)return;l.ep=!0;const d=r(l);fetch(l.href,d)}})();var He={exports:{}};(function(t){(function(s,r){var c=r(s,s.document,Date);s.lazySizes=c,t.exports&&(t.exports=c)})(typeof window<"u"?window:{},function(r,c,l){var d,a;if(function(){var n,i={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",fastLoadedClass:"ls-is-cached",iframeLoadMode:0,srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:!0,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:!0,ricTimeout:0,throttleDelay:125};a=r.lazySizesConfig||r.lazysizesConfig||{};for(n in i)n in a||(a[n]=i[n])}(),!c||!c.getElementsByClassName)return{init:function(){},cfg:a,noSupport:!0};var P=c.documentElement,D=r.HTMLPictureElement,k="addEventListener",y="getAttribute",L=r[k].bind(r),_=r.setTimeout,X=r.requestAnimationFrame||_,U=r.requestIdleCallback,Q=/^picture$/i,ne=["load","error","lazyincluded","_lazyloaded"],re={},Z=Array.prototype.forEach,E=function(n,i){return re[i]||(re[i]=new RegExp("(\\s|^)"+i+"(\\s|$)")),re[i].test(n[y]("class")||"")&&re[i]},R=function(n,i){E(n,i)||n.setAttribute("class",(n[y]("class")||"").trim()+" "+i)},F=function(n,i){var u;(u=E(n,i))&&n.setAttribute("class",(n[y]("class")||"").replace(u," "))},I=function(n,i,u){var g=u?k:"removeEventListener";u&&I(n,i),ne.forEach(function(p){n[g](p,i)})},x=function(n,i,u,g,p){var f=c.createEvent("Event");return u||(u={}),u.instance=d,f.initEvent(i,!g,!p),f.detail=u,n.dispatchEvent(f),f},$=function(n,i){var u;!D&&(u=r.picturefill||a.pf)?(i&&i.src&&!n[y]("srcset")&&n.setAttribute("srcset",i.src),u({reevaluate:!0,elements:[n]})):i&&i.src&&(n.src=i.src)},H=function(n,i){return(getComputedStyle(n,null)||{})[i]},J=function(n,i,u){for(u=u||n.offsetWidth;u<a.minSize&&i&&!n._lazysizesWidth;)u=i.offsetWidth,i=i.parentNode;return u},B=function(){var n,i,u=[],g=[],p=u,f=function(){var v=p;for(p=u.length?g:u,n=!0,i=!1;v.length;)v.shift()();n=!1},b=function(v,h){n&&!h?v.apply(this,arguments):(p.push(v),i||(i=!0,(c.hidden?_:X)(f)))};return b._lsFlush=f,b}(),oe=function(n,i){return i?function(){B(n)}:function(){var u=this,g=arguments;B(function(){n.apply(u,g)})}},ke=function(n){var i,u=0,g=a.throttleDelay,p=a.ricTimeout,f=function(){i=!1,u=l.now(),n()},b=U&&p>49?function(){U(f,{timeout:p}),p!==a.ricTimeout&&(p=a.ricTimeout)}:oe(function(){_(f)},!0);return function(v){var h;(v=v===!0)&&(p=33),!i&&(i=!0,h=g-(l.now()-u),h<0&&(h=0),v||h<9?b():_(b,h))}},fe=function(n){var i,u,g=99,p=function(){i=null,n()},f=function(){var b=l.now()-u;b<g?_(f,g-b):(U||p)(p)};return function(){u=l.now(),i||(i=_(f,g))}},ve=function(){var n,i,u,g,p,f,b,v,h,A,q,Y,Ae=/^img$/i,we=/^iframe$/i,Pe="onscroll"in r&&!/(gle|ing)bot/.test(navigator.userAgent),Re=0,ae=0,N=0,ee=-1,me=function(e){N--,(!e||N<0||!e.target)&&(N=0)},he=function(e){return Y==null&&(Y=H(c.body,"visibility")=="hidden"),Y||!(H(e.parentNode,"visibility")=="hidden"&&H(e,"visibility")=="hidden")},Fe=function(e,o){var m,z=e,S=he(e);for(v-=o,q+=o,h-=o,A+=o;S&&(z=z.offsetParent)&&z!=c.body&&z!=P;)S=(H(z,"opacity")||1)>0,S&&H(z,"overflow")!="visible"&&(m=z.getBoundingClientRect(),S=A>m.left&&h<m.right&&q>m.top-1&&v<m.bottom+1);return S},pe=function(){var e,o,m,z,S,T,O,W,K,V,G,te,j=d.elements;if((g=a.loadMode)&&N<8&&(e=j.length)){for(o=0,ee++;o<e;o++)if(!(!j[o]||j[o]._lazyRace)){if(!Pe||d.prematureUnveil&&d.prematureUnveil(j[o])){ie(j[o]);continue}if((!(W=j[o][y]("data-expand"))||!(T=W*1))&&(T=ae),V||(V=!a.expand||a.expand<1?P.clientHeight>500&&P.clientWidth>500?500:370:a.expand,d._defEx=V,G=V*a.expFactor,te=a.hFac,Y=null,ae<G&&N<1&&ee>2&&g>2&&!c.hidden?(ae=G,ee=0):g>1&&ee>1&&N<6?ae=V:ae=Re),K!==T&&(f=innerWidth+T*te,b=innerHeight+T,O=T*-1,K=T),m=j[o].getBoundingClientRect(),(q=m.bottom)>=O&&(v=m.top)<=b&&(A=m.right)>=O*te&&(h=m.left)<=f&&(q||A||h||v)&&(a.loadHidden||he(j[o]))&&(i&&N<3&&!W&&(g<3||ee<4)||Fe(j[o],T))){if(ie(j[o]),S=!0,N>9)break}else!S&&i&&!z&&N<4&&ee<4&&g>2&&(n[0]||a.preloadAfterLoad)&&(n[0]||!W&&(q||A||h||v||j[o][y](a.sizesAttr)!="auto"))&&(z=n[0]||j[o])}z&&!S&&ie(z)}},w=ke(pe),ge=function(e){var o=e.target;if(o._lazyCache){delete o._lazyCache;return}me(e),R(o,a.loadedClass),F(o,a.loadingClass),I(o,ye),x(o,"lazyloaded")},Be=oe(ge),ye=function(e){Be({target:e.target})},je=function(e,o){var m=e.getAttribute("data-load-mode")||a.iframeLoadMode;m==0?e.contentWindow.location.replace(o):m==1&&(e.src=o)},Ne=function(e){var o,m=e[y](a.srcsetAttr);(o=a.customMedia[e[y]("data-media")||e[y]("media")])&&e.setAttribute("media",o),m&&e.setAttribute("srcset",m)},qe=oe(function(e,o,m,z,S){var T,O,W,K,V,G;(V=x(e,"lazybeforeunveil",o)).defaultPrevented||(z&&(m?R(e,a.autosizesClass):e.setAttribute("sizes",z)),O=e[y](a.srcsetAttr),T=e[y](a.srcAttr),S&&(W=e.parentNode,K=W&&Q.test(W.nodeName||"")),G=o.firesLoad||"src"in e&&(O||T||K),V={target:e},R(e,a.loadingClass),G&&(clearTimeout(u),u=_(me,2500),I(e,ye,!0)),K&&Z.call(W.getElementsByTagName("source"),Ne),O?e.setAttribute("srcset",O):T&&!K&&(we.test(e.nodeName)?je(e,T):e.src=T),S&&(O||K)&&$(e,{src:T})),e._lazyRace&&delete e._lazyRace,F(e,a.lazyClass),B(function(){var te=e.complete&&e.naturalWidth>1;(!G||te)&&(te&&R(e,a.fastLoadedClass),ge(V),e._lazyCache=!0,_(function(){"_lazyCache"in e&&delete e._lazyCache},9)),e.loading=="lazy"&&N--},!0)}),ie=function(e){if(!e._lazyRace){var o,m=Ae.test(e.nodeName),z=m&&(e[y](a.sizesAttr)||e[y]("sizes")),S=z=="auto";(S||!i)&&m&&(e[y]("src")||e.srcset)&&!e.complete&&!E(e,a.errorClass)&&E(e,a.lazyClass)||(o=x(e,"lazyunveilread").detail,S&&ue.updateElem(e,!0,e.offsetWidth),e._lazyRace=!0,N++,qe(e,o,S,z,m))}},Ie=fe(function(){a.loadMode=3,w()}),be=function(){a.loadMode==3&&(a.loadMode=2),Ie()},ce=function(){if(!i){if(l.now()-p<999){_(ce,999);return}i=!0,a.loadMode=3,w(),L("scroll",be,!0)}};return{_:function(){p=l.now(),d.elements=c.getElementsByClassName(a.lazyClass),n=c.getElementsByClassName(a.lazyClass+" "+a.preloadClass),L("scroll",w,!0),L("resize",w,!0),L("pageshow",function(e){if(e.persisted){var o=c.querySelectorAll("."+a.loadingClass);o.length&&o.forEach&&X(function(){o.forEach(function(m){m.complete&&ie(m)})})}}),r.MutationObserver?new MutationObserver(w).observe(P,{childList:!0,subtree:!0,attributes:!0}):(P[k]("DOMNodeInserted",w,!0),P[k]("DOMAttrModified",w,!0),setInterval(w,999)),L("hashchange",w,!0),["focus","mouseover","click","load","transitionend","animationend"].forEach(function(e){c[k](e,w,!0)}),/d$|^c/.test(c.readyState)?ce():(L("load",ce),c[k]("DOMContentLoaded",w),_(ce,2e4)),d.elements.length?(pe(),B._lsFlush()):w()},checkElems:w,unveil:ie,_aLSL:be}}(),ue=function(){var n,i=oe(function(f,b,v,h){var A,q,Y;if(f._lazysizesWidth=h,h+="px",f.setAttribute("sizes",h),Q.test(b.nodeName||""))for(A=b.getElementsByTagName("source"),q=0,Y=A.length;q<Y;q++)A[q].setAttribute("sizes",h);v.detail.dataAttr||$(f,v.detail)}),u=function(f,b,v){var h,A=f.parentNode;A&&(v=J(f,A,v),h=x(f,"lazybeforesizes",{width:v,dataAttr:!!b}),h.defaultPrevented||(v=h.detail.width,v&&v!==f._lazysizesWidth&&i(f,A,h,v)))},g=function(){var f,b=n.length;if(b)for(f=0;f<b;f++)u(n[f])},p=fe(g);return{_:function(){n=c.getElementsByClassName(a.autosizesClass),L("resize",p)},checkElems:p,updateElem:u}}(),le=function(){!le.i&&c.getElementsByClassName&&(le.i=!0,ue._(),ve._())};return _(function(){a.init&&le()}),d={cfg:a,autoSizer:ue,loader:ve,init:le,uP:$,aC:R,rC:F,hC:E,fire:x,gW:J,rAF:B},d})})(He);class se{constructor(s=0,r="Network Error"){this.status=s,this.text=r}}const Oe=()=>{if(!(typeof localStorage>"u"))return{get:t=>Promise.resolve(localStorage.getItem(t)),set:(t,s)=>Promise.resolve(localStorage.setItem(t,s)),remove:t=>Promise.resolve(localStorage.removeItem(t))}},C={origin:"https://api.emailjs.com",blockHeadless:!1,storageProvider:Oe()},de=t=>t?typeof t=="string"?{publicKey:t}:t.toString()==="[object Object]"?t:{}:{},We=(t,s="https://api.emailjs.com")=>{if(!t)return;const r=de(t);C.publicKey=r.publicKey,C.blockHeadless=r.blockHeadless,C.storageProvider=r.storageProvider,C.blockList=r.blockList,C.limitRate=r.limitRate,C.origin=r.origin||s},ze=async(t,s,r={})=>{const c=await fetch(C.origin+t,{method:"POST",headers:r,body:s}),l=await c.text(),d=new se(c.status,l);if(c.ok)return d;throw d},Ee=(t,s,r)=>{if(!t||typeof t!="string")throw"The public key is required. Visit https://dashboard.emailjs.com/admin/account";if(!s||typeof s!="string")throw"The service ID is required. Visit https://dashboard.emailjs.com/admin";if(!r||typeof r!="string")throw"The template ID is required. Visit https://dashboard.emailjs.com/admin/templates"},Ve=t=>{if(t&&t.toString()!=="[object Object]")throw"The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/"},Ce=t=>t.webdriver||!t.languages||t.languages.length===0,Le=()=>new se(451,"Unavailable For Headless Browser"),De=(t,s)=>{if(!Array.isArray(t))throw"The BlockList list has to be an array";if(typeof s!="string")throw"The BlockList watchVariable has to be a string"},Ke=t=>{var s;return!((s=t.list)!=null&&s.length)||!t.watchVariable},Ue=(t,s)=>t instanceof FormData?t.get(s):t[s],Se=(t,s)=>{if(Ke(t))return!1;De(t.list,t.watchVariable);const r=Ue(s,t.watchVariable);return typeof r!="string"?!1:t.list.includes(r)},_e=()=>new se(403,"Forbidden"),$e=(t,s)=>{if(typeof t!="number"||t<0)throw"The LimitRate throttle has to be a positive number";if(s&&typeof s!="string")throw"The LimitRate ID has to be a non-empty string"},Je=async(t,s,r)=>{const c=Number(await r.get(t)||0);return s-Date.now()+c},Te=async(t,s,r)=>{if(!s.throttle||!r)return!1;$e(s.throttle,s.id);const c=s.id||t;return await Je(c,s.throttle,r)>0?!0:(await r.set(c,Date.now().toString()),!1)},xe=()=>new se(429,"Too Many Requests"),Ye=async(t,s,r,c)=>{const l=de(c),d=l.publicKey||C.publicKey,a=l.blockHeadless||C.blockHeadless,P=l.storageProvider||C.storageProvider,D={...C.blockList,...l.blockList},k={...C.limitRate,...l.limitRate};return a&&Ce(navigator)?Promise.reject(Le()):(Ee(d,t,s),Ve(r),r&&Se(D,r)?Promise.reject(_e()):await Te(location.pathname,k,P)?Promise.reject(xe()):ze("/api/v1.0/email/send",JSON.stringify({lib_version:"4.4.1",user_id:d,service_id:t,template_id:s,template_params:r}),{"Content-type":"application/json"}))},Ge=t=>{if(!t||t.nodeName!=="FORM")throw"The 3rd parameter is expected to be the HTML form element or the style selector of the form"},Xe=t=>typeof t=="string"?document.querySelector(t):t,Qe=async(t,s,r,c)=>{const l=de(c),d=l.publicKey||C.publicKey,a=l.blockHeadless||C.blockHeadless,P=C.storageProvider||l.storageProvider,D={...C.blockList,...l.blockList},k={...C.limitRate,...l.limitRate};if(a&&Ce(navigator))return Promise.reject(Le());const y=Xe(r);Ee(d,t,s),Ge(y);const L=new FormData(y);return Se(D,L)?Promise.reject(_e()):await Te(location.pathname,k,P)?Promise.reject(xe()):(L.append("lib_version","4.4.1"),L.append("service_id",t),L.append("template_id",s),L.append("user_id",d),ze("/api/v1.0/email/send-form",L))},Me={init:We,send:Ye,sendForm:Qe,EmailJSResponseStatus:se};Me.init("SSGMoBteY1IqEzwlA");document.addEventListener("DOMContentLoaded",function(){console.log("DOM Content Loaded");const t=document.querySelector(".side-nav"),s=document.querySelector(".toggle-btn");s.addEventListener("click",()=>{t.classList.toggle("active"),s.classList.toggle("active")});var r=document.createElement("link");r.rel="preload",r.as="image",window.matchMedia("(min-width: 1024px)").matches?r.href="/20-fond-hero-section-1400.jpeg":r.href="/20-fond-hero-section-800.jpeg",document.head.appendChild(r);function c(){particlesJS("particles-js",{particles:{number:{value:65,density:{enable:!0,value_area:800}},color:{value:"#ffffff"},shape:{type:"circle",stroke:{width:0,color:"#000000"},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:.5,random:!1,anim:{enable:!1,speed:1,opacity_min:.1,sync:!1}},size:{value:3,random:!0,anim:{enable:!1,speed:40,size_min:.1,sync:!1}},line_linked:{enable:!0,distance:236.74429248968178,color:"#ffffff",opacity:.4,width:1},move:{enable:!0,speed:5,direction:"none",random:!1,straight:!1,out_mode:"out",bounce:!1,attract:{enable:!1,rotateX:600,rotateY:1200}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:!0,mode:"repulse"},onclick:{enable:!0,mode:"push"},resize:!0},modes:{grab:{distance:400,line_linked:{opacity:1}},bubble:{distance:400,size:40,duration:2,opacity:8,speed:3},repulse:{distance:200,duration:.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:!0})}function l(){console.log("handleColorInversion appelée");const Z=document.querySelector("#prix");if(!Z){console.error("La section #prix n'existe pas dans le DOM.");return}console.log(Z);const E=F=>{F.forEach(I=>{I.isIntersecting?document.documentElement.classList.add("root-inverted"):document.documentElement.classList.remove("root-inverted")})};new IntersectionObserver(E,{threshold:.5}).observe(Z)}c(),l();class d{constructor(E){this.el=E,this.chars="01",this.update=this.update.bind(this)}setText(E){const R=this.el.innerText,F=Math.max(R.length,E.length),I=new Promise(x=>this.resolve=x);this.queue=[];for(let x=0;x<F;x++){const $=R[x]||"",H=E[x]||"",J=Math.floor(Math.random()*80),B=J+Math.floor(Math.random()*80);this.queue.push({from:$,to:H,start:J,end:B})}return cancelAnimationFrame(this.frameRequest),this.frame=0,this.update(),I}update(){let E="",R=0;for(let F=0,I=this.queue.length;F<I;F++){let{from:x,to:$,start:H,end:J,char:B}=this.queue[F];this.frame>=J?(R++,E+=$):this.frame>=H?((!B||Math.random()<.28)&&(B=this.randomChar(),this.queue[F].char=B),E+=`<span class="dud">${B}</span>`):E+=x}this.el.innerHTML=E,R===this.queue.length?this.resolve():(this.frameRequest=requestAnimationFrame(this.update),this.frame++)}randomChar(){return this.chars[Math.floor(Math.random()*this.chars.length)]}}const a=["01000100 11000011 10101001"],P=["MaVitrineDuWeb.fr"],D=["Développeur Web"],k=["A La Rochelle"],y=document.getElementById("text1"),L=document.getElementById("text2"),_=new d(y),X=new d(L);let U=0,Q=0;const ne=()=>{_.setText(a[U]).then(()=>{setTimeout(()=>{X.setText(P[Q]).then(()=>{setTimeout(()=>{_.setText(D[U]).then(()=>{X.setText(k[Q]).then(()=>{setTimeout(ne,900)})})},200)})},200)})};(()=>{_.setText(D[U]).then(()=>{X.setText(k[Q]).then(()=>{setTimeout(ne,500)})})})()});const M=ScrollReveal({origin:"bottom",distance:"60px",duration:1e3,delay:100,easing:"ease-in-out"});M.reveal(".contact-form h1");M.reveal(".contact-form p",{delay:300});M.reveal(".contact-form form input:nth-child(2)",{delay:400});M.reveal(".contact-form form input:nth-child(3)",{delay:500});M.reveal(".contact-form form input:nth-child(4)",{delay:600});M.reveal(".contact-form form textarea",{delay:700});M.reveal(".submit-form-btn",{delay:200});M.reveal(".presentation",{delay:200});M.reveal(".div-phone",{delay:300});M.reveal(".services-flex",{delay:300});M.reveal(".stape-card",{delay:300});M.reveal(".pricing",{delay:500});M.reveal(".skills",{delay:300});M.reveal("#themes",{delay:300});window.sendMail=function(){const t=document.getElementById("contact-form");let s={user_name:document.getElementById("user_name").value,user_email:document.getElementById("user_email").value,subject:document.getElementById("subject").value,message:document.getElementById("message").value,contact_number:document.getElementById("contact_number").value};console.log("params:",s),Me.send("service_e1lshyl","template_nroyljv",s).then(r=>{alert("Email Sent!"),console.log("SUCCESS",r),t.reset()}).catch(r=>{console.error("Failed to send email: ",r),console.log("afetr catch params:",s)})};
