fetch('http://api.football-data.org/v4/competitions')
    .then(response => response.json())
    .then(data => {
        console.log(data.competitions.filter(competition => competition.id === 2014));
    })