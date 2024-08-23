import { decodeQR, output } from "./utils.js"
import { config } from "./config.js"
import { repeatmsg_ele, qrcode_ele, chatgpt_ele } from "./myElement.js"

const chatgpt = qqpromote.chatgpt

/**
 * 右键打开菜单
 * @param {*} qContextMenu 
 * @param {*} message_element 
 */
async function qMenu(qContextMenu, message_element) {
    const { classList } = message_element
    const msgprops = message_element?.closest(".msg-content-container")?.closest(".message")?.__VUE__?.[0]?.props
    const uid = msgprops?.uid
    const msgIds = msgprops?.msgRecord.msgId;
    const senderUid = msgprops?.msgRecord.senderUid;
    const content = message_element?.innerText;
    // const qThemeValue = document.body.getAttribute('q-theme');
    // qContextMenu.style.setProperty('--q-contextmenu-max-height', 'calc(40vh - 16px)');
    // +1
    if (config.setting.repeat_msg) {
        // 插入分隔线
        // qContextMenu.insertAdjacentHTML(location, separatorHTML)
        const repeatmsg = repeatmsg_ele.cloneNode(true);
        repeatmsg.addEventListener('click', async () => {
            const peer = await LLAPI.getPeer()
            if (classList[0] == "ptt-element__progress") {
                const msg = await LLAPI.getPreviousMessages(peer, 1, msgIds.toString())
                const elements = msg[0].elements
                await LLAPI.sendMessage(peer, elements)
            } else {
                await LLAPI.forwardMessage(peer, peer, [msgIds])
            }
            // 关闭右键菜单
            qContextMenu.remove()
        })
        /*
        if (qThemeValue != "light") {
            repeatmsg.querySelector("svg").setAttribute("fill", "#ffffff")
        }
        */
        if (config.setting.rpmsg_location) {
            qContextMenu.insertBefore(repeatmsg, qContextMenu.firstChild);
        } else {
            qContextMenu.appendChild(repeatmsg);
        }
    }

    // chatgpt对话
    if (config.setting.chatgpt) {
        const chatgpt_msg = chatgpt_ele.cloneNode(true);
        chatgpt_msg.addEventListener('click', async () => {
            const msg = await chatgpt(content, config.setting)
            if (config.setting.chatgpt_add_reply) {
                await LLAPI.set_editor(msg)
                qContextMenu.childNodes.forEach((element) => {
                    if (element.textContent === "回复") {
                        element.click()
                    }
                })
            } else {
                await LLAPI.set_editor(msg)
                // 关闭右键菜单
                qContextMenu.remove()
            }
        })
        /*
        if (qThemeValue != "light") {
            chatgpt_msg.querySelector("svg").setAttribute("fill", "#ffffff")
        }
        */
        if (config.setting.chatgpt_location) {
            qContextMenu.insertBefore(chatgpt_msg, qContextMenu.firstChild);
        } else {
            qContextMenu.appendChild(chatgpt_msg);
        }
    }

    if (config.setting.qrcode) {
        // 识别二维码
        const qrcode = qrcode_ele.cloneNode(true);
        qrcode.addEventListener('click', async () => {
            // 关闭右键菜单
            qContextMenu.remove();
            const content = await decodeQR(message_element);
            qqpromote.showQrContent(content);
        })
        if (classList?.[0] === "image-content") {
            qContextMenu.insertBefore(qrcode, qContextMenu.firstChild);
            /*
            if (qThemeValue == "light") {            
                qContextMenu.insertBefore(qrcode, qContextMenu.firstChild);
            } else {
                qrcode.querySelector("svg").setAttribute("fill", "#ffffff")
                qContextMenu.insertBefore(qrcode, qContextMenu.firstChild);
            }
            */
        }
    }

    // 回复点击监听 点击回复按钮
    qContextMenu.childNodes.forEach((element) => {
        if (element.textContent === "回复") {
            if (senderUid != uid && config.setting.reply_at) {
                element.addEventListener('click', async () => {
                    const interval = setInterval(async () => {
                        let editor = await LLAPI.get_editor()
                        if (editor.includes("</msg-at>")) {
                            clearInterval(interval);
                            LLAPI.del_editor("msg-at", true)
                        }
                    });
                    setTimeout(() => clearInterval(interval), 50);
                })
            }
        }
    })
}

export {
    qMenu
}