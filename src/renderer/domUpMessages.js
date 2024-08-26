import { check_only_img, get_link_data, hexToHSL, output } from "./utils.js";
import { message_time, message_web } from "./myElement.js";
import { config } from "./config.js";
import { MsgMutation } from "./setMessage.js";

let translate_hover;

/**
 * @param {HTMLElement} node
 * @param {HTMLElement} img_ele
 * @param {HTMLElement} web_ele
 */
function domUpWebPage(node, img_ele, web_ele) {
  if (!img_ele) return;

  const message_width = node.querySelector(".message-content").offsetWidth;
  web_ele.addEventListener("animationstart", function (event) {
    const MsgMutationInterval = setInterval(MsgMutation, 10);
    setTimeout(() => {
      clearInterval(MsgMutationInterval);
    }, 500);
  });
  img_ele.onload = function () {
    web_ele.style.setProperty(
      "--message-width",
      `${message_width >= 300 ? message_width - 10 : 300}px`
    );
    web_ele.style.setProperty("--photo-height", `${this.height}px`);
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

async function domUpMessages(node) {
  const msgprops = node?.firstElementChild?.__VUE__?.[0]?.props;
  if (!msgprops?.msgRecord || !msgprops.msgRecord?.msgId) return;
  const msgId = msgprops.msgRecord.msgId;
  const elements = msgprops.msgRecord.elements[0];
  const senderUid = msgprops.msgRecord.senderUid;
  const peer = await LLAPI.getPeer();
  const friendslist = await LLAPI.getFriendsList();
  // 链接识别，并生成预览
  const msgLink = node.querySelector(".text-link");
  const WebPage = node.querySelector(".WebPage");
  if (msgLink && config.setting.link_preview) {
    if (!WebPage) {
      const url = msgLink.innerText;
      const url_data = await get_link_data(url); // 消息数据
      if (url_data) {
        const msgContainer = node.querySelector(".msg-content-container");
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
          ? getComputedStyle(document.body).getPropertyValue("--bubble_host")
          : getComputedStyle(document.body).getPropertyValue("--bubble_guest");
        let hsl = hexToHSL(backgroundColor);
        hsl = hsl[0] === 0 ? [103, 66, 78] : hsl;
        web_ele.style.setProperty(
          "--WebPage_background-color",
          `hsl(${hsl[0]}deg ${hsl[1]}% ${hsl[2] + 10}% / 25%)`
        );
        domUpWebPage(node, img_ele, web_ele);
        msgContent.appendChild(web_ele);
      }
    } else {
      const message_width = node.querySelector(".message-content").offsetWidth;
      WebPage.style.setProperty(
        "--message-width",
        `${message_width >= 300 ? message_width - 10 : 300}px`
      );
    }
  }
  // 翻译
  const msg_text = node.querySelector(".text-normal");
  if (msg_text) {
    function translate(event) {
      const text = event.target.textContent;
      translate_hover = setInterval(async () => {
        const translate_data = await qqpromote.translate(text, config.setting);
        const timeEl = document.createElement("div");
        timeEl.innerText = translate_data?.TargetText;
        event.target
          .closest(".message-content.mix-message__inner")
          .appendChild(timeEl);
        clearInterval(translate_hover);
        msg_text.removeEventListener("mouseover", translate);
      }, 1000);
    }
    if (config.setting.translate) {
      msg_text.addEventListener("mouseover", translate);
    } else {
      msg_text.removeEventListener("mouseover", translate);
    }

    msg_text.addEventListener("mouseout", (event) => {
      if (translate_hover) {
        clearInterval(translate_hover);
      }
    });
    //msg_text.textContent+=" ".repeat(5)
  }
  // 自动语音转文字
  const ptt_area = node.querySelector(".ptt-element__bottom-area");
  if (ptt_area && config.setting.auto_ptt2Text) {
    if (!ptt_area.closest(".message-container--self")) {
      await LLAPI.Ptt2Text(msgId, peer, elements);
      ptt_area.style.display = "block";
    }
  }
  // 回复点击监听 点击空白
  if (config.setting.reply_at && config.setting.reply_at_click) {
    const message_container = node.querySelector(".message-container");
    message_container?.addEventListener("click", async () => {
      const interval = setInterval(async () => {
        let editor = await LLAPI.get_editor();
        if (editor.includes("</msg-at>")) {
          clearInterval(interval);
          LLAPI.del_editor("msg-at", true);
        }
      });
      setTimeout(() => clearInterval(interval), 50);
    });
  }
  // 名称扩展
  if (
    config.setting.friendsinfo &&
    node.querySelector(".msg-content-container")
  ) {
    const friendItem = friendslist.find((item) => item.uid === senderUid);
    const friend_info = `<${
      friendItem.raw.remark ? friendItem.raw.remark : friendItem.nickName
    }>(${friendItem.uin})`;
    const user_name = node.querySelector(".user-name .text-ellipsis");
    user_name.textContent = user_name.textContent + friend_info;
  }
}

export { domUpMessages, domUpWebPage };
