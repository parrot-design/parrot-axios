!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).ParrotAxios=t()}(this,(function(){"use strict";const e=Object.prototype.toString;function t(t){return"[object Object]"===e.call(t)}function r(...e){const n=Object.create(null);return e.forEach((e=>{e&&Object.keys(e).forEach((o=>{const s=e[o];t(s)?t(n[o])?n[o]=r(n[o],s):n[o]=r(s):n[o]=s}))})),n}function n(e,r){return function(e,t){e&&Object.keys(e).forEach((r=>{r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=e[r],delete e[r])}))}(e,"Content-Type"),t(r)&&e&&!e["Content-Type"]&&(e["Content-Type"]="application/json;charset=utf-8"),e}class o extends Error{constructor(e,t,r,n,s){super(e),this.config=t,this.code=r,this.request=n,this.response=s,this.isAxiosError=!0,Object.setPrototypeOf(this,o.prototype)}}function s(e,t,r,n,s){return new o(e,t,r,n,s)}function i(e){return encodeURIComponent(e).replace(/%40/g,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}function a(r,n,o){if(!n)return r;let s;if(o)s=o(n);else if(void 0!==(a=n)&&a instanceof URLSearchParams)s=n.toString();else{const r=[];Object.keys(n).forEach((o=>{const s=n[o];if(null==s)return;let a=[];Array.isArray(s)?(a=s,o+="[]"):a=[s],a.forEach((n=>{!function(t){return"[object Date]"===e.call(t)}(n)?t(n)&&(n=JSON.stringify(n)):n=n.toISOString(),r.push(`${i(o)}=${i(n)}`)}))})),s=r.join("&")}var a;if(s){const e=r.indexOf("#");-1!==e&&(r=r.slice(0,e)),r+=(-1===r.indexOf("?")?"?":"&")+s}return r}const c=document.createElement("a"),u=l(window.location.href);function l(e){c.setAttribute("href",e);const{protocol:t,host:r}=c;return{protocol:t,host:r}}const h={read(e){const t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null}};function f(e){return new Promise(((t,r)=>{const{data:n=null,url:o,method:i,headers:a={},responseType:c,timeout:f,cancelToken:p,withCredentials:d,xsrfCookieName:m,xsrfHeaderName:g,onDownloadProgress:y,onUploadProgress:w,auth:E,validateStatus:j}=e,q=new XMLHttpRequest;q.open(i.toUpperCase(),o,!0),function(){c&&(q.responseType=c);f&&(q.timeout=f);d&&(q.withCredentials=d)}(),function(){q.onreadystatechange=function(){if(4!==q.readyState)return;if(0===q.status)return;const n=function(e){let t=Object.create(null);return e?(e.split("\r\n").forEach((e=>{let[r,...n]=e.split(":");if(r=r.trim().toLowerCase(),!r)return;const o=n.join(":").trim();t[r]=o})),t):t}(q.getAllResponseHeaders());!function(n){!j||j(n.status)?t(n):r(s(`Request failed with status code ${n.status}`,e,null,q,n))}({data:c&&"text"!==c?q.response:q.responseText,status:q.status,statusText:q.statusText,headers:n,config:e,request:q})},q.onerror=function(){r(s("Network Error",e,null,q))},q.ontimeout=function(){r(s(`Timeout of ${e.timeout} ms exceeded`,e,"ECONNABORTED",q))},y&&(q.onprogress=y);w&&(q.upload.onprogress=w)}(),function(){e=n,void 0!==e&&e instanceof FormData&&delete a["Content-Type"];var e;if((d||function(e){const t=l(e);return t.protocol===u.protocol&&t.host===u.host}(o))&&m){const e=h.read(m);e&&g&&(a[g]=e)}E&&(a.Authorization="Basic "+btoa(E.username+":"+E.password));Object.keys(a).forEach((e=>{null===n&&"content-type"===e.toLowerCase()?delete a[e]:q.setRequestHeader(e,a[e])}))}(),p&&p.promise.then((e=>{q.abort(),r(e)})).catch((()=>{})),q.send(n)}))}function p(e,t,r){return r?(Array.isArray(r)||(r=[r]),r.forEach((r=>{e=r(e,t)})),e):e}function d(e){return function(e){e.cancelToken&&e.cancelToken.throwIfRequested()}(e),function(e){e.url=m(e),e.data=p(e.data,e.headers,e.transformRequest),e.headers=(t=e.headers,n=e.method,t?(t=r(t.common,t[n],t),["delete","get","head","options","post","put","patch","common"].forEach((e=>{delete t[e]})),t):t);var t,n}(e),f(e).then((e=>g(e)),(e=>(e&&e.response&&(e.response=g(e.response)),Promise.reject(e))))}function m(e){let{url:t,params:r,paramsSerializer:n,baseURL:o}=e;return o&&!function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}(t)&&(t=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}(o,t)),a(t,r,n)}function g(e){return e.data=p(e.data,e.headers,e.config.transformResponse),e}class y{constructor(){this.interceptors=[]}use(e,t){return this.interceptors.push({resolved:e,rejected:t}),this.interceptors.length-1}forEach(e){this.interceptors.forEach((t=>{null!==t&&e(t)}))}eject(e){this.interceptors[e]&&(this.interceptors[e]=null)}}const w=Object.create(null);function E(e,t){return void 0!==t?t:e}function j(e,t){if(void 0!==t)return t}function q(e,n){return t(n)?r(e,n):void 0!==n?n:t(e)?r(e):e}["url","params","data"].forEach((e=>{w[e]=j}));function O(e,t){t||(t={});const r=Object.create(null);for(let e in t)n(e);for(let r in e)t[r]||n(r);function n(n){const o=w[n]||E;r[n]=o(e[n],t[n])}return r}["headers","auth"].forEach((e=>{w[e]=q}));class b{constructor(e){this.defaults=e,this.interceptors={request:new y,response:new y}}request(e,t){"string"==typeof e?(t||(t={}),t.url=e):t=e,(t=O(this.defaults,t)).method=t.method.toLowerCase();const r=[{resolved:d,rejected:void 0}];this.interceptors.request.forEach((e=>{r.unshift(e)})),this.interceptors.response.forEach((e=>{r.push(e)}));let n=Promise.resolve(t);for(;r.length;){const{resolved:e,rejected:t}=r.shift();n=n.then(e,t)}return n}get(e,t){return this._requestMethodWithoutData("get",e,t)}delete(e,t){return this._requestMethodWithoutData("delete",e,t)}head(e,t){return this._requestMethodWithoutData("head",e,t)}options(e,t){return this._requestMethodWithoutData("options",e,t)}post(e,t,r){return this._requestMethodWithData("post",e,t,r)}put(e,t,r){return this._requestMethodWithData("put",e,t,r)}patch(e,t,r){return this._requestMethodWithData("patch",e,t,r)}getUri(e){return m(e=O(this.defaults,e))}_requestMethodWithoutData(e,t,r){return this.request(Object.assign(r||{},{method:e,url:t}))}_requestMethodWithData(e,t,r,n){return this.request(Object.assign(n||{},{method:e,url:t,data:r}))}}const x={method:"get",timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",headers:{common:{Accept:"application/json, text/plain, */*"}},transformRequest:[function(e,r){return n(r,e),function(e){return t(e)?JSON.stringify(e):e}(e)}],transformResponse:[function(e){return function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}(e)}],validateStatus:e=>e>=200&&e<300};["delete","get","head","options"].forEach((e=>{x.headers[e]={}}));["post","put","patch"].forEach((e=>{x.headers[e]={"Content-Type":"application/x-www-form-urlencoded"}}));class C{constructor(e){this.message=e}}class T{constructor(e){let t;this.promise=new Promise((e=>{t=e})),e((e=>{this.reason||(this.reason=new C(e),t(this.reason))}))}throwIfRequested(){if(this.reason)throw this.reason}static source(){let e;const t=new T((t=>{e=t}));return{cancel:e,token:t}}}function R(e){const t=new b(e),r=b.prototype.request.bind(t);return console.log("context",t),function(e,t){console.log("extends key",t);for(const r in t)console.log("extends key",r),e[r]=t[r]}(r,t),r}const k=R(x);return k.create=function(e){return R(O(x,e))},k.CancelToken=T,k.Cancel=C,k.isCancel=function(e){return e instanceof C},k.all=function(e){return Promise.all(e)},k.spread=function(e){return function(t){return e.apply(null,t)}},k.Axios=b,k}));
