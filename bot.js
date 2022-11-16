const Discord = require('discord.js')
const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs')
const client = new Discord.Client()
const { MessageEmbed } = require('discord.js');
const { func } = require('joi');
client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
})

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = "ODA3MzkzOTc2NDYxNjg4ODY1.YB3WPA.UQ00vGr350f6aHZSQdX6V56hGWE"

client.login(bot_secret_token)



client.on('message', message => {

    let cmd = message.content.split(' ')[0].slice(1);
    let args = message.content.replace('.' + cmd, '').trim();


    switch (cmd) {

        case 'info':
            message.reply('je peux utiliser les commandes suivantes : \n .random pour choisir un jeu sans ce faire chier. \n .bedwars a utiliser pour les équipes');

            break;

        case 'random':

            message.reply('Entre combiens de jeux hésitez vous ?');

            message.channel.awaitMessages(m => m.author.id == message.author.id,

                { max: 1, time: 30000 }).then(collected => {

                    y = collected.first().content.toLowerCase();
                    message.reply('ok');
                    p = Math.floor(Math.random() * Math.floor(y));
                    message.reply('quels sont les ' + y + ' jeu(x) entre lesquels vous hésitez ?').then(() => {

                        message.channel.awaitMessages(m => m.author.id == message.author.id,
                            { max: y, time: 30000 }).then(game => {



                                var iterator = game.values();
                                const array = []

                                for (let elements of iterator) {

                                    array.push(elements);

                                }
                                console.log(array);
                                message.reply('le jeu séléctioné est : ');
                                message.reply(array[p])


                            });
                    });


                });
            break;

        case 'bedwars':

            message.reply('Quels sont les 6 participants ?');

            message.channel.awaitMessages(m => m.author.id == message.author.id,
                { max: 6, time: 30000 }).then(choosenames => {
                    var foo = choosenames.values();
                    message.reply('les noms sont bien enregistrés');
                    const table = [];
                    const equipe1 = [];
                    const equipe2 = [];
                    const equipe3 = [];
                    const verif = [];

                    function shuffle(array) {
                        table.sort(() => Math.random() - 0.5);
                    }

                    for (let elements of foo) {
                        table.push(elements);
                    }
                    shuffle(table);
                    for (let k = 0; k <= 5; k++) {



                        if (!equipe1.includes(table[k]) && equipe1.length != 2) {
                            equipe1.push(table[k]);


                        } else if (!equipe2.includes(table[k]) && equipe2.length != 2) {
                            equipe2.push(table[k]);


                        } else {
                            equipe3.push(table[k]);


                        }





                    }

                    message.reply('equipe 1 :');
                    message.reply(equipe1[0]);
                    message.reply(equipe1[1]);

                    message.reply('equipe 2 :');
                    message.reply(equipe2[0]);
                    message.reply(equipe2[1]);

                    message.reply('equipe 3 :');
                    message.reply(equipe3[0]);
                    message.reply(equipe3[1]);
                });
            break;




    };
});


//----------------------------------------------------------------COMMANDS FOR TARKOV-------------------------------//



