
const puppeteer = require('puppeteer');
let arg = "LPSgzh"
url = 'https://escapefromtarkov.fandom.com/wiki/Ballistics'
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    const elements = await page.evaluate(() => Array.from(document.querySelectorAll('tbody > tr'), e => e.innerText));
 

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
        H: '' ,
        P1: '',
        P2: '',
        P3: '',
        P4: '',
        P5: '',
        P6: '',
    }

    let i = 0
 
    elements.forEach(element =>{
        
        let ammo = element;
        let meta = JSON.stringify(ammo)
        let array = String(meta).replace(/\\t/g, '$')
        let metadata = array.split('$')
        let name = metadata[0].toString().replace('\"','')
        name = name.split(' ').join('')
        
        
        if (name.includes(arg))
        {
           console.log(metadata)
           Data = metadata[i]
        }
        i++
       
    });
    
    browser.close();

    console.log(Data)

});



