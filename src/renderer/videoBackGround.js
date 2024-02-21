/*
 * @Date: 2024-01-26 17:29:07
* LastEditors: Night-stars-1 nujj1042633805@gmail.com
* LastEditTime: 2024-02-19 23:58:30
 */
import { config } from "./config.js"

async function setVideoBackGround(location) {
    if (config.setting.video_background[location.hash]?.value && !document.querySelector(".qqpromote_video")){
        document.body.insertAdjacentHTML('afterbegin', /*html*/`
            <video class="qqpromote_video" autoplay muted loop>
                <source src="https://t.mwm.moe/acg/acg" type="video/mp4">
            </video>
            
        `);// <div class="qqpromote_video_overlay"></div>
        document.querySelector("#app").style = `
            --bg_list: none!important;
            --bg_bottom_light: rgba(255,255,255,0.35)!important;
            --bg_top_light: rgba(255,255,255,0.35)!important;
            --bg_bottom_standard: rgba(255,255,255,0.35)!important;
            --fill_light_primary: rgba(255,255,255,0.35)!important;
            --nt_bg_white_2_overlay_hover_2_mix: rgba(255,255,255,0.35)!important; /* 聊天框文件类 */
            --blur_middle_standard: none!important; /* 右下设置选择框 */
        `;
    }
}

function output(...args) {
    console.log("\x1b[32m[QQ增强-视频背景]\x1b[0m", ...args);
}

export {
    setVideoBackGround
}