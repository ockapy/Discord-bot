
const puppeteer = require('puppeteer');
let arg = ".300"
url = 'https://escapefromtarkov.fandom.com/wiki/Ballistics'



let count = 0


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

let Dataset = []
let finalData = []




puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    const elements = await page.evaluate(() => Array.from(document.querySelectorAll('#trkballtable > tbody > tr'), e => e.innerText));


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

    browser.close();

    let searchOK = false

    Dataset.forEach(element => {

       

        if (element.name.toLowerCase().includes(arg)) {
            finalData.push(element)
            searchOK = true

        }
    });

    if (searchOK == true) {
        return console.log(finalData)
    }
    else {
        Dataset.forEach(element =>{
            console.log(element.name)
        })
        
    }

});




