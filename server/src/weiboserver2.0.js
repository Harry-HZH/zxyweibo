const puppeteer = require('puppeteer');
const HotSearch = require('../models/HotSearch')
const mongoose = require('mongoose')
require('../plugins/db')();
const { Worker, isMainThread, parentPort } = require('worker_threads');


async function getSearch() {
    require('../plugins/db')();
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await Promise.all([
        page.goto('https://s.weibo.com/top/summary?Refer=top_hot&topnav=1&wvr=6'),
        page.waitForNavigation(),
    ]);
    let res = await page.$$eval('#pl_top_realtimehot > table > tbody > tr:nth-child(n)', el => {
        let arr = []
        for (let key in el) {
            let obj = {}
            obj.url = el[key].children[1].children[0].href
            obj.name = el[key].children[1].children[0].innerHTML
            obj.rank = Number(key)
            obj.count = Number(el[key].children[1].children[0].nextElementSibling !== null
                ? el[key].children[1].children[0].nextElementSibling.innerHTML : '0')
            arr.push(obj)
        }
        return arr
    });
    for (let item in res) {
        await HotSearch.create(res[item])
    }
    await page.close()
    await browser.close();
    await console.log("browser close");
    await mongoose.connection.close()
}
getSearch()
setInterval(getSearch, 10000)

// (async () => {
//     if(parentPort.on('message')==="0"){
//         console.log('退出');
//         process.exit()
//     }
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.goto('https://s.weibo.com/top/summary?Refer=top_hot&topnav=1&wvr=6');
//     let res = await page.$$eval('#pl_top_realtimehot > table > tbody > tr:nth-child(n)', el => {
//         let arr = []
//         for (let key in el) {
//             let obj = {}
//             obj.url = el[key].children[1].children[0].href
//             obj.name = el[key].children[1].children[0].innerHTML
//             obj.rank = Number(key)
//             obj.count = Number(el[key].children[1].children[0].nextElementSibling !== null
//                 ? el[key].children[1].children[0].nextElementSibling.innerHTML : '0')
//             arr.push(obj)
//         }
//         return arr
//     });
//     console.log(res);
//     for (let item in res) {
//         await HotSearch.create(res[item])
//     }
//     await page.close()
//     await browser.close();
//     mongoose.connection.close()
//     process.exit()
//     console.log('我退出了没');
// })()