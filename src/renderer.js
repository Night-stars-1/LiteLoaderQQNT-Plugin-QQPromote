var ge=LiteLoader.plugins.qqpromote.path,se=qqpromote.ogs,ie=qqpromote.get_imgbase64;String.prototype.format=function(e){return this.replace(/\{(\w+)\}/g,(t,s)=>e[s]||"")};function W(...e){console.log("\x1B[32m[QQ\u589E\u5F3A-\u6E32\u67D3]\x1B[0m",...e)}function R(e){for(let t of e)if(!t.classList.contains("image"))return!1;return!0}async function B(e){let t={"https://www\\.bilibili\\.com/video/av(\\d+)":"https://api.bilibili.com/x/web-interface/view?aid={key}"};for(let n in t){let a=new RegExp(n),m=e.match(a);if(m)try{let l=m[1],c=t[n].format({key:l}),r=await(await fetch(c)).json(),d={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) QQ/9.9.1-15717 Chrome/114.0.5735.243 Electron/25.3.1 Safari/537.36"},p=await ie(r.data.pic,{headers:d,responseType:"arraybuffer"});return{title:r.data.title,description:r.data.desc,image:p}}catch{return!1}}return await se(e)}function oe(e){var t=document.createElement("canvas");t.width=e.width,t.height=e.height;var s=t.getContext("2d");s.drawImage(e,0,0,e.width,e.height);var n=t.toDataURL("image/png");return n}async function z(e){return await fetch("https://qrdetector-api.cli.im/v1/detect_binary",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183"},body:`image_data=${oe(e)}&remove_background=0`}).then(t=>t.json()).then(t=>t.status==1?t.data.qrcode_content:t.message)}function b(e){let t=parseInt(e.substring(1,3),16)/255,s=parseInt(e.substring(3,5),16)/255,n=parseInt(e.substring(5,7),16)/255,a=Math.max(t,s,n),m=Math.min(t,s,n),l=a-m,c,o,r;return l===0?c=0:a===t?c=60*((s-n)/l%6):a===s?c=60*((n-t)/l+2):c=60*((t-s)/l+4),r=(a+m)/2,l===0?o=0:o=l/(1-Math.abs(2*r-1)),[c,o*100,r*100]}function N(e,t,s){e/=255,t/=255,s/=255;let n=Math.max(e,t,s),a=Math.min(e,t,s),m,l,c;if(c=(n+a)/2,n===a)m=l=0;else{let o=n-a;switch(l=c>.5?o/(2-n-a):o/(n+a),n){case e:m=(t-s)/o+(t<s?6:0);break;case t:m=(s-e)/o+2;break;case s:m=(e-t)/o+4;break}m/=6}return m=Math.round(m*360),l=Math.round(l*100),c=Math.round(c*100),[m,l,c]}function Q(e,t){let s;return function(){let n=this,a=arguments;clearTimeout(s),s=setTimeout(()=>e.apply(n,a),t)}}var re=document.createElement("div");re.innerHTML=`
<div class="q-context-menu-separator" role="separator"></div>
`;var P=document.createElement("div");P.innerHTML=`
<a 
 id="repeatmsg"
 class="q-context-menu-item q-context-menu-item--normal" 
 aria-disabled="false" 
 role="menuitem" 
 tabindex="-1">
  <div class="q-context-menu-item__icon q-context-menu-item__head">
    <i class="q-icon" data-v-717ec976="" style="--b4589f60: inherit; --6ef2e80d: 16px;">
    <svg t="1691421273840" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1478" xmlns:xlink="http://www.w3.org/1999/xlink" height="1em" fill="currentColor"><path d="M511.6 961.4c12.1 0 22.6-4.4 31.5-13.3s13.3-19.4 13.3-31.5V558.3h358.3c12.1 0 22.6-4.4 31.5-13.3s13.3-19.4 13.3-31.5c0-12.1-4.4-22.6-13.3-31.5s-19.4-13.3-31.5-13.3H556.4V110.3c0-12.1-4.4-22.6-13.3-31.5s-19.4-13.3-31.5-13.3c-12.1 0-22.6 4.4-31.5 13.3s-13.3 19.4-13.3 31.5v358.3H108.5c-12.1 0-22.6 4.4-31.5 13.3s-13.3 19.4-13.3 31.5c0 12.1 4.4 22.6 13.3 31.5s19.4 13.3 31.5 13.3h358.3v358.3c0 12.1 4.4 22.6 13.3 31.5s19.4 13.4 31.5 13.4z" p-id="1479"></path></svg>
    </i>
  </div>
  <!---->
  <span class="q-context-menu-item__text">+1</span>
  <!---->
</a>
`;var A=document.createElement("div");A.innerHTML=`
<a 
 id="qrcode"
 class="q-context-menu-item q-context-menu-item--normal" 
 aria-disabled="false" 
 role="menuitem" 
 tabindex="-1">
  <div class="q-context-menu-item__icon q-context-menu-item__head">
    <i class="q-icon" data-v-717ec976="" style="--b4589f60: inherit; --6ef2e80d: 16px;">
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="currentColor"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80zM64 96v64h64V96H64zM0 336c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336zm64 16v64h64V352H64zM304 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48zm80 64H320v64h64V96zM256 304c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16v96c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16v64c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V304zM368 480a16 16 0 1 1 0-32 16 16 0 1 1 0 32zm64 0a16 16 0 1 1 0-32 16 16 0 1 1 0 32z"/></svg>
    </i>
  </div>
  <!---->
  <span class="q-context-menu-item__text">\u8BC6\u522B\u4E8C\u7EF4\u7801</span>
  <!---->
</a>
`;var C=document.createElement("div");C.innerHTML=`
<a 
 id="chatgpt"
 class="q-context-menu-item q-context-menu-item--normal" 
 aria-disabled="false" 
 role="menuitem" 
 tabindex="-1">
  <div class="q-context-menu-item__icon q-context-menu-item__head">
    <i class="q-icon" data-v-717ec976="" style="--b4589f60: inherit; --6ef2e80d: 16px;">
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="currentColor"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"/></svg>
    </i>
  </div>
  <!---->
  <span class="q-context-menu-item__text">CHATGPT</span>
  <!---->
</a>
`;var G=`
<span class="time tgico">
  <span class="i18n" dir="auto">{time}</span>
  <div class="inner tgico" title="{detail_time}">
    <span class="i18n" dir="auto">{time}</span>
  </div>
</span>
`,w=`
<div class="WebPage">
  <div class="WebPage--content">
    <div class="media-inner interactive">
      <img class="media-photo" src="{img}">
    </div>
    <div class="WebPage-text">
      <div class="site-title">
        <strong dir="auto">{title}</strong>
      </div>
      <div class="site-description" dir="auto">{description}</div>
    </div>
  </div>
</div>
`;var i=await qqpromote.getSettings();async function L(e){qqpromote.setSettings(JSON.stringify(e))}qqpromote.updateSettings((e,t)=>{i.setting=JSON.parse(t).setting});var ae=qqpromote.onAddSendMsg,D=!1,h=0,F=0,q="",_=[],ce=new Map,M,T=0;function O(){if(!M&&i.setting.message_merging&&(M=new MutationObserver(x),M.observe(document.querySelector(".chat-msg-area .v-scrollbar-thumb"),{attributes:!0,attributeFilter:["style"],subtree:!1})),document.querySelectorAll(".bar-icon .q-tooltips").forEach(e=>{let t=e?.__VUE__?.[0]?.props?.content;t&&!(t in i.setting.messagebar_list)&&(i.setting.messagebar_list[t]=!1,L(i)),i.setting.messagebar_list[t]&&e.parentNode.remove()}),i.setting.ckeditor_history){let e=document.querySelector(".chat-input-area"),t=e.querySelector(".ck.ck-content.ck-editor__editable"),s=e.querySelector(".send-msg"),n=t?.ckeditorInstance;if(h=_.length,!D&&n&&s){async function a(l){let c=LLAPI.get_editor();(l.key==="Enter"||l.type==="click")&&c&&(q="",_.push(c),h=_.length,F=_.length-1)}async function m(l){let c=LLAPI.get_editor();l.key==="ArrowUp"?(h>0&&h--,LLAPI.set_editor(_[h])):l.key==="ArrowDown"?h<_.length-1?(h++,LLAPI.set_editor(_[h])):(h<_.length&&h++,LLAPI.set_editor(q)):q=c}t.addEventListener("keydown",a),t.addEventListener("keyup",m),s.addEventListener("click",a),D=!0}}}function x(){document.querySelectorAll(".ml-item").forEach(e=>{try{let t=e.querySelector(".avatar-span");t&&(T+=e.firstElementChild.offsetHeight,e.firstElementChild.classList.contains("main")&&(t.style.height=`${T}px`,T=0))}catch(t){console.log(t)}})}var ve=Q(x,10);ae((e,t)=>{ce.set(F,t)});var k;function H(e,t,s){t&&(s.addEventListener("animationstart",function(n){let a=setInterval(x,10);setTimeout(()=>{clearInterval(a)},500)}),t.onload=function(){let n=e.querySelector(".message-content__wrapper").offsetWidth;s.style.setProperty("--message-width",`${n>=300?n-10:300}px`),s.style.setProperty("--photo-height",`${this.height}px`),(this.width<n/3||Math.abs(this.width-this.height)<20)&&s.classList.add("with-small-photo")},t.onerror=function(){t.style.display="none"})}async function j(e){let t=e?.firstElementChild?.__VUE__?.[0]?.props;if(!t?.msgRecord||!t.msgRecord?.msgId)return;let s=t.msgRecord.msgId,n=t.msgRecord.elements[0],a=t.msgRecord.senderUid,m=e.querySelector(".text-link"),l=e.querySelector(".WebPage");if(m&&i.setting.link_preview)if(l){let r=e.querySelector(".message-content__wrapper").offsetWidth;l.style.setProperty("--message-width",`${r>=300?r-10:300}px`)}else{let r=m.innerText,d=await B(r);if(d){let p=e.querySelector(".msg-content-container"),g=p.firstElementChild;g.style.overflow="visible";let f=document.createElement("div");f.innerHTML=w.format({img:d.image?.replace("i0.hdslb.com","i1.hdslb.com"),title:d.title,description:d.description});let u=f.lastElementChild,y=u.querySelector(".media-photo"),S=p.classList.contains("container--self")?getComputedStyle(document.body).getPropertyValue("--bubble_host"):getComputedStyle(document.body).getPropertyValue("--bubble_guest"),v=b(S);v=v[0]===0?[103,66,78]:v,u.style.setProperty("--WebPage_background-color",`hsl(${v[0]}deg ${v[1]}% ${v[2]+10}% / 25%)`),H(e,y,u),g.appendChild(u)}}let c=e.querySelector(".text-normal");if(c){let r=function(d){let p=d.target.textContent;k=setInterval(async()=>{let g=await qqpromote.translate(p,i.setting),f=document.createElement("div");f.innerText=g?.TargetText,d.target.closest(".message-content__wrapper.mix-message__inner").appendChild(f),clearInterval(k),c.removeEventListener("mouseover",r)},1e3)};i.setting.translate?c.addEventListener("mouseover",r):c.removeEventListener("mouseover",r),c.addEventListener("mouseout",d=>{k&&clearInterval(k)})}let o=e.querySelector(".ptt-element__bottom-area");if(o&&i.setting.auto_ptt2Text&&!o.closest(".message-container--self")){let r=await LLAPI.getPeer();await LLAPI.Ptt2Text(s,r,n),o.style.display="block"}if(i.setting.reply_at&&i.setting.reply_at_click&&e.querySelector(".message-container")?.addEventListener("click",async()=>{let d=setInterval(async()=>{(await LLAPI.get_editor()).includes("</msg-at>")&&(clearInterval(d),LLAPI.del_editor("msg-at",!0))});setTimeout(()=>clearInterval(d),50)}),i.setting.friendsinfo&&e.querySelector(".msg-content-container")){let d=(await LLAPI.getFriendsList()).find(f=>f.uid===a),p=`<${d.raw.remark?d.raw.remark:d.nickName}>(${d.uin})`,g=e.querySelector(".user-name .text-ellipsis");g.textContent=g.textContent+p}}async function K(e){i.setting.video_background[e.hash]?.value&&!document.querySelector(".qqpromote_video")&&(document.body.insertAdjacentHTML("afterbegin",`
            <video class="qqpromote_video" autoplay muted loop>
                <source src="https://t.mwm.moe/acg/acg" type="video/mp4">
            </video>
            
        `),document.querySelector("#app").style=`
            --bg_list: none!important;
            --bg_bottom_light: rgba(255,255,255,0.35)!important;
            --bg_top_light: rgba(255,255,255,0.35)!important;
            --bg_bottom_standard: rgba(255,255,255,0.35)!important;
            --fill_light_primary: rgba(255,255,255,0.35)!important;
            --nt_bg_white_2_overlay_hover_2_mix: rgba(255,255,255,0.35)!important; /* \u804A\u5929\u6846\u6587\u4EF6\u7C7B */
            --blur_middle_standard: none!important; /* \u53F3\u4E0B\u8BBE\u7F6E\u9009\u62E9\u6846 */
        `)}function V(e){switch(e.hash){case"#/main/message":document.querySelectorAll(".sidebar__menu .func-menu__item").forEach(s=>{let n=s.firstElementChild.getAttribute("aria-label");n&&!(n in i.setting.sidebar_list)&&(i.setting.sidebar_list[n]=!1,L(i)),i.setting.sidebar_list[n]&&s.remove()}),document.querySelectorAll(".window-control-area div").forEach(s=>{let n=s.lastElementChild?.__VUE__?.[0]?.type?.name;switch(n){case"QIconSwitchPanel16":i.setting.upbar_list.\u6298\u53E0\u680F&&s.remove(),"\u6298\u53E0\u680F"in i.setting.upbar_list||(i.setting.upbar_list.\u6298\u53E0\u680F=!1,L(i));break;default:W("\u672A\u77E5\u680F",n);break}});break;case"#/image-viewer":if(!i.setting.image_other_close)break;let t=setInterval(()=>{let s=document.querySelector(".main-area__image-rotate-wrap");if(!s)return;clearInterval(t);let n=document.createElement("div");n.classList.add("close-image"),n.addEventListener("click",a=>{document.querySelector(".close").click()}),s.appendChild(n)},1e3);break}K(e)}function Z(e){let t=e.getAttribute("aria-label");t&&!t.endsWith("\u672A\u8BFB")&&!(t in i.setting.sidebar_list)&&(i.setting.sidebar_list[t]=!1,L(i)),i.setting.sidebar_list[t]&&e.remove()}var I=!1;function J(){if(I){let e=setInterval(async()=>{let t=await LLAPI.getAccountInfo();t.uin&&(clearInterval(e),LLAPI.resetLoginInfo(t.uin))},100)}}function X(){if(location.pathname==="/renderer/login.html"){let e=document.querySelector(".draggable-view__container.login-container"),t=document.createElement("label");t.title="\u5FD8\u8BB0\u5BC6\u7801",t.classList.add("q-checkbox"),t.innerHTML=`
        <input type="checkbox">
        <span class="q-checkbox__input">
        </span>
        `,t.style=`
            app-region: no-drag;
            padding-top: 6px;
            position: absolute;
            left: 8px;
            z-index: 99;
        `,document.addEventListener("keydown",s=>{s.key==="Enter"&&J()}),document.querySelector(".login-btn")?.addEventListener("click",J),t.querySelector(".q-checkbox__input").addEventListener("click",async s=>{let n=s.target.parentElement;I=!I,n.classList.toggle("is-checked",I)}),e.insertBefore(t,e.firstChild)}LLAPI.on("user-login",async e=>{i.setting.resetLogin&&LLAPI.resetLoginInfo(e.uin)})}var le=qqpromote.chatgpt;async function Y(e,t){let{classList:s}=t,n=t?.closest(".msg-content-container")?.closest(".message")?.__VUE__?.[0]?.props,a=n?.uid,m=n?.msgRecord.msgId,l=n?.msgRecord.senderUid,c=t?.innerText;if(i.setting.repeat_msg){let o=P.cloneNode(!0);o.addEventListener("click",async()=>{let r=await LLAPI.getPeer();if(s[0]=="ptt-element__progress"){let p=(await LLAPI.getPreviousMessages(r,1,m.toString()))[0].elements;await LLAPI.sendMessage(r,p)}else await LLAPI.forwardMessage(r,r,[m]);e.remove()}),i.setting.rpmsg_location?e.insertBefore(o,e.firstChild):e.appendChild(o)}if(i.setting.chatgpt){let o=C.cloneNode(!0);o.addEventListener("click",async()=>{let r=await le(c,i.setting);i.setting.chatgpt_add_reply?(await LLAPI.set_editor(r),e.childNodes.forEach(d=>{d.textContent==="\u56DE\u590D"&&d.click()})):(await LLAPI.set_editor(r),e.remove())}),i.setting.chatgpt_location?e.insertBefore(o,e.firstChild):e.appendChild(o)}if(i.setting.qrcode){let o=A.cloneNode(!0);o.addEventListener("click",async()=>{e.remove();let r=await z(t);qqpromote.showQrContent(r)}),s?.[0]==="image-content"&&e.insertBefore(o,e.firstChild)}e.childNodes.forEach(o=>{o.textContent==="\u56DE\u590D"&&l!=a&&i.setting.reply_at&&o.addEventListener("click",async()=>{let r=setInterval(async()=>{(await LLAPI.get_editor()).includes("</msg-at>")&&(clearInterval(r),LLAPI.del_editor("msg-at",!0))});setTimeout(()=>clearInterval(r),50)})})}var E=[];function me(e){E.push(e),setTimeout(()=>{E.splice(E.indexOf(e),1)},100)}function de(e){e.vnode.props?.["msg-record"]&&(e.vnode=new Proxy(e.vnode,{get(t,s){try{if(s==="el"){let n=t[s],a=t.props["msg-record"];if(n&&n.classList.contains("message")&&!E.includes(a.msgId)){me(a.msgId);let m=n.querySelector(".msg-content-container");if(!m)return t[s];let l=m.firstElementChild;if(i.setting.show_time&&!n.querySelector(".time.tgico")){let o=a.msgTime,r=new Date(o*1e3),d=r.getHours(),p=r.getMinutes(),g=`${d}:${String(p).padStart(2,"0")}`;if(i.setting.show_time_up){let f=n.querySelector(".user-name"),u=document.createElement("div");u.classList.add("user_name_time"),u.innerText=r.toLocaleString(),u.style.color=i.setting.time_color,f?.appendChild(u)}else{let f=document.createElement("div");f.innerHTML=G.format({time:g,detail_time:r.toLocaleString()});let u=f.lastElementChild,y=u.querySelector(".time");R(l.children)?u.classList.add("time_img"):(l.children[0].classList.contains("ark-view-message")||l.children[0].classList.contains("ark-loading"))&&(y.style.bottom="15px",y.style.right="3px");let S=u.querySelector(".time .i18n");S.style.color=i.setting.time_color,u.addEventListener("click",async v=>{if(i.setting.repeat_msg_time){let U=await LLAPI.getPeer();await LLAPI.forwardMessage(U,U,[a.msgId])}}),l.appendChild(u)}}i.setting.message_merging&&(a?.qqpromote?.chatType=="child"?(n.classList.remove("main"),n.classList.add("child")):a?.qqpromote?.chatType=="main"&&(n.classList.remove("child"),n.classList.add("main")));let c=a?.qqpromote?.linkPreview;if(c){l.style.overflow="visible";let o=document.createElement("div");o.innerHTML=w.format({img:c.image?.replace("i0.hdslb.com","i1.hdslb.com"),title:c.title,description:c.description});let r=o.lastElementChild,d=r.querySelector(".media-photo"),p=m.classList.contains("container--self")?getComputedStyle(document.body).getPropertyValue("--bubble_host"):getComputedStyle(document.body).getPropertyValue("--bubble_guest"),g=[0,0,0];if(p.includes("rgb")){let f=p.slice(4,-1).split(", ");g=N(...f)}else g=b(p);g=g[0]===0?[103,66,78]:g,r.style.setProperty("--WebPage_background-color",`hsl(${g[0]}deg ${g[1]}% ${g[2]+10}% / 25%)`),H(n,d,r),l.appendChild(r)}if(i.setting.message_user_name_built_in){let o=n.querySelector(".user-name");l.insertBefore(o,l.firstChild)}}}}catch(n){console.error(n)}return t[s]}}))}function ee(){window.Proxy=new Proxy(window.Proxy,{construct(e,[t,s]){let n=t?._;return n?.uid>=0&&(n.vnode.el??de(n)),new e(t,s)}})}async function te(e,t){e.childNodes.forEach(s=>{s.textContent.replaceAll(" ","")==="\u56DE\u590D"&&i.setting.reply_at&&s.addEventListener("click",()=>{let n=setInterval(()=>{LLAPI.get_editor().includes("</msg-at>")&&(clearInterval(n),LLAPI.del_editor("msg-at",!0))});setTimeout(()=>clearInterval(n),50)})})}var $=3;async function ne(){i,i.setting.message_merging?document.body.classList.add("message_merging"):document.body.classList.remove("message_merging"),i.setting.show_time?document.body.classList.add("show_time"):document.body.classList.remove("show_time");let e=LiteLoader.plugins.qqpromote.path.plugin,t=`local:///${e}/src/config/message.css`,s=document.createElement("link");s.rel="stylesheet",s.href=t,document.head.appendChild(s);let n=`local:///${e}/src/config/WebPage.css`,a=document.createElement("link");a.rel="stylesheet",a.href=n,document.head.appendChild(a);let m=`local:///${e}/src/config/global.css`,l=document.createElement("link");l.rel="stylesheet",l.href=m,document.head.appendChild(l),qqpromote.updateStyle(()=>{s.href=`${t}?r=${new Date().getTime()}`}),qqpromote.updateWebPageStyle(()=>{a.href=`${n}?r=${new Date().getTime()}`});let c=setInterval(()=>{if(location.pathname==="/renderer/login.html"&&i.setting.auto_login){let o=document.querySelector(".auto-login .q-button span");if(!o){console.log(o),clearInterval(c);return}$>=0?(o.innerText=`${$} \u79D2\u540E\u81EA\u52A8\u767B\u5F55`,$--):o.click();return}location.hash!=="#/main/message"&&location.href.indexOf("#/chat/")==-1||(LiteLoader?.plugins?.LLAPI?.manifest?.version>="1.3.1"||setTimeout(()=>{qqpromote.showMessageBox({message:"LLAPI\u7248\u672C\u8FC7\u4F4E, \u8BF7\u5728\u63D2\u4EF6\u5E02\u573A\u5B89\u88C5\u6700\u65B0\u7248",detail:"\u8BE5\u63D0\u793A\u5E76\u975EQQ\u5B98\u65B9\u63D0\u793A, \u8BF7\u4E0D\u8981\u53D1\u7ED9\u5B98\u65B9\u7FA4",type:"warning",buttons:["\u524D\u5F80\u63D2\u4EF6\u5E02\u573A","\u786E\u5B9A"]}).then(o=>{if(o.response===0)try{StoreAPI.openStore("LLAPI")}catch{qqpromote.showMessageBox({message:"\u672A\u5B89\u88C5\u63D2\u4EF6\u5E02\u573A",detail:"\u8BE5\u63D0\u793A\u5E76\u975EQQ\u5B98\u65B9\u63D0\u793A, \u8BF7\u4E0D\u8981\u53D1\u7ED9\u5B98\u65B9\u7FA4",type:"warning",buttons:["\u786E\u5B9A"]})}})},1e3),clearInterval(c))},1e3);X(),LLAPI.add_qmenu(Y),LLAPI.add_qGuildMenu(te),LLAPI.on("dom-up-messages",j),V(location),LLAPI.on("change_href",V),LLAPI.on("dom-up-nav-item",Z),LLAPI.on("set_message",O)}async function et(){let e=await qqpromote.getSettings(),t=LiteLoader.plugins.qqpromote.path.plugin,s=`local:///${t}/src/config/view.css`,n=`local:///${t}/src/config/display.css`;if(e.setting.display_style){let c=document.createElement("link");c.rel="stylesheet",c.href=n,document.head.appendChild(c)}let a=document.createElement("link");a.rel="stylesheet",a.href=s,document.head.appendChild(a);let m=document.querySelector(`.nav-bar.liteloader .nav-item[data-slug='${LiteLoader.plugins.qqpromote.manifest.slug}']`);m.querySelector(".q-icon.icon").insertAdjacentHTML("afterbegin",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v1.5A1.75 1.75 0 0 1 14.25 6H1.75A1.75 1.75 0 0 1 0 4.25ZM1.75 7a.75.75 0 0 1 .75.75v5.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-5.5a.75.75 0 0 1 1.5 0v5.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25v-5.5A.75.75 0 0 1 1.75 7Zm0-4.5a.25.25 0 0 0-.25.25v1.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25ZM6.25 8h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1 0-1.5Z"></path></svg>'),m.addEventListener("click",async()=>{let c=document.createElement("link");c.rel="stylesheet",c.href=`local:///${t}/src/assets/css/main.css`,document.head.appendChild(c);let o=document.createElement("script");o.type="module",o.src=`local:///${t}/src/assets/js/main.js`,document.head.appendChild(o)})}ee();location.hash==="#/blank"?navigation.addEventListener("navigatesuccess",ne,{once:!0}):ne();export{et as onSettingWindowCreated};
