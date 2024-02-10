/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-05 13:44:33
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-02-03 20:12:59
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
// Electron 主进程 与 渲染进程 交互的桥梁
const { contextBridge, ipcRenderer } = require("electron");

// 在window对象下导出只读对象
contextBridge.exposeInMainWorld("qqpromote", {
    getSettings: () => ipcRenderer.invoke(
        "LiteLoader.qqpromote.getSettings"
    ),
    setSettings: content => ipcRenderer.invoke(
        "LiteLoader.qqpromote.setSettings",
        content
    ),
    translate: (text, data) => ipcRenderer.invoke(
        "LiteLoader.qqpromote.translate",
        text, data
    ),
    ogs: url => ipcRenderer.invoke(
        "LiteLoader.qqpromote.ogs",
        url
    ),
    get_imgbase64: (url, config) => ipcRenderer.invoke(
        "LiteLoader.qqpromote.get_imgbase64",
        url, config
    ),
    chatgpt: (content, data) => ipcRenderer.invoke(
        "LiteLoader.qqpromote.chatgpt",
        content, data
    ),
    openFolder: (localPath) => ipcRenderer.invoke(
        "LiteLoader.qqpromote.openFolder",
        localPath
    ),
    getAmrPath: (text) => ipcRenderer.invoke(
        "LiteLoader.qqpromote.getAmrPath",
        text
    ),
    updateStyle: (callback) => ipcRenderer.on(
        "LiteLoader.qqpromote.updateStyle",
        callback
    ),
    updateWebPageStyle: (callback) => ipcRenderer.on(
        "LiteLoader.qqpromote.updateWebPageStyle",
        callback
    ),
    showQrContent: (content) => ipcRenderer.invoke( // TODO: 使用更加具体的 API 进行替换(目前API仅开发使用)
        "LiteLoader.qqpromote.showQrContent",
        content
    )
});
