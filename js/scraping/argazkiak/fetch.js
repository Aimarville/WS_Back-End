const path = require('path');
const fsP = require('fs/promises');
const fs = require('fs');
const fetch = require('node-fetch');

async function main(what) {
    const writepath = path.join(__dirname, `../../../public/images/${what}`);
    let file = '';

    if (what === 'teams') file = 'teamIDs.txt';
    else if (what === 'flags') file = 'nationalities.txt';
    else if (what === 'leagues') file = 'leagues.txt';
    else {
        console.error('Unknown type');
        return;
    }

    try {
        // create directoy
        await fsP.mkdir(writepath, { recursive: true });

        // read leagues file into an array of lines
        const content = await fsP.readFile(path.join(__dirname, file), "utf8");
        const data = content.split("\r\n");

        data.forEach( (elem, idx) => {
            const e = elem.replace(/^\uFEFF/, '').trim();
            if (!e) return;

            let url = '';
            if (what === 'teams') {
                const e1 = e % 32;
                url = `https://cdn.sportmonks.com/images/soccer/teams/${e1}/${e}.png`
            }
            else if (what === 'flags') url = `https://playfootball.games/media/nations/${e}.svg`
            else if (what === 'leagues') url = `https://playfootball.games/media/competitions/${e}.png`
            else {
                console.error('Unknown type');
                return;
            }

            fetch(url)
                .then(res => {
                    // check status
                    if (res.status === 200) {
                        let fileStream;
                        if (what === 'flags') {
                            fileStream = fs.createWriteStream(path.join(writepath, `${e}.svg`));
                        } else {
                            fileStream = fs.createWriteStream(path.join(writepath, `${e}.png`));
                        }
                        res.body.pipe(fileStream);
                    } else {
                        console.log(`status: ${res.status} line: ${idx} team: ${e} not found`)
                    }
                })
                .catch(err => console.log(err))
        })
    } catch (err) {
        console.error(err);
    }
}

const what = process.argv[2];

if (what) main(what);