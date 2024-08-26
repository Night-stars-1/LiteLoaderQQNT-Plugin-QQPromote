/*
 *Author: Night-stars-1 nujj1042633805@gmail.com
 *Date: 2024-08-23 16:03:37
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-08-26 17:06:39
 */
import { message_web, message_time } from "./myElement.js";
import { check_only_img, hexToHSL, rgbToHsl } from "./utils.js";
import { config } from "./config.js";
import { domUpWebPage } from "./domUpMessages.js";

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
              // 消息时间
              if (
                config.setting.show_time &&
                node.querySelector(".msg-content-container")
              ) {
                const msgTime = msgRecord.msgTime;
                const date = new Date(msgTime * 1000);
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const timestamp = `${hours}:${String(minutes).padStart(
                  2,
                  "0"
                )}`;
                const msg_content = node.querySelector(
                  ".msg-content-container"
                ).firstElementChild;
                if (config.setting.show_time_up) {
                  const user_name = node.querySelector(".user-name");
                  const user_name_time = document.createElement("div");
                  user_name_time.classList.add("user_name_time");
                  user_name_time.innerText = date.toLocaleString();
                  user_name_time.style.color = config.setting.time_color;
                  user_name?.appendChild(user_name_time);
                } else {
                  //msg_content.style.overflow = "visible";
                  const msg_time_ele1 = document.createElement("div");
                  msg_time_ele1.innerHTML = message_time.format({
                    time: timestamp,
                    detail_time: date.toLocaleString(),
                  });
                  const msg_time_ele = msg_time_ele1.lastElementChild;
                  const msg_content_ele =
                    msg_time_ele.querySelector(".time");
                  if (!check_only_img(msg_content.children)) {
                    //msg_content.insertAdjacentHTML("beforeend", message_time.format({ time: timestamp, detail_time: date.toLocaleString() }));
                    if (
                      msg_content.children[0].classList.contains(
                        "ark-view-message"
                      ) ||
                      msg_content.children[0].classList.contains("ark-loading")
                    ) {
                      msg_content_ele.style.bottom = "15px";
                      msg_content_ele.style.right = "3px";
                    }
                  } else {
                    msg_time_ele.classList.add("time_img");
                  }
                  const time_inner_ele =
                    msg_time_ele.querySelector(".time .i18n");
                  time_inner_ele.style.color = config.setting.time_color;
                  msg_time_ele.addEventListener("click", async (event) => {
                    if (config.setting.repeat_msg_time) {
                      const peer = await LLAPI.getPeer();
                      await LLAPI.forwardMessage(peer, peer, [msgId]);
                    }
                  });
                  msg_content.appendChild(msg_time_ele);
                }
              }
              // 消息合并
              if (config.setting.message_merging) {
                if (msgRecord?.qqpromote?.chatType == "child") {
                  node.classList.remove("main");
                  node.classList.add("child");
                } else if (msgRecord?.qqpromote?.chatType == "main") {
                  node.classList.remove("child");
                  node.classList.add("main");
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
                let hsl = [0, 0, 0]
                if (backgroundColor.includes("rgb")) {
                  const rgbList = backgroundColor.slice(4, -1).split(", ")
                  hsl = rgbToHsl(...rgbList)
                } else {
                  hsl = hexToHSL(backgroundColor);
                }
                hsl = hsl[0] === 0 ? [103, 66, 78] : hsl;
                web_ele.style.setProperty(
                  "--WebPage_background-color",
                  `hsl(${hsl[0]}deg ${hsl[1]}% ${hsl[2] + 10}% / 25%)`
                );
                domUpWebPage(node, img_ele, web_ele);
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
