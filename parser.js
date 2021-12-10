const puppeteer = require('puppeteer');

async function GetData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://escapefromtarkov.fandom.com/wiki/Ballistics')
    const data = await page.evaluate(() => Array.from(document.querySelectorAll('#trkballtable > tbody > tr'), e => e.innerText));
    browser.close();
    return data
}

async function Display(arg) {
    let elements = await GetData()
    let count = 0
    let Dataset = []
    

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

async function Sort(arg) {
    arg = arg.replaceAll(" ", '').toLowerCase()
    
    let Dataset = await Display(arg)
    let SortedData = []
    
    Dataset.forEach(value => {
        if(value.name.toLowerCase().includes(arg)){
            SortedData.push(value)  
        }
    });

    if(SortedData.length <= 0){
        console.log("erreur munition inconnue")
    }

    if(SortedData.length != 1){
        console.log("Plusieurs munitions peuvent correspondre a votre recherche :")
        SortedData.forEach(ammunition =>{
            console.log(ammunition.name)
        })
    }
    else{
        console.log("Voici la munition qui correspond a votre recherche :")
        console.log(SortedData[0])
    }

}


Sort("PRS gs S")


async function GetScreenshot(name) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/5/55/CustomsLargeExpansionGloryMonki.png/revision/latest?cb=20210224211032')
    await page.setViewport({
        width: 4096,
        height: 2160,
        deviceScaleFactor: 1,
      });
    const data = await page.screenshot({ path: 'screenshot.png'})
    browser.close();
    return data
}




GetScreenshot("Customs")