import fs from "fs";
import path from "path";

const filePath = path.resolve("./.idea/httpRequests/premiere.json");
const rawData = fs.readFileSync(filePath, "utf-8");
const data = JSON.parse(rawData);

console.log(
    data.teams.flatMap(team =>
        (team.squad || []).map(player => {
            let p = { ...player };
            p.teamId = team.id;
            p.leagueId = data.competition.id;

            if ("dateOfBirth" in p) {
                p.birthDate = p.dateOfBirth;
                delete p.dateOfBirth;
            }

            if (p.position) {
                const pos = p.position;

                if (pos === "Goalkeeper") {
                    p.position = "GK";
                } else if (/Back$|Centre-Back|Defence|Defender/.test(pos)) {
                    p.position = "DF";
                } else if (/Midfield|Midfielder/.test(pos)) {
                    p.position = "MF";
                } else if (/Wing|Striker|Forward|Attacker|Offence/.test(pos)) {
                    p.position = "FW";
                }
            }

            return p;
        })
    )
);
