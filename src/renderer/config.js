
/**
 * @typedef Settings
 * @property {boolean} repeat_msg 是否开启消息复读
 * @property {boolean} repeat_msg_time 是否开启点击时间复读
 * @property {boolean} translate 是否开启消息翻译
 * @property {boolean} show_time 是否显示消息发送时间
 * @property {boolean} show_time_up 是否在名称后面显示时间
 * @property {boolean} rpmsg_location 是否开启复读按钮置顶
 * @property {boolean} replaceArk 是否替换Ark
 * @property {boolean} not_updata 是否屏蔽更新
 * @property {boolean} link_preview 是否开启链接预览
 * @property {boolean} chatgpt 是否开启ChatGPT
 * @property {boolean} chatgpt_add_reply 是否开启ChatGPT引用回复
 * @property {boolean} chatgpt_location 是否开启ChatGPT按钮置顶
 * @property {string} chatgpt_key ChatGPT API Key
 * @property {string} chatgpt_url ChatGPT API URL
 * @property {string} chatgpt_model ChatGPT Model
 * @property {Object<string, boolean>} sidebar_list 侧边栏列表
 * @property {Object<string, boolean>} messagebar_list 消息栏列表
 * @property {Object<string, boolean>} upbar_list 上栏列表
 * @property {boolean} reply_at 是否禁止回复时@原消息发送者
 * @property {boolean} reply_at_click 是否禁止双击回复时@原消息发送者
 * @property {boolean} auto_ptt2Text 是否开启自动语音转文字
 * @property {boolean} auto_login 是否开启自动登录
 * @property {boolean} call_barring 是否屏蔽通话
 * @property {boolean} friendsinfo 是否显示好友信息
 * @property {boolean} resetLogin 是否重置登录
 * @property {boolean} display_style 是否开启自定义样式
 * @property {boolean} local_emoji 是否开启本地表情
 * @property {boolean} qrcode 是否开启二维码识别
 * @property {string} emoji_folder 表情文件夹路径
 * @property {string} translate_type 翻译提供方
 * @property {string} time_color 时间颜色
 * @property {string} translate_SECRET_ID 腾讯翻译 SecretId
 * @property {string} translate_SECRET_KEY 腾讯翻译 SecretKey
 * @property {string} translate_baidu_appid 百度翻译 AppId
 * @property {string} translate_baidu_key 百度翻译 Key
 * @property {Object} video_background_data 视频背景数据
 * @property {Object<string, {name: string, value: boolean}>} video_background 视频背景
 * @property {boolean} face_prompt 是否开启表情提示
 * @property {Object<string, {name: string, value: boolean}>} face_block 表情屏蔽
 * @property {boolean} message_merging 是否开启消息合并
 * @property {boolean} message_avatar_float 是否开启消息头像浮动
 * @property {boolean} ckeditor_history 是否开启富文本编辑器历史记录
 * @property {boolean} image_other_close 是否开启点击图片外关闭图片
 */

/**
 * @typedef Config
 * @property {Settings} setting 设置配置
 */

/**
 * @type {Config} 配置信息
 */
const config = await qqpromote.getSettings()


async function setSettings(newConfig) {
    await qqpromote.setSettings(JSON.stringify(newConfig))
}

/**
 * 更新配置
 */
qqpromote.updateSettings((_, newConfig) => {
    config.setting = JSON.parse(newConfig).setting
})

export {
    setSettings,
    config,
}