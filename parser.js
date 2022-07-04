const puppeteer = require('puppeteer');


async function GetData(arg) {
    let input = String(arg);
    const customargs = [
        `--start-maximized`
    ]
    try {
        const browser = await puppeteer.launch({ headless: false, args: customargs,});
        const page = await browser.newPage();
        await page.goto('https://escapefromtarkov.fandom.com/wiki/Special:Search?fulltext=1&query=&scope=internal&contentType=&ns%5B0%5D=0')
        await page.waitForSelector('input[name=query]');
        console.log("page 1 Loaded")
        await page.$eval('input[name=query]', (el, input) => el.value = input, input);
        await page.$eval('button[type="submit"]', e => e.click());
        await page.waitForSelector('article');
        console.log("Page 2 Loaded")
        await page.evaluate(() => document.querySelector('article > h3 > a').click());
        await page.waitForSelector('table#va-infobox0');
        console.log("Page 3 Loaded");
        try {
            await page.evaluate(() => document.querySelector('body > div:nth-child(11) > div > div > div._1r08nyekFdI7_2d8r3AIBf > div.NN0_TB_DIsNmMHgJWgT7U.XHcr6qf5Sub2F2zBJ53S_').click());
        } catch (e) { }
        await page.waitForSelector('#va-infobox0 > tbody > tr.va-infobox-row-mainimage > td')
        const element = await page.$('#va-infobox0 > tbody > tr.va-infobox-row-mainimage > td')
        await element.screenshot({ path: 'screenshot.png' })
        const data = await page.evaluate(() => Array.from(document.querySelectorAll('table#va-infobox0 tbody tr td.va-infobox-content, table#va-infobox0 tbody tr td.va-infobox-label'), e => e.innerText));
        console.log("Récupération des données réussie");
        browser.close();
        return data
    }
    catch (error) {
        console.error(error)
    }



}


async function Sort(data){

}

async function Find(search) {
    let arg = String(search.replaceAll('&', ' ').toLowerCase())
    console.log(arg)
    let Dataset = [];
    var labels = [];
    var values = [];
    var object = {};

    try {
        Dataset = await GetData(arg);
    } catch (error) {
        console.log("données non transmises");
    }
    finally {
        for (let i = 0; i <= Dataset.length; i++) {
            if (i % 2 == 0) {
                if (typeof Dataset[i] == 'undefined') {

                }
                else {
                    labels.push(Dataset[i]);
                }

            }
            else {
                values.push(Dataset[i]);
            }

        }



        for (let x = 0; x < labels.length; x++) {
            object[labels[x].toString()] = values[x].toString()
        }

        let meta = []
        meta.push(object)
        console.log(meta)
    }

}


Find('vog')
