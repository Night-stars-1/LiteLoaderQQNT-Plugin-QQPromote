/*
 * @Date: 2024-01-09 00:35:45
 *LastEditors: Night-stars-1 nujj1042633805@gmail.com
 *LastEditTime: 2024-08-23 20:02:52
 */
import { domUpMessages } from "./renderer/domUpMessages.js"
import { changeHref, domUpNavItem } from "./renderer/changeHref.js"
import { userLogin } from "./renderer/userLogin.js"
import { setMessage } from "./renderer/setMessage.js"
import { qMenu } from "./renderer/qMenu.js"
import { setting_vue } from "./renderer/setVue.js"
import { hookVue3 } from "./renderer/vue.js"
import { qGuildMenu } from "./renderer/qGuildMenu.js"

const updateStyle = qqpromote.updateStyle;
const updateWebPageStyle = qqpromote.updateWebPageStyle;

let login_time = 3;

async function onLoad() {
    const setting_data = await qqpromote.getSettings()
    setting_data?.setting.message_merging ? document.body.classList.add('message_merging'):document.body.classList.remove('message_merging')
    const plugin_path = LiteLoader.plugins.qqpromote.path.plugin;
    // CSS
    const css_file_path = `local:///${plugin_path}/src/config/message.css`;
    const link_element = document.createElement("link");
    link_element.rel = "stylesheet";
    link_element.href = css_file_path;
    document.head.appendChild(link_element);
    // WebPageCSS
    const WebPageCSS_file_path = `local:///${plugin_path}/src/config/WebPage.css`;
    const WebPageCSS_link_element = document.createElement("link");
    WebPageCSS_link_element.rel = "stylesheet";
    WebPageCSS_link_element.href = WebPageCSS_file_path;
    document.head.appendChild(WebPageCSS_link_element);
    const GlobalCSS_file_path = `local:///${plugin_path}/src/config/global.css`;
    const GlobalCSS_element = document.createElement("link");
    GlobalCSS_element.rel = "stylesheet";
    GlobalCSS_element.href = GlobalCSS_file_path;
    document.head.appendChild(GlobalCSS_element);
    updateStyle(() => {
        link_element.href = `${css_file_path}?r=${new Date().getTime()}`;
    });
    updateWebPageStyle(() => {
        WebPageCSS_link_element.href = `${WebPageCSS_file_path}?r=${new Date().getTime()}`;
    });
    // 自动登录和依赖检测
    const Interval = setInterval(() => {
        if (location.pathname === "/renderer/login.html" && setting_data.setting.auto_login) {
            const loginBtnText = document.querySelector(".auto-login .q-button span");
            if (!loginBtnText) {
                console.log(loginBtnText)
                clearInterval(Interval);
                return
            };
            if (login_time>=0) {
                loginBtnText.innerText = `${login_time} 秒后自动登录`;
                login_time--;
            } else {
                loginBtnText.click();
            }
            return
        }
        if (location.hash !== "#/main/message" && location.href.indexOf("#/chat/") == -1) return
        console.log(LiteLoader?.plugins)
        if (!(LiteLoader?.plugins?.LLAPI?.manifest?.version >= "1.3.1")) {
            setTimeout(() => {
                qqpromote.showMessageBox({
                    message: "LLAPI版本过低, 请在插件市场安装最新版",
                    detail: "该提示并非QQ官方提示, 请不要发给官方群",
                    type: "warning",
                    buttons: ["前往插件市场", "确定"],
                  }).then((result) => {
                    if (result.response === 0) {
                        try {
                            StoreAPI.openStore("LLAPI");
                        } catch (error) {
                            qqpromote.showMessageBox({
                                message: "未安装插件市场",
                                detail: "该提示并非QQ官方提示, 请不要发给官方群",
                                type: "warning",
                                buttons: ["确定"],
                            })
                        }
                    }
                  })
            }, 1000);
        }
        clearInterval(Interval);
    }, 1000);

    userLogin()

    LLAPI.add_qmenu(qMenu)
    LLAPI.add_qGuildMenu(qGuildMenu)
    
    LLAPI.on("dom-up-messages", domUpMessages)
    
    changeHref(location)
    LLAPI.on("change_href", changeHref)
    LLAPI.on("dom-up-nav-item", domUpNavItem)

    LLAPI.on("set_message", setMessage)
}

async function onSettingWindowCreated(view){
    const setting_data = await qqpromote.getSettings()
    const plugin_path = LiteLoader.plugins.qqpromote.path.plugin;
    const html_file_path = `local:///${plugin_path}/src/config/view.html`;
    const css_file_path = `local:///${plugin_path}/src/config/view.css`;
    const displayCss_file_path = `local:///${plugin_path}/src/config/display.css`;
    if (setting_data.setting.display_style) {
        // 插入设置页样式
        const displayLink = document.createElement('link')
        displayLink.rel = 'stylesheet'
        displayLink.href = displayCss_file_path
        document.head.appendChild(displayLink)
    }
    // 插入设置页
    const htmlText = await (await fetch(html_file_path)).text()
    view.insertAdjacentHTML('afterbegin', htmlText)
    // 插入设置页样式
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = css_file_path
    document.head.appendChild(link)
    document.querySelectorAll(".nav-bar.liteloader .nav-item").forEach(node => {
        if (node.textContent === "QQ增强") {
            setting_vue(node)
        }
    })
}

hookVue3()
if (location.hash === "#/blank") {
    navigation.addEventListener("navigatesuccess", onLoad, { once: true });
} else {
    onLoad();
}

export {
    onSettingWindowCreated
}