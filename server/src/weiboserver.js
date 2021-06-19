const puppeteer = require('puppeteer');
const HotSearch = require('../models/HotSearch')
const mongoose = require('mongoose')
require('../plugins/db')();

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://s.weibo.com/top/summary?Refer=top_hot&topnav=1&wvr=6');
    let res = await page.$$eval('#pl_top_realtimehot > table > tbody > tr:nth-child(n)', el => {
        let arr = []
        for (let key in el) {
            let obj = {}
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
    mongoose.connection.close()
})()