var prefix = '!'

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();


    switch (command) {
        case 'find':
            let arg = args.join(' ')
            console.log(arg)
            Sort(arg);
            break;

        case 'douannes':
            GetScreenshot(1);
            break;

        case 'echangeur':
            GetScreenshot(2);
            break;

        case 'wood':
            GetScreenshot(3);
            break;

        case 'lab':
            GetScreenshot(4);
            break;

        case 'mili':
            GetScreenshot(5);
            break;

        case 'litoral':
            GetScreenshot(6);
            break;

    }

    async function Sort(arg) {
        const embed = new MessageEmbed()
        


        let data = await GetData(arg, embed)

        let counter = 0;
        let title = [];
        let values = [];

       

       

        data.forEach(element => {

            console.log(String(element))
            if (counter % 2 == 0) {
                title.push(element)
                counter++
            }
            else {
                values.push(element)
                counter++
            }
        })
        console.log(title)
        console.log(values)

        var line;
        
        for (let i = 0; i < title.length; i++) {
            if (i%3 == 0) {
                line = false
            }
            else{
                line = true
            }
            embed.addField(name = title[i], value = values[i], inline = line )
        }


        message.channel.send(embed)



    }


    async function GetData(arg, embed) {

        let input = String(arg);
        const customargs = [
            `--start-maximized`
        ]
        const browser = await puppeteer.launch({ headless: true, args: customargs, });
        const page = await browser.newPage();
        try{
            await page.goto('https://escapefromtarkov.fandom.com/wiki/Special:Search?fulltext=1&query=&scope=internal&contentType=&ns%5B0%5D=0')
            await page.waitForSelector('input[name=query]');
            console.log("page 1 Loaded")
            message.channel.send('Chargement...')
        }catch(e){
            message.channel.send('erreur lors du chargement des pages')
        }
        
        try{
            await page.$eval('input[name=query]', (el, input) => el.value = input, input);
            await page.$eval('button[type="submit"]', e => e.click());
            await page.waitForSelector('article');
            console.log("Page 2 Loaded")
            message.channel.send('Recherche...')
        }
        catch(e){
            message.channel.send('erreur lors du traitement de la recherche')
        }
        
     try{

        await page.evaluate(() => document.querySelector('article > h3 > a').click());
        await page.waitForSelector('table#va-infobox0');
        console.log("Page 3 Loaded");
        message.channel.send('Traitement...')

     }catch(e){
         message.channel.send('erreur lors du traitement des données')
     }
 

        

        const data = await page.evaluate(() => Array.from(document.querySelectorAll('table#va-infobox0 tbody tr td.va-infobox-content, table#va-infobox0 tbody tr td.va-infobox-label'), e => e.innerText));
        console.log("Récupération des données réussie");

        const title = await page.evaluate(() => document.querySelector('#firstHeading').innerText)
        embed.setTitle(title);
        embed.setURL(page.url());
        embed.setColor('#0099ff');

        try {
            await page.waitForSelector('#va-infobox0 > tbody > tr.va-infobox-row-mainimage')
            var imageLink;
            if (await page.$('#va-infobox0 > tbody > tr.va-infobox-row-mainimage > td > div > table.va-infobox-mainimage-cont > tbody > tr > td.va-infobox-mainimage-cont > table > tbody > tr > td > a > img') !== null){
                imageLink = await page.evaluate(() => document.querySelector('#va-infobox0 > tbody > tr.va-infobox-row-mainimage > td > div > table.va-infobox-mainimage-cont > tbody > tr > td.va-infobox-mainimage-cont > table > tbody > tr > td > a > img').getAttribute('src'))
            }
            else if (await page.$('#va-infobox0 > tbody > tr.va-infobox-row-mainimage > td > table > tbody > tr > td.va-infobox-mainimage-cont > table > tbody > tr > td > a > img') !== null){
                imageLink = await page.evaluate(() => document.querySelector('#va-infobox0 > tbody > tr.va-infobox-row-mainimage > td > table > tbody > tr > td.va-infobox-mainimage-cont > table > tbody > tr > td > a > img').getAttribute('src'))
            }

            else{
                
                message.channel.send('Photo introuvable')
            }
               
        }

        catch (e) {  
            message.channel.send("Erreur lors de la récupération de l'image") 
        }   
        finally{
            if(imageLink == null){
                imageLink = 'https://i.stack.imgur.com/mwFzF.png'
            }
            await page.goto(imageLink)
            await page.waitForSelector('body > img')
            const img = await page.$('body > img')
            await img.screenshot({path: 'image.png'})
        } 
            
            
            
        const img = new Discord.MessageAttachment('image.png')
        embed.attachFiles(img);
        embed.setImage('attachment://image.png')

        
        return data
    }








    async function GetScreenshot(number) {
        let msg = ""
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        });
        switch (number) {
            case 1:
                await page.goto('https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/5/55/CustomsLargeExpansionGloryMonki.png/revision/latest?cb=20210224211032')
                await page.screenshot({ path: 'douannes.png' })
                msg = "./douannes.png"
                break;

            case 2:
                await page.goto('https://tarkov-tools.com/maps/interchange.jpg')
                await page.screenshot({ path: 'echangeur.png' })
                msg = "./echangeur.png"
                break;

            case 3:
                await page.goto('https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/0/05/Glory4lyfeWoods_map_v4_marked.png/revision/latest?cb=20210221204359')
                await page.screenshot({ path: 'wood.png' })
                msg = "./wood.png"
                break;

            case 4:
                await page.goto('https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/d/d7/The_Lab_Map_%28EN%29.png/revision/latest?cb=20200329133328')
                await page.screenshot({ path: 'lab.png' })
                msg = "./lab.png"
                break;

            case 5:
                await page.goto('https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/4/42/3D_Map_by_loweffortsaltbox.png/revision/latest?cb=20200410160036')
                await page.screenshot({ path: 'mili.png' })
                msg = "./mili.png"
                break;

            case 6:
                await page.goto('https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/e/e1/Actual_caches_37_map_shoreline.jpg/revision/latest?cb=20200105023458')
                await page.screenshot({ path: 'litoral.png' })
                msg = "./litoral.png"
                break;
        }
        browser.close();
        message.channel.send('Voici la map demandée :', {
            files: [msg]
        });
    }
})



