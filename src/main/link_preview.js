/*
 * @Date: 2024-02-03 16:15:39
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-02-03 20:46:48
 */
const axios = require('axios');
const iconv = require('iconv-lite');

async function getHtml(url) {
    let decodedHtml = '';
    await axios({
        method: 'get',
        url: url,
        responseType: 'arraybuffer', // 设置响应类型为二进制数据
        })
        .then(response => {
            const charType = response.headers['content-type'].match(/charset=(.*)/)[1];
            // 将二进制数据转换为指定编码格式的字符串
            decodedHtml = iconv.decode(response.data, charType);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });
    // console.log(decodedHtml);
    const headContent = decodedHtml.match(/<head([\s\S]*?)\/head>/i)[1];
    // console.log(headContent);
    return headContent;
}

async function getLinkPreview(url) {
    const data = {};
    const headContent = await getHtml(url);
    /**
     * @type {string[]} meta信息
     */
    const metaMatches = headContent.match(/[<meta[\s\S]*?>|<title(.*)\/title>]/ig);
    console.timeLog('headContent')
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