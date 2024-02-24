var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function l(t){t.forEach(e)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(e,n,l){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const l=e.subscribe(...n);return l.unsubscribe?()=>l.unsubscribe():l}(n,l))}function c(t){return null==t?"":t}function u(t,e,n){return t.set(n),e}function i(t,e){t.appendChild(e)}function f(t,e,n){t.insertBefore(e,n||null)}function a(t){t.parentNode.removeChild(t)}function d(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function h(t){return document.createElement(t)}function m(t){return document.createTextNode(t)}function p(){return m(" ")}function g(t,e,n,l){return t.addEventListener(e,n,l),()=>t.removeEventListener(e,n,l)}function v(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function $(t){return""===t?null:+t}function b(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function y(t,e){t.value=null==e?"":e}function w(t,e,n){t.classList[n?"add":"remove"](e)}let x;function _(t){x=t}const k=[],A=[],E=[],j=[],O=Promise.resolve();let N=!1;function C(t){E.push(t)}let M=!1;const R=new Set;function T(){if(!M){M=!0;do{for(let t=0;t<k.length;t+=1){const e=k[t];_(e),P(e.$$)}for(_(null),k.length=0;A.length;)A.pop()();for(let t=0;t<E.length;t+=1){const e=E[t];R.has(e)||(R.add(e),e())}E.length=0}while(k.length);for(;j.length;)j.pop()();N=!1,M=!1,R.clear()}}function P(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(C)}}const S=new Set;function z(t,e){t&&t.i&&(S.delete(t),t.i(e))}function L(t,n,r,s){const{fragment:c,on_mount:u,on_destroy:i,after_update:f}=t.$$;c&&c.m(n,r),s||C((()=>{const n=u.map(e).filter(o);i?i.push(...n):l(n),t.$$.on_mount=[]})),f.forEach(C)}function D(t,e){const n=t.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function q(t,e){-1===t.$$.dirty[0]&&(k.push(t),N||(N=!0,O.then(T)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function B(e,o,r,s,c,u,i,f=[-1]){const d=x;_(e);const h=e.$$={fragment:null,ctx:null,props:u,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(d?d.$$.context:[])),callbacks:n(),dirty:f,skip_bound:!1,root:o.target||d.$$.root};i&&i(h.root);let m=!1;if(h.ctx=r?r(e,o.props||{},((t,n,...l)=>{const o=l.length?l[0]:n;return h.ctx&&c(h.ctx[t],h.ctx[t]=o)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](o),m&&q(e,t)),n})):[],h.update(),m=!0,l(h.before_update),h.fragment=!!s&&s(h.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);h.fragment&&h.fragment.l(t),t.forEach(a)}else h.fragment&&h.fragment.c();o.intro&&z(e.$$.fragment),L(e,o.target,o.anchor,o.customElement),T()}_(d)}class F{$destroy(){D(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const G=[];function H(e,n=t){let l;const o=new Set;function s(t){if(r(e,t)&&(e=t,l)){const t=!G.length;for(const t of o)t[1](),G.push(t,e);if(t){for(let t=0;t<G.length;t+=2)G[t][0](G[t+1]);G.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(r,c=t){const u=[r,c];return o.add(u),1===o.size&&(l=n(s)||t),r(e),()=>{o.delete(u),0===o.size&&(l(),l=null)}}}}let I=H(50),J=H(50),K=H(1),Q=H(2),U=H({from0:{default:0,to:{to1:{1:[3]}}},from1:{default:1,to:{to0:{1:[0,1,4,5,6,7,8]}}}});function V(t,e,n){const l=t.slice();return l[19]=e[n][0],l[20]=e[n][1],l[21]=e,l[22]=n,l}function W(t,e,n){const l=t.slice();return l[23]=e[n][0],l[24]=e[n][1],l}function X(t,e,n){const l=t.slice();return l[27]=e[n][0],l[28]=e[n][1],l}function Y(t){let e,n,l,o,r,s,c;function u(){t[14].call(o,t[21],t[22])}let b=Object.entries(t[20].to),w=[];for(let e=0;e<b.length;e+=1)w[e]=et(W(t,b,e));return{c(){e=h("ul"),n=h("li"),l=m("Default: "),o=h("input"),r=p();for(let t=0;t<w.length;t+=1)w[t].c();v(o,"type","number"),v(o,"class","svelte-1srh46e"),v(e,"class","svelte-1srh46e")},m(a,d){f(a,e,d),i(e,n),i(n,l),i(n,o),y(o,t[20].default),i(e,r);for(let t=0;t<w.length;t+=1)w[t].m(e,null);s||(c=g(o,"input",u),s=!0)},p(n,l){if(t=n,4&l&&$(o.value)!==t[20].default&&y(o,t[20].default),198&l){let n;for(b=Object.entries(t[20].to),n=0;n<b.length;n+=1){const o=W(t,b,n);w[n]?w[n].p(o,l):(w[n]=et(o),w[n].c(),w[n].m(e,null))}for(;n<w.length;n+=1)w[n].d(1);w.length=b.length}},d(t){t&&a(e),d(w,t),s=!1,c()}}}function Z(t){let e,n=Object.entries(t[24]),l=[];for(let e=0;e<n.length;e+=1)l[e]=tt(X(t,n,e));return{c(){e=h("ul");for(let t=0;t<l.length;t+=1)l[t].c();v(e,"class","svelte-1srh46e")},m(t,n){f(t,e,n);for(let t=0;t<l.length;t+=1)l[t].m(e,null)},p(t,o){if(132&o){let r;for(n=Object.entries(t[24]),r=0;r<n.length;r+=1){const s=X(t,n,r);l[r]?l[r].p(s,o):(l[r]=tt(s),l[r].c(),l[r].m(e,null))}for(;r<l.length;r+=1)l[r].d(1);l.length=n.length}},d(t){t&&a(e),d(l,t)}}}function tt(t){let e,n,l,o,r,s,c,u,d,$=t[27]+"";function y(...e){return t[16](t[19],t[23],t[27],...e)}return{c(){e=h("li"),n=h("span"),l=m($),o=m(": \r\n                        "),r=h("input"),c=p(),v(r,"type","text"),r.value=s=t[28]+(t[28].length?",":""),v(r,"class","svelte-1srh46e"),v(n,"class","no-pointer svelte-1srh46e")},m(t,s){f(t,e,s),i(e,n),i(n,l),i(n,o),i(n,r),i(e,c),u||(d=g(r,"input",y),u=!0)},p(e,n){t=e,4&n&&$!==($=t[27]+"")&&b(l,$),4&n&&s!==(s=t[28]+(t[28].length?",":""))&&r.value!==s&&(r.value=s)},d(t){t&&a(e),u=!1,d()}}}function et(t){let e,n,l,o,r,s,c,u,d,$=t[23].slice(-1)+"";function y(){return t[15](t[19],t[23])}let w=!t[1][t[19]+t[23]]&&Z(t);return{c(){e=h("li"),n=h("span"),l=m("To "),o=m($),r=m(":"),s=p(),w&&w.c(),c=p(),v(n,"class","svelte-1srh46e")},m(t,a){f(t,e,a),i(e,n),i(n,l),i(n,o),i(n,r),i(e,s),w&&w.m(e,null),i(e,c),u||(d=g(n,"click",y),u=!0)},p(n,l){t=n,4&l&&$!==($=t[23].slice(-1)+"")&&b(o,$),t[1][t[19]+t[23]]?w&&(w.d(1),w=null):w?w.p(t,l):(w=Z(t),w.c(),w.m(e,c))},d(t){t&&a(e),w&&w.d(),u=!1,d()}}}function nt(t){let e,n,l,o,r,s,c,u,d,$=t[19].slice(-1)+"";function y(){return t[13](t[19])}let w=!t[1][t[19]]&&Y(t);return{c(){e=h("li"),n=h("span"),l=m("From "),o=m($),r=m(":"),s=p(),w&&w.c(),c=p(),v(n,"class","svelte-1srh46e")},m(t,a){f(t,e,a),i(e,n),i(n,l),i(n,o),i(n,r),i(e,s),w&&w.m(e,null),i(e,c),u||(d=g(n,"click",y),u=!0)},p(n,l){t=n,4&l&&$!==($=t[19].slice(-1)+"")&&b(o,$),t[1][t[19]]?w&&(w.d(1),w=null):w?w.p(t,l):(w=Y(t),w.c(),w.m(e,c))},d(t){t&&a(e),w&&w.d(),u=!1,d()}}}function lt(e){let n,o,r,s,c,u,w,x,_,k,A,E,j,O,N,C,M,R,T,P,S,z,L,D,q,B,F,G,H,I=Object.entries(e[2]),J=[];for(let t=0;t<I.length;t+=1)J[t]=nt(V(e,I,t));return{c(){n=h("main"),o=h("div"),r=m("Animation speed: "),s=h("input"),c=p(),u=m(e[3]),w=p(),x=h("div"),_=m("Rows: "),k=h("input"),A=m("\r\n        Cols: "),E=h("input"),j=p(),O=h("div"),N=m("Number of states: "),C=h("input"),M=p(),R=h("div"),T=h("div"),P=h("h1"),P.textContent="Rules:",S=p(),z=h("div"),L=h("button"),L.textContent="Reset",D=p(),q=h("button"),q.textContent="Randomize",B=p(),F=h("ul");for(let t=0;t<J.length;t+=1)J[t].c();v(s,"type","range"),v(s,"min","0.1"),v(s,"max","50"),v(s,"step","0.05"),v(s,"class","svelte-1srh46e"),v(o,"class","setting svelte-1srh46e"),v(k,"type","number"),v(k,"max","250"),v(k,"class","svelte-1srh46e"),v(E,"type","number"),v(E,"max","250"),v(E,"class","svelte-1srh46e"),v(x,"class","setting svelte-1srh46e"),v(C,"type","number"),v(C,"min","2"),v(C,"max","5"),v(C,"class","svelte-1srh46e"),v(O,"class","setting svelte-1srh46e"),v(P,"class","svelte-1srh46e"),v(z,"class","buttons svelte-1srh46e"),v(T,"class","top-row svelte-1srh46e"),v(F,"class","no-pad svelte-1srh46e"),v(R,"class","rules-section svelte-1srh46e")},m(t,l){f(t,n,l),i(n,o),i(o,r),i(o,s),y(s,e[3]),i(o,c),i(o,u),i(n,w),i(n,x),i(x,_),i(x,k),y(k,e[4]),i(x,A),i(x,E),y(E,e[5]),i(n,j),i(n,O),i(O,N),i(O,C),y(C,e[0]),i(n,M),i(n,R),i(R,T),i(T,P),i(T,S),i(T,z),i(z,L),i(z,D),i(z,q),i(R,B),i(R,F);for(let t=0;t<J.length;t+=1)J[t].m(F,null);G||(H=[g(s,"change",e[9]),g(s,"input",e[9]),g(k,"input",e[10]),g(E,"input",e[11]),g(C,"input",e[12]),g(L,"click",rt),g(q,"click",e[8])],G=!0)},p(t,[e]){if(8&e&&y(s,t[3]),8&e&&b(u,t[3]),16&e&&$(k.value)!==t[4]&&y(k,t[4]),32&e&&$(E.value)!==t[5]&&y(E,t[5]),1&e&&$(C.value)!==t[0]&&y(C,t[0]),198&e){let n;for(I=Object.entries(t[2]),n=0;n<I.length;n+=1){const l=V(t,I,n);J[n]?J[n].p(l,e):(J[n]=nt(l),J[n].c(),J[n].m(F,null))}for(;n<J.length;n+=1)J[n].d(1);J.length=I.length}},i:t,o:t,d(t){t&&a(n),d(J,t),G=!1,l(H)}}}function ot(t,e){return Math.max(Math.floor(Math.random()*e),t)}function rt(){}function st(t,e,n){let l,o,r,c,i;s(t,Q,(t=>n(0,l=t))),s(t,U,(t=>n(2,o=t))),s(t,K,(t=>n(3,r=t))),s(t,I,(t=>n(4,c=t))),s(t,J,(t=>n(5,i=t)));let f={};function a(t){f[t]?n(1,f[t]=!f[t],f):n(1,f[t]=!0,f),console.log(t)}function d(t,e,n,l){let r=t.target.value.split(",").filter((t=>""!=t&&!isNaN(Number(t)))).map((t=>Number(t)));u(U,o[e].to[n][l]=r,o)}return t.$$.update=()=>{if(1&t.$$.dirty){let t=o,e={},n=Object.keys(t).length>l,r=[...Array(l)].map(((t,e)=>e));r.forEach((o=>{e[`from${o}`]=t[`from${o}`]||{default:o,to:{}},console.log(o),r.forEach((t=>{o!==t&&(console.log(o),e[`from${o}`].to[`to${t}`]=e[`from${o}`].to[`to${t}`]||{},r.forEach((r=>{e[`from${o}`].to[`to${t}`][r]=e[`from${o}`].to[`to${t}`][r]||[],n&&delete e[`from${o}`].to[`to${t}`][l]})))})),n&&delete e[`from${o}`].to[`to${l}`]})),(t=>{u(U,o=t,o)})(e)}},[l,f,o,r,c,i,a,d,function(){for(let[e,n]of Object.entries(o))for(let[l,r]of Object.entries(n.to))for(let[n,s]of Object.entries(r)){let r=[1,2,3,4,5,6,7,8],s=[];(t=ot(0,8),[...Array(t)].map(((t,e)=>e))).forEach((()=>{let t=r[ot(0,r.length)];r=r.filter((e=>e!=t)),s.push(t)})),u(U,o[e].to[l][n]=s,o)}var t},function(){r=$(this.value),K.set(r)},function(){c=$(this.value),I.set(c)},function(){i=$(this.value),J.set(i)},function(){l=$(this.value),Q.set(l)},t=>a(t),function(t,e){t[e][1].default=$(this.value)},(t,e)=>a(t+e),(t,e,n,l)=>d(l,t,e,n)]}class ct extends F{constructor(t){super(),B(this,t,st,lt,r,{})}}function ut(t,e,n){const l=t.slice();return l[22]=e[n],l}function it(t,e,n){const l=t.slice();return l[25]=e[n],l[27]=n,l}function ft(t,e,n){const l=t.slice();return l[28]=e[n],l[30]=n,l}function at(t){let e,n,o,r;function s(...e){return t[14](t[27],t[30],...e)}function u(...e){return t[15](t[27],t[30],...e)}return{c(){e=h("div"),v(e,"class",n=c(`cell state-${t[28]}`)+" svelte-vd2bmw")},m(t,n){f(t,e,n),o||(r=[g(e,"mouseenter",s),g(e,"click",u)],o=!0)},p(l,o){t=l,1&o&&n!==(n=c(`cell state-${t[28]}`)+" svelte-vd2bmw")&&v(e,"class",n)},d(t){t&&a(e),o=!1,l(r)}}}function dt(t){let e,n,l=t[25],o=[];for(let e=0;e<l.length;e+=1)o[e]=at(ft(t,l,e));return{c(){e=h("div");for(let t=0;t<o.length;t+=1)o[t].c();n=p(),v(e,"class","row svelte-vd2bmw")},m(t,l){f(t,e,l);for(let t=0;t<o.length;t+=1)o[t].m(e,null);i(e,n)},p(t,r){if(129&r){let s;for(l=t[25],s=0;s<l.length;s+=1){const c=ft(t,l,s);o[s]?o[s].p(c,r):(o[s]=at(c),o[s].c(),o[s].m(e,n))}for(;s<o.length;s+=1)o[s].d(1);o.length=l.length}},d(t){t&&a(e),d(o,t)}}}function ht(t){let e,n,l,o,r,s;function u(){return t[16](t[22])}return{c(){e=h("div"),n=h("div"),o=p(),v(n,"class",l=c(`state-${t[22]} color-box`)+" svelte-vd2bmw"),v(e,"class","svelte-vd2bmw"),w(e,"active",t[3]===t[22])},m(t,l){f(t,e,l),i(e,n),i(e,o),r||(s=g(e,"click",u),r=!0)},p(o,r){t=o,4&r&&l!==(l=c(`state-${t[22]} color-box`)+" svelte-vd2bmw")&&v(n,"class",l),12&r&&w(e,"active",t[3]===t[22])},d(t){t&&a(e),r=!1,s()}}}function mt(t){let e,n,o,r,s,u,$,y,w,x,_,k,A,E,j,O,N,C,M,R,T=t[1]?"Pause":"Play",P=t[0],q=[];for(let e=0;e<P.length;e+=1)q[e]=dt(it(t,P,e));let B=t[2],F=[];for(let e=0;e<B.length;e+=1)F[e]=ht(ut(t,B,e));return N=new ct({}),{c(){e=h("main"),n=h("div"),o=h("div");for(let t=0;t<q.length;t+=1)q[t].c();r=p(),s=h("div"),u=h("button"),$=m(T),w=p(),x=h("button"),x.textContent="Reset",_=p(),k=h("button"),k.textContent="Random",A=p(),E=h("div");for(let t=0;t<F.length;t+=1)F[t].c();var l;j=p(),O=h("div"),(l=N.$$.fragment)&&l.c(),v(o,"class","grid svelte-vd2bmw"),v(u,"class",y=c(t[1]?"red":"green")+" svelte-vd2bmw"),v(E,"class","draw-settings svelte-vd2bmw"),v(s,"class","grid-controls svelte-vd2bmw"),v(n,"class","main-area svelte-vd2bmw"),v(O,"class","settings-area svelte-vd2bmw"),v(e,"class","svelte-vd2bmw")},m(l,c){f(l,e,c),i(e,n),i(n,o);for(let t=0;t<q.length;t+=1)q[t].m(o,null);i(n,r),i(n,s),i(s,u),i(u,$),i(s,w),i(s,x),i(s,_),i(s,k),i(s,A),i(s,E);for(let t=0;t<F.length;t+=1)F[t].m(E,null);i(e,j),i(e,O),L(N,O,null),C=!0,M||(R=[g(window,"keydown",t[13]),g(o,"mousedown",pt),g(u,"click",t[4]),g(x,"click",t[5]),g(k,"click",t[6])],M=!0)},p(t,[e]){if(129&e){let n;for(P=t[0],n=0;n<P.length;n+=1){const l=it(t,P,n);q[n]?q[n].p(l,e):(q[n]=dt(l),q[n].c(),q[n].m(o,null))}for(;n<q.length;n+=1)q[n].d(1);q.length=P.length}if((!C||2&e)&&T!==(T=t[1]?"Pause":"Play")&&b($,T),(!C||2&e&&y!==(y=c(t[1]?"red":"green")+" svelte-vd2bmw"))&&v(u,"class",y),12&e){let n;for(B=t[2],n=0;n<B.length;n+=1){const l=ut(t,B,n);F[n]?F[n].p(l,e):(F[n]=ht(l),F[n].c(),F[n].m(E,null))}for(;n<F.length;n+=1)F[n].d(1);F.length=B.length}},i(t){C||(z(N.$$.fragment,t),C=!0)},o(t){!function(t,e,n,l){if(t&&t.o){if(S.has(t))return;S.add(t),(void 0).c.push((()=>{S.delete(t),l&&(n&&t.d(1),l())})),t.o(e)}}(N.$$.fragment,t),C=!1},d(t){t&&a(e),d(q,t),d(F,t),D(N),M=!1,l(R)}}}const pt=t=>t.preventDefault();function gt(t,e,n){let l,o,r,c,u;s(t,J,(t=>n(9,l=t))),s(t,I,(t=>n(10,o=t))),s(t,U,(t=>n(18,r=t))),s(t,Q,(t=>n(11,c=t))),s(t,K,(t=>n(12,u=t)));let i,f,a=[...Array(o)].map((()=>[...Array(l)].map((()=>0)))),d=!1,h=[...Array(c)].map(((t,e)=>e)),m=1;function p(t,e,n){let l=function(t,e,n){let l=Object.fromEntries(h.map((t=>[t,0])));for(let t=-1;t<=1;t++)if(void 0!==a[e+t])for(let o=-1;o<=1;o++){let r=a[e+t][n+o];void 0===r||0===t&0===o||(l[r]+=1)}return l}(0,e,n);const o=r[`from${t}`];if(!o)return console.log("no rule for ",t),t;if(!o.to)return o.default;for(let[t,e]of Object.entries(o.to)){let n=Number(t[t.length-1]);for(let[t,o]of Object.entries(e)){let e=l[t];if(o.includes(e))return n}}return o.default||t}function g(){n(8,i=setTimeout((()=>{if(!d)return void clearTimeout(i);let t=[];a.forEach((e=>{let n=[];e.forEach((t=>{n.push(t)})),t.push(n)})),a.forEach(((e,n)=>{e.forEach(((e,l)=>{t[n][l]=p(e,n,l)}))})),n(0,a=t),d&&g()}),f))}function v(){n(1,d=!d),g()}function $(){n(0,a=[...Array(o)].map((()=>[...Array(l)].map((()=>0))))),n(1,d=!1)}function b(t,e,l,o=!1){1===t.which&&n(0,a[e][l]=m,a)}p(1,0,0);return t.$$.update=()=>{1536&t.$$.dirty&&n(0,a=[...Array(o)].map((()=>[...Array(l)].map((()=>0))))),4352&t.$$.dirty&&(clearTimeout(i),f=Number(1e3/u),g()),2048&t.$$.dirty&&(n(2,h=[...Array(c)].map(((t,e)=>e))),$())},[a,d,h,m,v,$,function(){n(0,a=[...Array(o)].map((()=>[...Array(l)].map((()=>Math.floor(Math.random()*h.length))))))},b,i,l,o,c,u,t=>{"Space"===t.code&&v()},(t,e,n)=>b(n,t,e),(t,e,n)=>b(n,t,e,!0),t=>n(3,m=t)]}return new class extends F{constructor(t){super(),B(this,t,gt,mt,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map