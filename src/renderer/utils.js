/*
 * @Date: 2024-01-19 16:49:48
 * LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * LastEditTime: 2024-02-19 23:24:54
 */

const plugin_path = LiteLoader.plugins.qqpromote.path; // 插件本体的路径
const ogs = qqpromote.ogs
const get_imgbase64 = qqpromote.get_imgbase64

// 自定义format用法
String.prototype.format = function(params) {
    return this.replace(/\{(\w+)\}/g, (match, key) => params[key] || '');
};

function output(...args) {
    console.log("\x1b[32m[QQ增强-渲染]\x1b[0m", ...args);
}

function check_only_img(children) {
    for (const child of children) {
        if (!child.classList.contains("image")) {
            return false
        }
    }
    return true
}

async function get_link_data(url) {
    const patterns = {
        "https://www\\.bilibili\\.com/video/av(\\d+)": "https://api.bilibili.com/x/web-interface/view?aid={key}"
    };
    for (const pattern in patterns) {
        // 自定义链接消息获取
        const regex = new RegExp(pattern);
        const match = url.match(regex);
        if (match) {
            try {
                const key = match[1];
                const api_url = patterns[pattern].format({ key:key })
                const response = await fetch(api_url);
                const data = await response.json();
                const headers = {
                    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) QQ/9.9.1-15717 Chrome/114.0.5735.243 Electron/25.3.1 Safari/537.36"
                }
                const imgbase64 = await get_imgbase64(data.data.pic, { headers, responseType: 'arraybuffer' });
                const url_data = {
                    result: {
                        title: data.data.title,
                        description: data.data.desc,
                        image: imgbase64
                    }
                };
                return url_data
            } catch (error) {
                return false
            }
        }
    }
    const url_data = await ogs(url)
    return url_data
}


function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

// thanks @xh321 https://github.com/xh321/LiteLoaderQQNT-QR-Decode
async function decodeQR(image) {
    // 调用草料二维码API
    return await fetch("https://qrdetector-api.cli.im/v1/detect_binary", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183"
        },
        body: `image_data=${getBase64Image(image)}&remove_background=0`
    })
        .then((res) => res.json())
        .then((json) => {
            if (json.status == 1) {
                return json.data.qrcode_content;
            } else {
                return json.message;
            }
        });
}

/**
 * 将十六进制颜色转换为 HSL 格式
 * @param {string} hexColor 
 * @returns 
 */
function hexToHSL(hexColor) {
    let r = parseInt(hexColor.substring(1, 3), 16) / 255;
    let g = parseInt(hexColor.substring(3, 5), 16) / 255;
    let b = parseInt(hexColor.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let delta = max - min;

    let h, s, l;

    if (delta === 0) {
        h = 0;
    } else if (max === r) {
        h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
        h = 60 * (((b - r) / delta) + 2);
    } else {
        h = 60 * (((r - g) / delta) + 4);
    }

    l = (max + min) / 2;

    if (delta === 0) {
        s = 0;
    } else {
        s = delta / (1 - Math.abs(2 * l - 1));
    }

    return [h, s*100, l*100];
}

export {
    output,
    check_only_img,
    get_link_data,
    decodeQR,
    hexToHSL
}