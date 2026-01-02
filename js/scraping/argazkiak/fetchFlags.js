const path = require('path');
const fsP = require('fs/promises');
const fs = require('fs');
const fetch = require('node-fetch');

const writepath = path.join(__dirname, '../../../public/images/flags');
console.log(writepath);

async function main() {
    try {
        // create directoy
        await fsP.mkdir(writepath, { recursive: true });

        // read leagues file into an array of lines
        const content = await fsP.readFile(path.join(__dirname, "nationalities.txt"), "utf16le");
        const data = content.split("\r\n");

        console.log(data);

        data.forEach( (elem, idx) => {
            const country = elem.replace(/^\uFEFF/, '').trim();
            if (!country) return;

            let flag = country;
            if (elem.includes(' ')) {
                flag = elem.replace(' ', '%20');
            }

            console.log(`${flag}`);

            const url = `https://playfootball.games/media/nations/${flag}.svg`

            fetch(url)
                .then(res => {
                    // check status
                    if (res.status === 200) {
                        const fileStream = fs.createWriteStream(path.join(writepath, `${country}.svg`));
                        res.body.pipe(fileStream);
                    } else {
                        console.log(`status: ${res.status} line: ${idx} elem: ${country} not found`)
                    }
                })
                .catch(err => console.log(err))
        })
    } catch (err) {
        console.error(err);
    }
}

main();