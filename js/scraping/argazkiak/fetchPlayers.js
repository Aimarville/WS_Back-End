//jq -er '.[]' .\json\solution25.json | Sort-Object {[int]$_} -Unique | Set-Content -Encoding utf8 .\js\scraping\argazkiak\playerIDs.txt
const path = require('path');
const fsP = require('fs/promises');
const fs = require('fs');
const fetch = require('node-fetch');

const writepath = path.join(__dirname, '../../../public/images/players');
const MAX_REQUEST = 10;

async function main() {
    try {
        // create directoy
        await fsP.mkdir(writepath, { recursive: true });

        // read leagues file into an array of lines
        const content = await fsP.readFile(path.join(__dirname, "playerIDs.txt"), "utf8");
        const data = content.split("\r\n")
                    .map(p => p.replace(/^\uFEFF/, '').trim())
                    .filter(Boolean);
                    //.slice(0, 600); //limitar el numero de descarga para menor espera

        let index = 0;
        let activeRequests = 0;

        const interval = setInterval(() => {
            for (let i = 0; i < MAX_REQUEST; i++) {
                if (index >= data.length) {
                    if (activeRequests === 0) {
                        clearInterval(interval);
                        console.log('Deskarga bukatua');
                    }
                    return;
                }

                const player = data[index++];
                const e1 = player % 32;
                const url = `https://playfootball.games/media/players/${e1}/${player}.png`

                activeRequests++;

                fetch(url)
                    .then(res => {
                        // check status
                        if (res.status === 200) {
                            const fileStream = fs.createWriteStream(path.join(writepath, `${player}.png`));
                            res.body.pipe(fileStream);
                        } else {
                            console.log(player);
                            console.log(`status: ${res.status} player: ${player} not found`)
                        }
                    })
                    .catch(err => console.log(err))
                    .finally(() => activeRequests--);
            }
        }, 1000);
    } catch (err) {
        console.error(err);
    }
}

main();