import { config, setSettings } from "./config.js"

const onAddSendMsg = qqpromote.onAddSendMsg;

let injectCkeditor = false;
let ckeditorHistoryIndex = 0;
let targetCkeditorIndex = 0;
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
        if (!injectCkeditor && ckeditorInstance && sendMsgDom) {
            async function setCkeditorHistory(event) {
                const ckeditorText = LLAPI.get_editor();
                if (
                    (event.key === "Enter" || event.type === "click") &&
                    ckeditorText
                ) {
                    /**
                    const msgId = ckedditorIndex2msgId.get(ckeditorHistoryIndex)
                    if (sendHistoryState && msgId) {
                        ckedditorIndex2msgId.delete(ckeditorHistoryIndex)
                        const peer = await LLAPI.getPeer()
                        LLAPI.recallMessage(peer, [msgId])
                        sendHistoryState = false;
                    }
                    */
                    ckeditorHistory.push(ckeditorText);
                    ckeditorHistoryIndex = ckeditorHistory.length;
                    targetCkeditorIndex = ckeditorHistory.length - 1;
                } else if (event.key === "ArrowUp") {
                    if (ckeditorHistoryIndex > 0) {
                        ckeditorHistoryIndex--;
                        sendHistoryState = true;
                    } else {
                        sendHistoryState = false;
                    }
                    LLAPI.set_editor(ckeditorHistory[ckeditorHistoryIndex]);
                } else if (event.key === "ArrowDown") {
                    if (ckeditorHistoryIndex < ckeditorHistory.length - 1) {
                        ckeditorHistoryIndex++;
                        sendHistoryState = true;
                    } else {
                        sendHistoryState = false;
                    }
                    LLAPI.set_editor(ckeditorHistory[ckeditorHistoryIndex]);
                }
            }
            ckeditorDom.addEventListener("keydown", setCkeditorHistory);
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
            subtree: false,
        });
    }
}

function MsgMutation(mutationsList) {
    // 遍历每个变化
    for (const { type, target } of mutationsList) {
        Array.from(target.children).forEach((element) => {
            const targetProps = element.firstElementChild.__VUE__[0].props;
            if (targetProps.msgRecord.elements[0].grayTipElement === null) {
                const targetChatType =
                    targetProps.msgRecord.qqpromote?.chatType;
                const targetSenderUid = targetProps.msgRecord.senderUid;
                if (targetChatType == "child") {
                    childMsgHeight.set(
                        targetSenderUid,
                        (childMsgHeight.get(targetSenderUid) ?? 0) +
                            element.offsetHeight
                    );
                } else if (targetChatType == "main") {
                    const avatarSpan = element.querySelector(".avatar-span");
                    avatarSpan.style.height = `${
                        (childMsgHeight.get(targetSenderUid) ?? 0) +
                        element.querySelector(".message-container")
                            .offsetHeight
                    }px`;
                    childMsgHeight.delete(targetSenderUid);
                }
            }
        });
    }
}

onAddSendMsg((_, msgId) => {
    ckedditorIndex2msgId.set(targetCkeditorIndex, msgId);
});

export { setMessage };
