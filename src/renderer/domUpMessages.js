import { check_only_img, get_link_data, hexToHSL, output } from "./utils.js"
import { message_time, message_web } from "./myElement.js"
import { config } from "./config.js"

let translate_hover;

async function domUpMessages(node) {
    const msgprops = node?.firstElementChild?.__VUE__?.[0]?.props
    const msgId = msgprops?.msgRecord.msgId;
    const msgTime = msgprops?.msgRecord.msgTime;
    const elements = msgprops?.msgRecord.elements[0];
    const senderUid = msgprops?.msgRecord.senderUid;
    const peer = await LLAPI.getPeer()
    const friendslist = await LLAPI.getFriendsList()
    // 链接识别，并生成预览
    const msgLink = node.querySelector(".text-link")
    const WebPage = node.querySelector(".WebPage")
    if (msgLink && config.setting.link_preview) {
        if (!WebPage) {
            const url = msgLink.innerText
            const url_data = await get_link_data(url) // 消息数据
            if (url_data) {
                const msgContainer = node.querySelector(".msg-content-container")
                const msgContent = msgContainer.firstElementChild
                msgContent.style.overflow = "visible";
                const web_ele1 = document.createElement("div");
                web_ele1.innerHTML = message_web.format({ img: url_data?.image, title: url_data?.title, description: url_data?.description})
                const web_ele = web_ele1.lastElementChild
                const img_ele = web_ele.querySelector(".media-photo")
                const message_width = node.querySelector('.message-content').offsetWidth
                const backgroundColor = msgContainer.classList.contains("container--self")? getComputedStyle(document.body).getPropertyValue('--bubble_host') : getComputedStyle(document.body).getPropertyValue('--bubble_guest')
                let hsl = hexToHSL(backgroundColor)
                hsl = hsl[0] === 0? [103, 66, 78]:hsl
                web_ele.style.setProperty('--WebPage_background-color', `hsl(${hsl[0]}deg ${hsl[1]}% ${hsl[2]+10}% / 25%)`)
                web_ele.style.setProperty('--message-width', `${message_width>=300? message_width-10:300}px`);
                if (img_ele) {
                    img_ele.onload = function() {
                        const width = this.width;
                        width<message_width/3 && web_ele.classList.add('with-small-photo')
                    };
                    img_ele.onerror = function() {
                        img_ele.style.display = "none"
                    };
                }
                msgContent.appendChild(web_ele);
            }
        } else {
            const message_width = node.querySelector('.message-content').offsetWidth
            WebPage.style.setProperty('--message-width', `${message_width>=300? message_width-10:300}px`);
        }
    }
    // 翻译
    const msg_text = node.querySelector(".text-normal")
    if (msg_text) {
        function translate(event) {
            const text = event.target.textContent
            translate_hover = setInterval(async () => {
                const translate_data = await qqpromote.translate(text, config.setting)
                const timeEl = document.createElement("div");
                timeEl.innerText = translate_data?.TargetText
                event.target.closest(".message-content.mix-message__inner").appendChild(timeEl);
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
    // 消息时间
    if (config.setting.show_time && node.querySelector(".msg-content-container")) {
        output("显示消息时间")
        const date = new Date(msgTime * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timestamp = `${hours}:${String(minutes).padStart(2, '0')}`
        const msg_content = node.querySelector(".msg-content-container").firstElementChild
        if (config.setting.show_time_up) {
            const user_name = node.querySelector(".user-name")
            const user_name_time = document.createElement("div");
            user_name_time.classList.add("user_name_time")
            user_name_time.innerText = date.toLocaleString()
            user_name_time.style.color = config.setting.time_color
            user_name?.appendChild(user_name_time);
        } else {
            //msg_content.style.overflow = "visible";
            const msg_time_ele1 = document.createElement("div");
            msg_time_ele1.innerHTML = message_time.format({ time: timestamp, detail_time: date.toLocaleString() })
            const msg_time_ele = msg_time_ele1.lastElementChild
            const msg_content_ele = msg_time_ele.querySelector(".time .inner.tgico")
            if (!check_only_img(msg_content.children)) {
                //msg_content.insertAdjacentHTML("beforeend", message_time.format({ time: timestamp, detail_time: date.toLocaleString() }));
                if (msg_content.children[0].classList.contains("ark-view-message") || msg_content.children[0].classList.contains("ark-loading")) {
                    msg_content_ele.style.bottom = "15px"
                    msg_content_ele.style.right = "3px"
                }
            } else {
                msg_time_ele.style=`
                    position: absolute;
                    bottom: 5px;
                    right: 0px;
                    border-radius: 3.75rem;
                    background-color: rgb(0 0 0 / 35%);
                    padding: 0.1rem 0.3125rem;
                `
                //msg_content.insertAdjacentHTML("beforeend", message_time_img.format({ time: timestamp, detail_time: date.toLocaleString() }));
                msg_time_ele.classList.add("time_img")
                //msg_content_ele.style.bottom = "auto"
                //msg_content_ele.style.right = "-1px"
            }
            const time_inner_ele = msg_time_ele.querySelector(".time .inner")
            time_inner_ele.style.color = config.setting.time_color
            msg_time_ele.addEventListener("click", async (event) => {
                if (config.setting.repeat_msg_time) {
                    const peer = await LLAPI.getPeer()
                    await LLAPI.forwardMessage(peer, peer, [msgId])
                }
            })
            msg_content.appendChild(msg_time_ele);
        }
    }
    // 自动语音转文字
    const ptt_area = node.querySelector(".ptt-element__bottom-area")
    if (ptt_area && config.setting.auto_ptt2Text) {
        if (!ptt_area.closest(".message-container--self")) {
            await LLAPI.Ptt2Text(msgId, peer, elements)
            ptt_area.style.display = "block"
        }
    }
    // 回复点击监听 点击空白
    if (config.setting.reply_at && config.setting.reply_at_click) {
        const message_container = node.querySelector(".message-container")
        message_container?.addEventListener('click', async () => {
            const interval = setInterval(async () => {
                let editor = await LLAPI.get_editor()
                if (editor.includes("</msg-at>")) {
                    clearInterval(interval);
                    LLAPI.del_editor("msg-at", true);
                }
            });
            setTimeout(() => clearInterval(interval), 50);
        })
    }
    // 名称扩展
    if (config.setting.friendsinfo && node.querySelector(".msg-content-container")) {
        const friendItem = friendslist.find(item => item.uid === senderUid);
        const friend_info = `<${friendItem.raw.remark? friendItem.raw.remark:friendItem.nickName}>(${friendItem.uin})`
        const user_name = node.querySelector(".user-name .text-ellipsis")
        user_name.textContent = user_name.textContent+friend_info
    }
}

export {
    domUpMessages
}