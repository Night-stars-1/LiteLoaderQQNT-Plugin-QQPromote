/*
 *Author: Night-stars-1 nujj1042633805@gmail.com
 *Date: 2024-08-23 16:03:37
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-08-26 15:35:20
 */
import { message_web } from "./myElement.js";
import { hexToHSL } from "./utils.js";
import { config } from "./config.js";

const debounceId = [];

function setDebounceId(msgId) {
  debounceId.push(msgId);
  setTimeout(() => {
    debounceId.splice(debounceId.indexOf(msgId), 1);
  }, 100);
}

function watchComponentMount(component) {
  if (component.vnode.props?.["msg-record"]) {
    component.vnode = new Proxy(component.vnode, {
      get(target, prop) {
        try {
          if (prop === "el") {
            /**
             * @type {HTMLElement}
             */
            const node = target[prop];
            const msgRecord = target.props["msg-record"];
            if (
              node &&
              node.classList.contains("message") &&
              !debounceId.includes(msgRecord.msgId)
            ) {
              setDebounceId(msgRecord.msgId);
              if (config.setting.message_merging) {
                  if (msgRecord?.qqpromote?.chatType == "child") {
                      node.classList.remove('main')
                      node.classList.add('child')
                  } else if (msgRecord?.qqpromote?.chatType == "main") {
                      node.classList.remove('child')
                      node.classList.add('main')
                  }
              }
              const url_data = msgRecord?.qqpromote?.linkPreview;
              if (url_data) {
                const msgContainer = node.querySelector(
                  ".msg-content-container"
                );
                const msgContent = msgContainer.firstElementChild;
                msgContent.style.overflow = "visible";
                const web_ele1 = document.createElement("div");
                web_ele1.innerHTML = message_web.format({
                  img: url_data.image?.replace("i0.hdslb.com", "i1.hdslb.com"),
                  title: url_data.title,
                  description: url_data.description,
                });
                const web_ele = web_ele1.lastElementChild;
                const img_ele = web_ele.querySelector(".media-photo");
                const backgroundColor = msgContainer.classList.contains(
                  "container--self"
                )
                  ? getComputedStyle(document.body).getPropertyValue(
                      "--bubble_host"
                    )
                  : getComputedStyle(document.body).getPropertyValue(
                      "--bubble_guest"
                    );
                let hsl = hexToHSL(backgroundColor);
                hsl = hsl[0] === 0 ? [103, 66, 78] : hsl;
                web_ele.style.setProperty(
                  "--WebPage_background-color",
                  `hsl(${hsl[0]}deg ${hsl[1]}% ${hsl[2] + 10}% / 25%)`
                );
                if (img_ele) {
                  img_ele.onload = function () {
                    const message_width =
                      node.querySelector(".text-element").offsetWidth;
                    web_ele.style.setProperty(
                      "--message-width",
                      `${message_width >= 300 ? message_width - 10 : 300}px`
                    );
                    web_ele.style.setProperty(
                      "--photo-height",
                      `${this.height}px`
                    );
                    if (
                      this.width < message_width / 3 ||
                      Math.abs(this.width - this.height) < 20
                    ) {
                      web_ele.classList.add("with-small-photo");
                    }
                  };
                  img_ele.onerror = function () {
                    img_ele.style.display = "none";
                  };
                }
                msgContent.appendChild(web_ele);
              }
              const revokeElement =
                msgRecord.elements?.[0].grayTipElement?.revokeElement;
              if (revokeElement && revokeElement?.wording !== "") {
                node.innerHTML = node.innerHTML.replace(
                  "一条消息",
                  `一条消息, ${revokeElement.wording}`
                );
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
        return target[prop];
      },
    });
  }
}

export function hookVue3() {
  window.Proxy = new Proxy(window.Proxy, {
    construct(target, [proxyTarget, proxyHandler]) {
      const component = proxyTarget?._;
      if (component?.uid >= 0) {
        const element = component.vnode.el;
        element ?? watchComponentMount(component);
      }
      return new target(proxyTarget, proxyHandler);
    },
  });
}
