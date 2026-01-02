const path = require('path');
const fsP = require('fs/promises');
const fs = require('fs');
const fetch = require('node-fetch');

const writepath = path.join(__dirname, '../../../public/images/leagues');

async function main() {
    try {
        // create directoy
        await fsP.mkdir(writepath, { recursive: true });

        // read leagues file into an array of lines
        const content = await fsP.readFile(path.join(__dirname, "leagues.txt"), "utf8");
        const data = content.split("\r\n");

        data.forEach( (elem, idx) => {
            if (!elem) return;

            const url = `https://playfootball.games/media/competitions/${elem}.png`

            fetch(url)
                .then(res => {
                    // check status
                    if (res.status === 200) {
                        const fileStream = fs.createWriteStream(path.join(writepath, `${elem}.png`));
                        res.body.pipe(fileStream);
                    } else {
                        console.log(`status: ${res.status} line: ${idx} elem: ${elem} not found`)
                    }
                })
                .catch(err => console.log(err))
        })
    } catch (err) {
        console.error(err);
    }
}

main();