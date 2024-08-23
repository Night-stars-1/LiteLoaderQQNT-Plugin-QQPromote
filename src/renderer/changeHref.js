/*
 * @Date: 2024-01-19 16:44:32
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-08-23 19:46:21
 */
import { output } from "./utils.js"
import { config, setSettings } from "./config.js"
import { setVideoBackGround } from "./videoBackGround.js"

function changeHref(location) {
    switch (location.hash) {
        case "#/main/message":
            document.querySelectorAll(".sidebar__menu .func-menu__item").forEach(
                (node)=> {
                    const aria_label = node.firstChild.getAttribute("aria-label")
                    if (aria_label && !(aria_label in config.setting.sidebar_list)) {
                        config.setting.sidebar_list[aria_label] = false
                        setSettings(config)
                    }
                    if (config.setting.sidebar_list[aria_label]){
                        node.remove()
                    }
                }
            )
            document.querySelectorAll(".window-control-area div").forEach(
                (node)=> {
                    const name = node.lastElementChild?.__VUE__?.[0]?.type?.name
                    switch (name) {
                        case "QIconSwitchPanel16":
                            if (config.setting.upbar_list["折叠栏"]){
                                node.remove()
                            }
                            if (!("折叠栏" in config.setting.upbar_list)) {
                                config.setting.upbar_list["折叠栏"] = false
                                setSettings(config)
                            }
                            break;
                        default:
                            output("未知栏", name)
                            break;
                    }
                }
            )
            break;
        case "#/image-viewer":
            if (!config.setting.image_other_close) break;
            const interval = setInterval(() => {
                // 监听图片的点击事件
                const mainAreaRotateElement= document.querySelector(".main-area__image-rotate-wrap")
                if (!mainAreaRotateElement) return;
                clearInterval(interval);
                const closeElement = document.createElement("div")
                closeElement.classList.add("close-image")
                mainAreaRotateElement.appendChild(closeElement)
                // const mainAreaElement = mainAreaRotateElement.querySelector(".main-area__image-wrap")
                // // 监听图片的点击事件
                // mainAreaRotateElement.addEventListener('click', (event) => {
                //     if (!mainAreaElement.contains(event.target)) {
                //         document.querySelector(".close").click()
                //     }
                // });
            }, 1000);
            break;
    }
    setVideoBackGround(location)
}

function domUpNavItem(node) {
    const aria_label = node.getAttribute("aria-label")
    if (aria_label && !(aria_label.endsWith("未读")) && !(aria_label in config.setting.sidebar_list)) {
        config.setting.sidebar_list[aria_label] = false
        setSettings(config)
    }
    if (config.setting.sidebar_list[aria_label]){
        node.remove()
    }
}

export {
    changeHref,
    domUpNavItem
}
