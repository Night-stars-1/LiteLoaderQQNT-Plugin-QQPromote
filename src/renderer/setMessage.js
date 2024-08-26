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
// const childMsgHeight = new Map();
let childMsgHeight = 0;

function setMessage() {
  if (!observe && config.setting.message_merging) {
    observe = new MutationObserver(MsgMutation);
    observe.observe(document.querySelector(".ml-list.list"), {
        childList: true,
        subtree: true,
    });
    // observe.observe(
    //   document.querySelector(".chat-msg-area .v-scrollbar-thumb"),
    //   {
    //     attributes: true,
    //     attributeFilter: ["style"],
    //     subtree: false,
    //   }
    // );
  }
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
}

function MsgMutation() {
  // 遍历每个变化
  document.querySelectorAll(".ml-item").forEach((element) => {
    const targetProps = element.firstElementChild.__VUE__[0].props;
    if (targetProps.msgRecord.elements[0].grayTipElement === null) {
      const targetChatType = targetProps.msgRecord.qqpromote?.chatType;
      // const targetSenderUid = targetProps.msgRecord.senderUid;
      if (targetChatType == "child") {
        childMsgHeight += element.offsetHeight;
        // childMsgHeight.set(
        //   targetSenderUid,
        //   (childMsgHeight.get(targetSenderUid) ?? 0) + element.offsetHeight
        // );
      } else if (targetChatType == "main") {
        const avatarSpan = element.querySelector(".avatar-span");
        avatarSpan.style.height = `${
          childMsgHeight +
          element.querySelector(".message-container").offsetHeight
        }px`;
        childMsgHeight = 0;
      }
    }
  });
}

/**
 * 防抖批量处理当前可见的消息列表
 */
const debounceMsgMutation = debounce(MsgMutation, 10);

/**
 * 消息刷新监听
 * @param {MutationRecord[]} mutationsList 
 */
function _MsgMutation(mutationsList) {
  document.querySelectorAll(".ml-item").forEach((element) => {
    const previousElement = element.previousElementSibling
    const nextElement = element.nextElementSibling;
    const targetProps = element.firstElementChild.__VUE__[0].props;
    const targetSenderUid = targetProps.msgRecord?.senderUid;
    if (targetProps.msgRecord.elements[0].grayTipElement !== null || !targetSenderUid) return
    if (!nextElement) {
      element.classList.add("main");
      element.classList.add("not-next");
      element.classList.remove("child");
      const avatarSpan = element.querySelector(".avatar-span");
      if (!avatarSpan) return
      avatarSpan.style.height = `${
        (childMsgHeight.get(targetSenderUid) ?? 0) +
        element.querySelector(".message-container").offsetHeight
      }px`;
      childMsgHeight.delete(targetSenderUid);
      return
    }
    const nextProps = nextElement.firstElementChild.__VUE__[0].props;
    if (targetSenderUid === nextProps.msgRecord.senderUid && nextProps.msgRecord.elements[0].grayTipElement === null) {
      nextElement.classList.remove("main");
      element.classList.add("child");
      childMsgHeight.set(
        targetSenderUid,
        (childMsgHeight.get(targetSenderUid) ?? 0) + element.offsetHeight
      );
    } else {
      element.classList.add("main");
      nextElement.classList.remove("child");
      const avatarSpan = element.querySelector(".avatar-span");
      avatarSpan.style.height = `${
        (childMsgHeight.get(targetSenderUid) ?? 0) +
        element.querySelector(".message-container").offsetHeight
      }px`;
      childMsgHeight.delete(targetSenderUid);
    }
    if (previousElement?.classList?.contains("main") && previousElement?.classList?.contains("child")) {
      previousElement.classList.remove("main");
      previousElement.classList.remove("not-next");
    }
  });
}

onAddSendMsg((_, msgId) => {
  ckedditorIndex2msgId.set(targetCkeditorIndex, msgId);
});

export { setMessage, MsgMutation };
