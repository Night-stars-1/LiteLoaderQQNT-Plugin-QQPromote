/*
* Author: Night-stars-1 nujj1042633805@gmail.com
* Date: 2024-02-17 18:53:37
* LastEditors: Night-stars-1 nujj1042633805@gmail.com
* LastEditTime: 2024-02-19 23:27:22
 */
import { config } from "./config.js"

/**
 * 右键打开频道菜单
 * @param {*} qContextMenu 
 * @param {*} message_element 
 */
async function qGuildMenu(qContextMenu, _) {
    // 回复点击监听 点击回复按钮
    qContextMenu.childNodes.forEach((element) => {
        if (element.textContent.replaceAll(" ", "") === "回复") {
            if (config.setting.reply_at) {
                element.addEventListener('click', () => {
                    const interval = setInterval(() => {
                        let editor = LLAPI.get_editor()
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
    qGuildMenu
}