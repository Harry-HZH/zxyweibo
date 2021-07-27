const { find } = require('../../models/HotSearch');

module.exports = app => {
  const express = require('express')
  const path = require('path');
  const HotSearch = require('../../models/HotSearch')
  const nodejieba = require("nodejieba");
  const dayjs = require('dayjs')
  const utc = require('dayjs/plugin/utc') // dependent on utc plugin
  const timezone = require('dayjs/plugin/timezone')
  nodejieba.load({
    stopWordDict: path.resolve(__dirname, '../../src/jiebaStopWordDict/stopWordDict.utf8'),
  })
  const {
    Worker,
    MessageChannel,
    MessagePort,
    isMainThread,
    parentPort
  } = require('worker_threads');
  let worker

  const router = express.Router({
    // mergeParams: true
  })
  router.get('/', async (req, res) => {
    // const weibo = require('../../src/weibo')
    // const model = await weibo()
    // console.log(model);
    // for (let item in model) {
    //   await HotSearch.create(model[item])
    // }
    res.send('ok13')
  })

  router.get('/testLogin', async (req, res) => {
    console.log('ok');
    const testLogin = await require('../../src/testLogin')()
    console.log(testLogin);
    res.send(testLogin)
  })


  router.post('/getPastHotMapData', async (req, res) => {
    const model = await HotSearch.find({name:req.body.name}).select('name count created_at')
    res.send(model)

  })
  router.post('/getPastHotArticle', async (req, res) => {
    const url = req.body.url
    console.log(url);
    if (url === 'javascript:void(0);') {
      res.send('此为微博广告，无法爬取')
      return
    }
    const model = await require('../../src/weibocomment')(url)
    await console.log(model);

    let dataMap = await model.reduce((prev, now, index, self) => {
      var topN = 4;
      let jiebaArr = nodejieba.extract(now.content, topN);//对model数组当前项进行分词
      jiebaArr = jiebaArr.map(el => el.word)
      for (let key of jiebaArr) {
        if (prev.has(key)) {
          let value = prev.get(key)
          prev.set(key, Math.ceil(value + now.dianzan / 10 + 50))//更新Map的值
        } else {
          prev.set(key, Math.ceil(now.dianzan / 10 + 50)) //map key为jieba分词的某一项，值为now数组当前项的dianzan（权重）
        }
      }
      return prev
    }, new Map())
    let dataArr = []
    for (let [key, value] of dataMap) {
      dataArr.push({ name: key, value: value })
    }
    console.log(dataArr);
    res.send({ model: model, dataArr: dataArr })

  })

  router.get('/getCurrentHotData', async (req, res) => {
    console.log('getCurrentHotData');
    const model = await require('../../src/weibo')()
    console.log(model);
    for (let item in model) {
      await HotSearch.create(model[item])
    }
    res.send(model)
  })

  router.get('/getPastHotSearch', async (req, res) => {
    const body = req.query
    const reg = new RegExp(body.content, 'i')
    body.date[1] = dayjs(body.date[1]).add(1, 'day').format()
    const query = HotSearch.find({
      $and: [
        { created_at: { $gte: body.date[0] || 0, $lt: body.date[1] || Date.now() } },
        { name: { $regex: reg } },

      ]
    })
    let model = await query.select('name url')
    let obj = {}
    model = model.reduce((cur, next) => {
      if (!obj[next.name]) {
        obj[next.name] = cur.push(next)
      }
      return cur
    }, [])

    console.log(model.length)
    res.send(model)
  })

  router.get('/openSearch', async (req, res) => {
    if (worker) {
      worker.terminate()
      console.log("我停止了");
      worker = null
    }

    if (isMainThread) {
      worker = new Worker(path.resolve(__dirname, '../../src/weiboserver2.0.js'));
    } else {
      console.log('在工作线程中');
      console.log(isMainThread);
    }
    res.send('开启爬取线程')
  })

  router.get('/closeSearch', async (req, res) => {
    if (worker) {
      worker.terminate()
      console.log("我停止了");
      worker = null
    }
    res.send("关闭爬取线程")
  })

  router.get('/isSearch', async (req, res) => {
    if (worker) {
      res.send(true)
    } else {
      res.send(false)
    }
  })

  router.get('/reLogin', async (req, res) => {
    console.log('okreLogin');
    await require('../../src/reLogin')()
    const testLogin = await require('../../src/testLogin')()
    res.send(testLogin)
  })
  app.use('/admin/api', router)

}