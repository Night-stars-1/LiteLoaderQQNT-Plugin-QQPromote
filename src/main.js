/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-12 15:41:47
* LastEditors: Night-stars-1 nujj1042633805@gmail.com
* LastEditTime: 2024-02-19 19:14:05
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
const { randomUUID } = require("crypto")
const fs = require("fs");
const path = require("path");
const { onLoad, setSettings } = require("./main/onLoad.js");
const { output, replaceArk, getEmojis } = require("./main/utils.js");
const { getUrlData } = require("./main/urlCacha.js");

const pluginDataPath = LiteLoader.plugins.qqpromote.path.data;
const settingsPath = path.join(pluginDataPath, "settings.json");
const data = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

let emojiCallbackId = "";
let lastSenderUid = "";
let targetPeerUid = "";

/**
 * 设置消息记录
 * @param {*} msgRecord 
 */
function setMsgRecord(msgRecord) {
    if (!msgRecord.qqpromote) msgRecord.qqpromote = {}
    const textContent = msgRecord.elements[0].textElement?.content

    const linkMatches = textContent?.match(/https?:\/\/\S+/gi);
    if (data.setting.link_preview && linkMatches) {
        msgRecord.qqpromote.linkPreview = getUrlData(linkMatches[0]) ?? null
    }
    // 消息合并标记
    if (msgRecord.elements[0].grayTipElement === null) {
        msgRecord.qqpromote.chatType = lastSenderUid === msgRecord.senderUid? 'child':'main'
        lastSenderUid = msgRecord.senderUid
    } else {
        msgRecord.qqpromote.chatType = 'main'
        lastSenderUid = ''
    }
}

