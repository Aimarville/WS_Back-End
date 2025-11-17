import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import { setupRows } from './rows.js';
import { autocomplete } from "./autocomplete.js";

function differenceInDays(date1) {
    //YOUR CODE HERE
    const date2 = new Date();
    const diff = Math.abs(date2 - date1);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

let difference_In_Days = differenceInDays(new Date("01-10-2025"));

window.onload = function () {
  document.getElementById("gamenumber").innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

function getSolution(players, solutionArray, difference_In_Days) {
    // YOUR CODE HERE
    const index = (difference_In_Days - 1) % solutionArray.length;
    const solutionId = Number(solutionArray[index]);
    const solutionPlayer = players.find(player => player.id === solutionId);
    console.log(solutionPlayer);
    return solutionPlayer;
}

Promise.all([fetchJSON("../json/fullplayers25.json"), fetchJSON("../json/solution25.json")]).then(
  (values) => {

    let solution;
    
    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);

    game.leagues = {
        564: "es1",
        8:   "en1",
        82:  "de1",
        384: "it1",
        301: "fr1"
    };

    console.log(game.solution);

    document.getElementById("mistery").src = `https://playfootball.games/media/players/${game.solution.id % 32}/${game.solution.id}.png`;

    const myInput = document.getElementById('myInput');

    autocomplete(document.getElementById("myInput"), game);

    myInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            let addRow = setupRows(game);
            const jokalariId = parseInt(myInput.value, 10);
            if (!isNaN(jokalariId)) {
                addRow(jokalariId);
            }
            myInput.value = '';
        }
    });
  }
);
