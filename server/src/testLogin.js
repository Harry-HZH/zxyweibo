
module.exports = (options) => {
    const puppeteer = require('puppeteer');
    const path = require('path');

    return (async () => {
        const browser = await puppeteer.launch({ userDataDir: path.resolve(__dirname, './myUserData') ,headless:false});
        let page = await browser.newPage();
        await page.goto('https://s.weibo.com/weibo?q=%23%E7%BD%91%E7%BB%9C%E4%B8%BB%E6%92%AD%E5%90%83%E6%92%AD%E8%B1%A1%E7%BE%A4%E5%90%83%E5%89%A9%E7%9A%84%E8%8F%A0%E8%90%9D%23&Refer=top',
            {
                timeout: 120000,
                waitUntil: 'load',
            });
        let btn = await page.$('#pl_feedlist_index > div:nth-child(1) > div:nth-child(2) > div.card > div.card-act > ul > li:nth-child(3) > a')
        await btn.click()
        let flag = true


        if (await page.$('#weibo_top_public > div > div > div.gn_position > div.gn_login > ul > li:nth-child(3) > a')) {
            flag = false
        }
        await page.close()
        await browser.close();
        return flag
    })()
}

// (async () => {
//     const browser = await puppeteer.launch({ headless: false, userDataDir: path.resolve(__dirname, './myUserData') });
//     let page = await browser.newPage();
//     await page.goto('https://s.weibo.com/weibo?q=%23%E7%BD%91%E7%BB%9C%E4%B8%BB%E6%92%AD%E5%90%83%E6%92%AD%E8%B1%A1%E7%BE%A4%E5%90%83%E5%89%A9%E7%9A%84%E8%8F%A0%E8%90%9D%23&Refer=top');
//     let btn = await page.$('#pl_feedlist_index > div:nth-child(1) > div:nth-child(2) > div.card > div.card-act > ul > li:nth-child(3) > a')
//     await btn.click()
//     await page.waitFor(500)
//     let flag = true


//     if (await page.$('#weibo_top_public > div > div > div.gn_position > div.gn_login > ul > li:nth-child(3) > a')) {
//         flag = false
//     }
//     await page.close()
//     await browser.close();
//     return flag
// })()