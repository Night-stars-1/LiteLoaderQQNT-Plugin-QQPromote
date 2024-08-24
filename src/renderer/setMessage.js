import { config, setSettings } from "./config.js";
import { debounce } from "./utils.js";

const onAddSendMsg = qqpromote.onAddSendMsg;

let injectCkeditor = false;
let ckeditorHistoryIndex = 0;
let targetCkeditorIndex = 0;
let targetCkeditorText = ""
const ckeditorHistory = [];
const ckedditorIndex2msgId = new Map();

let observe;
const childMsgHeight = new Map();

function setMessage() {
  document.querySelectorAll(".bar-icon .q-tooltips").forEach((node) => {
    const content = node?.__VUE__?.[0]?.props?.content;
    if (content && !(content in config.setting.messagebar_list)) {
      config.setting.messagebar_list[content] = false;
      setSettings(config);
    }
    if (config.setting.messagebar_list[content]) {
      node.parentNode.remove();
    }
  });
  if (config.setting.ckeditor_history) {
    const chatInputAreaDom = document.querySelector(".chat-input-area");
    const ckeditorDom = chatInputAreaDom.querySelector(
      ".ck.ck-content.ck-editor__editable"
    );
    const sendMsgDom = chatInputAreaDom.querySelector(".send-msg");
    const ckeditorInstance = ckeditorDom?.ckeditorInstance;
    ckeditorHistoryIndex = ckeditorHistory.length;
    /** 当前输入的文本 */
    if (!injectCkeditor && ckeditorInstance && sendMsgDom) {
      async function setCkeditorHistory(event) {
        const ckeditorText = LLAPI.get_editor();
        if ((event.key === "Enter" || event.type === "click") && ckeditorText) {
          targetCkeditorText = "" // 清理保存的文本
          ckeditorHistory.push(ckeditorText);
          ckeditorHistoryIndex = ckeditorHistory.length;
          targetCkeditorIndex = ckeditorHistory.length - 1;
        }
      }
      async function setCkeditorText(event) {
        const ckeditorText = LLAPI.get_editor();
        if (event.key === "ArrowUp") {
          if (ckeditorHistoryIndex > 0) {
            ckeditorHistoryIndex--;
          }
          LLAPI.set_editor(ckeditorHistory[ckeditorHistoryIndex]);
        } else if (event.key === "ArrowDown") {
          if (ckeditorHistoryIndex < ckeditorHistory.length - 1) {
            ckeditorHistoryIndex++
            LLAPI.set_editor(ckeditorHistory[ckeditorHistoryIndex]);
          } else if (ckeditorHistoryIndex < ckeditorHistory.length) {
            ckeditorHistoryIndex++
            LLAPI.set_editor(targetCkeditorText);
          } else {
            LLAPI.set_editor(targetCkeditorText);
          }
        } else {
            targetCkeditorText = ckeditorText
        }
      }
      ckeditorDom.addEventListener("keydown", setCkeditorHistory);
      ckeditorDom.addEventListener("keyup", setCkeditorText);
      sendMsgDom.addEventListener("click", setCkeditorHistory);
      injectCkeditor = true;
    }
  }
  if (!observe && config.setting.message_merging) {
    observe = new MutationObserver(MsgMutation);
    observe.observe(document.querySelector(".ml-list.list"), {
        attributes: true,
        attributeFilter: ["style"],
        childList: true,
        subtree: true,
    });
    // observe = new MutationObserver(MsgMutation);
    // observe.observe(
    //   document.querySelector(".chat-msg-area .v-scrollbar-thumb"),
    //   {
    //     attributes: true,
    //     attributeFilter: ["style"],
    //     subtree: false,
    //   }
    // );
  }
}

function _MsgMutation() {
  // 遍历每个变化
  document.querySelectorAll(".ml-item").forEach((element) => {
    const targetProps = element.firstElementChild.__VUE__[0].props;
    if (targetProps.msgRecord.elements[0].grayTipElement === null) {
      const targetChatType = targetProps.msgRecord.qqpromote?.chatType;
      const targetSenderUid = targetProps.msgRecord.senderUid;
      if (targetChatType == "child") {
        childMsgHeight.set(
          targetSenderUid,
          (childMsgHeight.get(targetSenderUid) ?? 0) + element.offsetHeight
        );
      } else if (targetChatType == "main") {
        const avatarSpan = element.querySelector(".avatar-span");
        avatarSpan.style.height = `${
          (childMsgHeight.get(targetSenderUid) ?? 0) +
          element.querySelector(".message-container").offsetHeight
        }px`;
        childMsgHeight.delete(targetSenderUid);
      }
    }
  });
}

function MsgMutation() {
  document.querySelectorAll(".ml-item").forEach((element) => {
    const targetProps = element.firstElementChild.__VUE__[0].props;
    if (targetProps.msgRecord.elements[0].grayTipElement === null) {
      const targetChatType = targetProps.msgRecord.qqpromote?.chatType;
      const targetSenderUid = targetProps.msgRecord.senderUid;
      if (targetChatType == "child") {
        childMsgHeight.set(
          targetSenderUid,
          (childMsgHeight.get(targetSenderUid) ?? 0) + element.offsetHeight
        );
      } else if (targetChatType == "main") {
        const avatarSpan = element.querySelector(".avatar-span");
        avatarSpan.style.height = `${
          (childMsgHeight.get(targetSenderUid) ?? 0) +
          element.querySelector(".message-container").offsetHeight
        }px`;
        childMsgHeight.delete(targetSenderUid);
      }
    }
  });
}

onAddSendMsg((_, msgId) => {
  ckedditorIndex2msgId.set(targetCkeditorIndex, msgId);
});

export { setMessage };
