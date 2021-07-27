module.exports = async (newpage) => {
    let page = newpage
    await console.log('ok');
    await page.waitForSelector('div.item.username.input_wrap > input')
    await page.evaluate(async () => {
        const username = document.querySelector('div.item.username.input_wrap > input');
        username.value = '18918102262'
    })
    await page.evaluate(async () => {
        const password = document.querySelector('div.item.password.input_wrap > input');
        password.value = 'zxc569nuq'
    })

    let btn = await page.$('div.layer_login_register_v2.clearfix > div:nth-child(3) > div:nth-child(6) > a')
    await Promise.all([
        btn.click(),
        page.waitForNavigation(),
    ]);

    btn = await page.$('#dmCheck')
    await btn.click()
    btn = await page.$('#send_dm_btn')
    await Promise.all([
        btn.click(),
        page.waitForNavigation(),
    ]);
    return page
}