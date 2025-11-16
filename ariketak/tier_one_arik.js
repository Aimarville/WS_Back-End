let elem;

await fetch('http://api.football-data.org/v4/competitions')
    .then(response => response.json())
    .then(data => {
        elem = data.competitions.filter(competition => competition.plan === 'TIER_ONE');
    })

console.log(elem);
console.log('Totala: ' + elem.length);