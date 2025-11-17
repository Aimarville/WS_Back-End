await fetch('http://api.football-data.org/v4/competitions')
    .then(response => response.json())
    .then(data => {
        let elem = data.competitions.filter(competition => {
            if (competition.area.code === 'ESP' ||
            competition.area.code === 'ENG' ||
            competition.area.code === 'ITA' ||
            competition.area.code === 'FRA') {
                if (competition.plan === 'TIER_ONE')
                    return competition;
            }
        });

        console.log(elem);
        console.log('Totala: ' + elem.length);
    })