function onBrowserWindowCreated(window) {
    const emojis = getEmojis();

    // 复写并监听ipc通信内容
    const original_send = window.webContents.send;

    const patched_send = function (channel, ...args) {
        const payload = args?.[1]?.[0]?.payload
        switch (args?.[1]?.[0]?.cmdName) {
            case "nodeIKernelUnitedConfigListener/onUnitedConfigUpdate":
                // 屏蔽更新
                if (!data.setting.not_updata) break;
                args[1][0].payload.configData.content = ""
                args[1][0].payload.configData.isSwitchOn = false
                break;
            case "onOpenParamChange":
                // 禁止通话
                if (!data.setting.call_barring) break;
                if (args?.[1][0]?.payload?.avSdkData) {
                    args = null
                }
                break;
            case "nodeIKernelMsgListener/onRecvMsg":
                const msgItem = payload.msgList[0]
                //output(msgItem.peerUid, targetPeerUid)
                if (msgItem.peerUid !== targetPeerUid) break;
                const msgElement = msgItem.elements[0]
                if (data.setting.face_block[msgElement.faceElement?.faceIndex]?.value) {
                    msgItem.msgType = 5
                    msgItem.subMsgType = 12
                    msgElement.elementType = 8
                    msgElement.faceElement = null
                    msgElement.grayTipElement = {
                        subElementType: 12,
                        revokeElement: null,
                        proclamationElement: null,
                        emojiReplyElement: null,
                        groupElement: null,
                        buddyElement: null,
                        feedMsgElement: null,
                        essenceElement: null,
                        groupNotifyElement: null,
                        buddyNotifyElement: null,
                        xmlElement: {
                            busiType: '0',
                            busiId: '10145',
                            c2cType: 0,
                            serviceType: 0,
                            ctrlFlag: 0,
                            content: data.setting.face_prompt? `<nor txt="龙王"/> <qq uin="${msgItem.senderUid}" col="3" jp="" /> <nor txt="在群里喷水"/>`:null,
                            templId: '0',
                            seqId: '0',
                            templParam: new Map([]),
                            pbReserv: '0',
                            members: new Map([])
                        },
                        fileReceiptElement: null,
                        localGrayTipElement: null,
                        blockGrayTipElement: null,
                        aioOpGrayTipElement: null,
                        jsonGrayTipElement: null,
                        walletGrayTipElement: null,
                    };
                }
                setMsgRecord(msgItem)
                break;
            case "nodeIKernelMsgListener/onAddSendMsg":
                const msgRecord = payload.msgRecord
                window.webContents.send("LiteLoader.qqpromote.onAddSendMsg", msgRecord.msgId);
                setMsgRecord(msgRecord)
                break;
        }
        // 替换历史消息中的小程序卡片
        if (args?.[1]?.msgList?.length > 0) {
            const msgList = args?.[1]?.msgList;
            // 替换小程序卡片
            msgList.forEach((msgItem) => {
                let msg_seq = msgItem.msgSeq;
                msgItem.elements.forEach((msgElement) => {
                    // output(msgItem.msgType, msgItem.subMsgType, msgElement.grayTipElement)
                    if (msgElement.arkElement && msgElement.arkElement.bytesData && data.setting.replaceArk) {
                        const json = JSON.parse(msgElement.arkElement.bytesData);
                        if (json?.meta?.detail_1?.appid) {
                            msgElement.arkElement.bytesData = replaceArk(json, msg_seq);
                        }
                    }
                    // 屏蔽表情
                    if (data.setting.face_block[msgElement.faceElement?.faceIndex]?.value) {
                        msgItem.msgType = 5
                        msgItem.subMsgType = 12
                        msgElement.elementType = 8
                        msgElement.faceElement = null
                        msgElement.grayTipElement = {
                            subElementType: 12,
                            revokeElement: null,
                            proclamationElement: null,
                            emojiReplyElement: null,
                            groupElement: null,
                            buddyElement: null,
                            feedMsgElement: null,
                            essenceElement: null,
                            groupNotifyElement: null,
                            buddyNotifyElement: null,
                            xmlElement: {
                                busiType: '0',
                                busiId: '10145',
                                c2cType: 0,
                                serviceType: 0,
                                ctrlFlag: 0,
                                content: data.setting.face_prompt? `<nor txt="龙王"/> <qq uin="${msgItem.senderUid}" col="3" jp="" /> <nor txt="在群里喷水"/>`:null,
                                templId: '0',
                                seqId: '0',
                                templParam: new Map([]),
                                pbReserv: '0',
                                members: new Map([])
                            },
                            fileReceiptElement: null,
                            localGrayTipElement: null,
                            blockGrayTipElement: null,
                            aioOpGrayTipElement: null,
                            jsonGrayTipElement: null,
                            walletGrayTipElement: null,
                        };
                    }
                });
                setMsgRecord(msgItem)
            });
            //msgList.reverse();
        } else if (args?.[1]?.configData?.content?.length > 0) {
            // 侧边栏管理
            const content = JSON.parse(args[1].configData.content)
            if (Array.isArray(content) && !(content.findIndex((item) => item.label === "空间"))) {
                if (Array.isArray(data.setting.sidebar_list)) {
                    data.setting.sidebar_list = {}
                }
                const new_content = []
                content.forEach((item) => {
                    if (!(item.label in data.setting.sidebar_list)) {
                        data.setting.sidebar_list[item.label] = false
                    }
                    if (!data.setting.sidebar_list[item.label]){
                        new_content.push(item)
                    }
                })
                args[1].configData.content = JSON.stringify(new_content)
                setSettings(settingsPath, data)
            }
        } else if (args?.[0]?.callbackId === emojiCallbackId) {
            // 收藏表情
            localEmojiInfoList = emojis.map((item, index) => ({
                uin: '',
                emoId: index,
                emoPath: item,
                isExist: true,
                resId: randomUUID(),
                url: item,
                md5: '',
                emoOriginalPath: '',
                thumbPath: '',
                RomaingType: '',
                isAPNG: false,
                isMarkFace: false,
                eId: '',
                epId: '0',
                ocrWord: '',
                modifyWord: '',
                exposeNum: 0,
                clickNum: 0,
                desc: '本地表情'
            }));
            args[1].emojiInfoList = localEmojiInfoList.concat(args[1].emojiInfoList)
        }
        return original_send.call(window.webContents, channel, ...args);
    };

    window.webContents.send = patched_send;

    function ipc_message(_, status, name, ...args) {
        if (name !== "___!log" && args[0][1] && args[0][1][0] != "info") {
            const event = args[0][0];
            const data = args[0][1];
            switch (data?.[0]) {
                case "nodeIKernelMsgService/setMsgRead":
                    const peer = data[1]?.peer;
                    targetPeerUid = peer.peerUid
                    break;
                case "nodeIKernelMsgService/fetchFavEmojiList":
                    if (data[1].resId === "") {
                        emojiCallbackId = event.callbackId
                    }
                    break;
            }
        }
    }
    const ipc_message_proxy = window.webContents._events["-ipc-message"]?.[0] || window.webContents._events["-ipc-message"];
    
    const proxyEvents = new Proxy(ipc_message_proxy, {
        // 拦截函数调用
        apply(target, thisArg, argumentsList) {
            ipc_message(...argumentsList);
            return target.apply(thisArg, argumentsList);
        }
    });
    if (window.webContents._events["-ipc-message"][0]) {
        window.webContents._events["-ipc-message"][0] = proxyEvents
    } else {
        window.webContents._events["-ipc-message"] = proxyEvents
    }
}

onLoad()

module.exports = {
    onBrowserWindowCreated
}