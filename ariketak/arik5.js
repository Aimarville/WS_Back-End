let elem;

await fetch('http://api.football-data.org/v4/competitions')
    .then(response => response.json())
    .then(data => {
        elem = data.competitions.filter(competition => {
            if (competition.area.code === 'ESP' ||
            competition.area.code === 'ENG' ||
            competition.area.code === 'ITA' ||
            competition.area.code === 'FRA') {
                if (competition.plan === 'TIER_ONE') {
                    if (competition.name !== 'Championship')
                        return competition;
                }
            }
        })
        .map(competition => competition.id);
    })

console.log(elem);
console.log('Totala: ' + elem.length);