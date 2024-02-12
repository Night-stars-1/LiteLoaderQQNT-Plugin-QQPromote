/*
 * @Date: 2024-02-03 16:15:39
* LastEditors: Night-stars-1 nujj1042633805@gmail.com
* LastEditTime: 2024-02-12 16:06:07
 */
const axios = require('axios');
const iconv = require('iconv-lite');

async function getHtml(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    let u8Array = ["utf8", "UTF8", "utf-8", "UTF-8"];
    let charType = 'utf-8';
    let htmlData = response.data.toString();
    let headContent = htmlData.match(/<head([\s\S]*?)\/head>/i)[0];
    if (response.headers['content-type'].includes('charset')) {
        charType = response.headers['content-type'].match(/charset=(.*)/i)[1];
    } else if (headContent.includes('charset=')) {
        charType = headContent.match(/charset="(.*)"/i)[1];
    }
    if (charType !== "utf-8" && u8Array.indexOf(charType) == -1 && iconv.encodingExists(charType)) {
        headContent = iconv.decode(response.data, charType).match(/<head([\s\S]*?)\/head>/i)[0];
    }
    return headContent;
}

async function getLinkPreview(url) {
    const data = {};
    const headContent = await getHtml(url);
    /**
     * @type {string[]} meta信息
     */
    const metaMatches = headContent.match(/[<meta[\s\S]*?>|<title(.*)\/title>]/ig);
    metaMatches.forEach(element => {
        element.includes('</title>') && (data.title = element.match(/[<title>]?(.*)<\/title>/)[1])
            || element.includes('property="og:title"') && (data.title = element.match(/content="([\s\S]*)"/)[1])
        element.includes('name="description"') && (data.description = element.match(/content="([\s\S]*)"/)[1])
            || element.includes('property="og:description"') && (data.description = element.match(/content="([\s\S]*)"/)[1])
        element.includes('name="image"') && (data.image = element.match(/content="([\s\S]*)"/)[1])
            || element.includes('property="og:image"') && (data.image = element.match(/content="([\s\S]*)"/)[1])
    });
    data?.image?.startsWith('//') && (data.image = 'https:' + data.image);
    return data;
}

module.exports = {
    getLinkPreview,
}