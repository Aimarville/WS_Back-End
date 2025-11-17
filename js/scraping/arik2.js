fetch('http://api.football-data.org/v4/competitions')
    .then(response => response.json())
    .then(data => {
        let elem = data.competitions.filter(competition => {
            if (competition.area.name === 'Spain' && competition.type === 'LEAGUE')
                return competition;
        });
        console.log(elem);
        console.log('Totala: ' + elem.length);
    })