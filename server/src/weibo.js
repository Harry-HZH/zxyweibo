
module.exports = (options) => {
  const puppeteer = require('puppeteer');

  let data = (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://s.weibo.com/top/summary?Refer=top_hot&topnav=1&wvr=6');
    let res = await page.$$eval('#pl_top_realtimehot > table > tbody > tr:nth-child(n)', el => {
      let arr = []
      for (let key in el) {
        let obj = {}
        obj.url = el[key].children[1].children[0].href
        obj.name = el[key].children[1].children[0].innerHTML
        obj.rank = key
        obj.count = el[key].children[1].children[0].nextElementSibling !== null
          ? el[key].children[1].children[0].nextElementSibling.innerHTML : '0'
        arr.push(obj)
      }
      return arr
    });
    await browser.close();
    return res
  })()
  return data
}