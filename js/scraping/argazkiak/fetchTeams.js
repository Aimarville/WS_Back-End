//jq -er 'map(.teamId) | .[]' .\json\fullplayers25.json | Sort-Object {[int]$_} -Unique | Set-Content -Encoding utf8 .\js\scraping\argazkiak\teamIDs.txt
const path = require('path');
const fsP = require('fs/promises');
const fs = require('fs');
const fetch = require('node-fetch');

const writepath = path.join(__dirname, '../../../public/images/teams');

async function main() {
    try {
        // create directoy
        await fsP.mkdir(writepath, { recursive: true });

        // read leagues file into an array of lines
        const content = await fsP.readFile(path.join(__dirname, "teamIDs.txt"), "utf8");
        const data = content.split("\r\n");

        data.forEach( (elem, idx) => {
            const team = elem.replace(/^\uFEFF/, '').trim();
            if (!team) return;

            const e1 = team % 32;

            const url = `https://cdn.sportmonks.com/images/soccer/teams/${e1}/${team}.png`

            fetch(url)
                .then(res => {
                    // check status
                    if (res.status === 200) {
                        const fileStream = fs.createWriteStream(path.join(writepath, `${team}.png`));
                        res.body.pipe(fileStream);
                    } else {
                        console.log(`status: ${res.status} line: ${idx} team: ${team} not found`)
                    }
                })
                .catch(err => console.log(err))
        })
    } catch (err) {
        console.error(err);
    }
}

main();