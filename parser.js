

async function GetData() {
    const puppeteer = require('puppeteer');
    //console.log(arg)
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://escapefromtarkov.fandom.com/wiki/Special:Search?query=&scope=internal&navigationSearch=true')
        await page.waitForSelector('input[name=query]');
        console.log("page 1 Loaded")
        await page.$eval('input[name=query]', el => el.value = 'slick');
        await page.$eval('button[type="submit"]', e => e.click());
        await page.waitForSelector('article');
        console.log("Page 2 Loaded")
        await page.evaluate(() => document.querySelector('article > h1 > a').click());
        await page.waitForSelector('table#va-infobox0');
        console.log("Page 3 Loaded")
        const data = await page.evaluate(() => Array.from(document.querySelectorAll('table#va-infobox0 tbody tr td.va-infobox-content, table#va-infobox0 tbody tr td.va-infobox-label'), e => e.innerText));
        await browser.close();
        console.log("Récupération des données réussie");
        return data
    }
    catch (error) {
        console.error(error)
    }



}


async function Display(arg) {
    let elements = await GetData()
    let count = 0
    let Dataset = []


    for (let i = 0; i <= elements.length; i++) {

    }

    let Data = {
        caliber: '',
        name: '',
        damage: '',
        PP: '',
        AD: '',
        Accuracy: '',
        Recoil: '',
        FChance: '',
        L: '',
        H: '',
        P1: '',
        P2: '',
        P3: '',
        P4: '',
        P5: '',
        P6: '',
    }

    let match = []
    match.push(0)
    match.push(Data)


    elements.forEach(element => {

        let ammo = element;
        let meta = JSON.stringify(ammo)
        let array = String(meta).replace(/\\t/g, '$')
        let metadata = array.split('$')
        let name = metadata[0].toString().replace('\"', '')
        name = name.split(' ').join('')


        count = 0

        for (let i in arg) {

            metadata[0].toLowerCase().includes(arg[i].toLowerCase()) ? count++ : false;

        }

        if (count > match[0]) {

            count = 0


            Data = {
                caliber: metadata[0],
                name: name,
                damage: metadata[1],
                PP: metadata[2],
                AD: metadata[3],
                Accuracy: metadata[4],
                Recoil: metadata[5],
                FChance: metadata[6],
                L: metadata[7],
                H: metadata[8],
                P1: metadata[9],
                P2: metadata[10],
                P3: metadata[11],
                P4: metadata[12],
                P5: metadata[13],
                P6: metadata[14],



            }
            Dataset.push(Data)
            match[1] = metadata

        }
    });



    return Dataset

}

async function Find() {
    // arg = arg.replaceAll('&', ' ').toLowerCase()
    //console.log(arg)
    let Dataset = [];
    var labels = [];
    var values = [];
    var object = {};

    try {
        Dataset = await GetData();
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





async function GetScreenshot() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/5/55/CustomsLargeExpansionGloryMonki.png/revision/latest?cb=20210224211032')
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    const data = await page.screenshot({ path: 'screenshot.png' })
    browser.close();
    return data
}


Find('slick')
