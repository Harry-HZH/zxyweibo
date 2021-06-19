const puppeteer = require('puppeteer');
// const HotSearch = require('../models/HotSearch')
// const mongoose = require('mongoose')
const path = require('path');
// require('../plugins/db')();
(async () => {
    let lastarr = []
    const browser = await puppeteer.launch({ headless: false, userDataDir: path.resolve(__dirname, './myUserData') });
    let page = await browser.newPage();
    await page.goto('https://s.weibo.com/weibo?q=%23%E7%BD%91%E7%BB%9C%E4%B8%BB%E6%92%AD%E5%90%83%E6%92%AD%E8%B1%A1%E7%BE%A4%E5%90%83%E5%89%A9%E7%9A%84%E8%8F%A0%E8%90%9D%23&Refer=top',
        {
            timeout: 120000,
            waitUntil: 'load',
        });
    let btn = await page.$('#pl_feedlist_index > div:nth-child(1) > div:nth-child(2) > div.card > div.card-act > ul > li:nth-child(3) > a')
    await btn.click()
    if (await page.$('#weibo_top_public > div > div > div.gn_position > div.gn_login > ul > li:nth-child(3) > a')) {
        page = await require('./login')(page)
    }
    await console.log('开始爬取');
    // let news = []
    // let newsinfo = await page.$$eval('.card-feed .content .info .name', el => {
    //     let arr = []
    //     for (let key in el) {
    //         arr.push(el[key].innerHTML)
    //     }
    //     return arr
    // })
    let content = await page.$$eval('.m-wrap .m-con-l .card-wrap .card .card-feed .txt', el => {
        let arr = []
        for (let key in el) {
            if (el[key].hasAttribute('node-type')) {

                if (el[key].getAttribute('node-type') === 'feed_list_content_full') {
                    if (el[key].parentElement.getAttribute('node-type') === 'feed_list_forwardContent') {
                        continue
                    }
                    let str = el[key].innerText
                    let str1 = str.replace(/\s*/g, "")
                    let obj = {}
                    str1 = str1.replace('收起全文d', '')
                    obj.nickname = el[key].getAttribute('nick-name')
                    obj.content = str1
                    obj.time = el[key].parentNode.lastElementChild.children[0].innerText.slice(0, 12)
                    obj.from = (el[key].parentNode.lastElementChild.children[0].nextElementSibling !== null ? el[key].parentNode.lastElementChild.children[0].nextElementSibling.innerText : 'unknown')
                    obj.dianzan = Number(el[key].parentNode.parentNode.nextElementSibling.children[0].lastElementChild.innerText || 0)
                    arr.push(obj)
                } else if (el[key].getAttribute('node-type') === 'feed_list_content') {
                    if (el[key].parentElement.getAttribute('node-type') === 'feed_list_forwardContent') {
                        continue
                    }
                    if (el[key].nextElementSibling) {
                        if (el[key].nextElementSibling.hasAttribute('node-type')) {
                            continue
                        }
                    } else {
                        let str = el[key].innerText
                        let str1 = str.replace(/\s*/g, "")
                        let obj = {}
                        str1 = str1.replace('收起全文d', '')
                        obj.nickname = el[key].getAttribute('nick-name')
                        obj.content = str1
                        arr.push(obj)
                    }
                }
            }

        }
        return arr
    })
    lastarr = lastarr.concat(content)
    let length = await page.$eval('#pl_feedlist_index > div.m-page > div > span > ul', el => {
        return el.lastElementChild.innerText.replace(/[^0-9]/ig, "")
    })
    await page.close()
    for (let i = 2; i <= length; i++) {
        let page = await browser.newPage();
        let url = 'https://s.weibo.com/weibo?q=%23%E7%BD%91%E7%BB%9C%E4%B8%BB%E6%92%AD%E5%90%83%E6%92%AD%E8%B1%A1%E7%BE%A4%E5%90%83%E5%89%A9%E7%9A%84%E8%8F%A0%E8%90%9D%23&Refer=top' + `&page=${i}`
        await page.goto(url,
            {
                timeout: 120000,
                waitUntil: 'load',
            });
        let content = await page.$$eval('.m-wrap .m-con-l .card-wrap .card .card-feed .txt', el => {
            let arr = []
            for (let key in el) {
                if (el[key].hasAttribute('node-type')) {

                    if (el[key].getAttribute('node-type') === 'feed_list_content_full') {
                        if (el[key].parentElement.getAttribute('node-type') === 'feed_list_forwardContent') {
                            continue
                        }
                        let str = el[key].innerText
                        let str1 = str.replace(/\s*/g, "")
                        let obj = {}
                        str1 = str1.replace('收起全文d', '')
                        obj.nickname = el[key].getAttribute('nick-name')
                        obj.content = str1
                        obj.time = el[key].parentNode.lastElementChild.children[0].innerText.slice(0, 12)
                        obj.from = (el[key].parentNode.lastElementChild.children[0].nextElementSibling !== null ? el[key].parentNode.lastElementChild.children[0].nextElementSibling.innerText : 'unknown')
                        obj.dianzan = Number(el[key].parentNode.parentNode.nextElementSibling.children[0].lastElementChild.innerText || 0)
                        arr.push(obj)
                    } else if (el[key].getAttribute('node-type') === 'feed_list_content') {
                        if (el[key].parentElement.getAttribute('node-type') === 'feed_list_forwardContent') {
                            continue
                        }
                        if (el[key].nextElementSibling) {
                            if (el[key].nextElementSibling.hasAttribute('node-type')) {
                                continue
                            }
                        } else {
                            let str = el[key].innerText
                            let str1 = str.replace(/\s*/g, "")
                            let obj = {}
                            str1 = str1.replace('收起全文d', '')
                            obj.nickname = el[key].getAttribute('nick-name')
                            obj.content = str1
                            arr.push(obj)
                        }
                    }
                }

            }
            return arr
        })
        lastarr = lastarr.concat(content)
        await page.close()
    }
    await console.log(lastarr);
    await browser.close();
    // mongoose.connection.close()
})()