import{_ as u,o as s,c,a,i as m,l as x,t as i,B as y,b,w as f,z as g,j as v,T as k,m as h,r as C}from"./index-B08QM3qa.js";import{c as n,L as B}from"./lock-1AxAS9_A.js";import{S as w}from"./shield-Da9cAB9y.js";/**
 * @license lucide-vue-next v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=n("CircleAlertIcon",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-vue-next v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=n("CircleCheckBigIcon",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-vue-next v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=n("InfoIcon",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]),M={class:"relative inline-block"},N={key:0,class:"absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-xl text-center pointer-events-none"},S={__name:"PrivacyBadge",props:{type:{type:String,default:"secure"},className:{type:String,default:""},showTooltip:{type:Boolean,default:!0}},setup(r){const d=r,o=C(!1),l={secure:{icon:w,text:"Données Sécurisées",color:"text-medical-blue bg-blue-50 border-blue-200",description:"Vos données sont cryptées et stockées de manière sécurisée."},confidential:{icon:B,text:"Confidentiel Médical",color:"text-purple-700 bg-purple-50 border-purple-200",description:"L'accès à ce document est strictement réservé au personnel autorisé."},restricted:{icon:I,text:"Accès Restreint",color:"text-amber-700 bg-amber-50 border-amber-200",description:"Ce contenu nécessite des privilèges d'administration."},verified:{icon:V,text:"Vérifié & Validé",color:"text-health-green bg-green-50 border-green-200",description:"Ce contenu a été validé par un expert médical."},gdpr:{icon:L,text:"Conforme RGPD",color:"text-gray-700 bg-gray-100 border-gray-200",description:"Le traitement de ces données respecte le RGPD."}},t=h(()=>l[d.type]||l.secure);return(T,e)=>(s(),c("div",M,[a("div",{class:y(["flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold cursor-help transition-all hover:scale-105",t.value.color,r.className]),onMouseenter:e[0]||(e[0]=p=>o.value=!0),onMouseleave:e[1]||(e[1]=p=>o.value=!1)},[(s(),m(x(t.value.icon),{class:"w-3.5 h-3.5"})),a("span",null,i(t.value.text),1)],34),b(k,{name:"tip"},{default:f(()=>[r.showTooltip&&o.value?(s(),c("div",N,[g(i(t.value.description)+" ",1),e[2]||(e[2]=a("div",{class:"absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"},null,-1))])):v("",!0)]),_:1})]))}},z=u(S,[["__scopeId","data-v-457fb635"]]);export{V as C,z as P};
