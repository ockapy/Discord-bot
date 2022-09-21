const Discord = require('discord.js')
const puppeteer = require('puppeteer');
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
            let arg = args.join('')
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
        let pp = []
        arg = arg.replaceAll(" ", '').toLowerCase()

        let Dataset = await Display(arg)
        let SortedData = []

        Dataset.forEach(value => {
            if (value.name.toLowerCase().includes(arg)) {
                SortedData.push(value)
            }
        });

        if (SortedData.length <= 0) {
            console.log("erreur munition inconnue")
        }

        if (SortedData.length != 1) {
            message.channel.send("Plusieurs munitions peuvent correspondre a votre recherche :")
            SortedData.forEach(ammunition => {
                pp = []
                pp.push(ammunition.P1, ammunition.P2, ammunition.P3, ammunition.P4, ammunition.P5, ammunition.P6)
                const Embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Tarkov wiki')
                    .setURL('https://escapefromtarkov.fandom.com/wiki/Ballistics')
                    .setDescription('The website for tarkov ballistics')
                    .addFields
                    (
                        { name: 'name', value: ammunition.caliber.replace('\"', ''), inline: false },
                        { name: 'Damage', value: ammunition.damage, inline: false },
                        { name: 'penetration power', value: pp, inline: true },

                    )

                message.channel.send(Embed)
            })
        }
        else {
            console.log("Voici la munition qui correspond a votre recherche :")
            console.log(SortedData[0])
            pp.push(SortedData[0].P1, SortedData[0].P2, SortedData[0].P3, SortedData[0].P4, SortedData[0].P5, SortedData[0].P6)
            const Embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Tarkov wiki')
                .setURL('https://escapefromtarkov.fandom.com/wiki/Ballistics')
                .setDescription('The website for tarkov ballistics')
                .addFields
                (
                    { name: 'name', value: SortedData[0].caliber.replace('\"', ''), inline: false },
                    { name: 'Damage', value: SortedData[0].damage, inline: false },
                    { name: 'penetration power', value: pp, inline: true },
                )

            message.channel.send(Embed)
        }

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



