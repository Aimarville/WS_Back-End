(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const match = require('./match.js');
const parse = require('./parse.js');
const { setupRows } = require('./rows.js');
function autocomplete(inp, game) {

    let addRow = setupRows(game);

    let players = game.players;

    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -2;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < players.length; i++) {
            //
            const matches = match(players[i].name, val, { insideWords: true }); // busca en cualquier parte
            if (matches.length > 0) { // si hay coincidencias
                const parts = parse(players[i].name, matches); // divide el nombre para resaltar coincidencias

                b = document.createElement("DIV");
                b.classList.add('flex', 'items-start', 'gap-x-3', 'leading-tight', 'uppercase', 'text-sm');
                b.innerHTML = `<img src="https://cdn.sportmonks.com/images/soccer/teams/${players[i].teamId % 32}/${players[i].teamId}.png"  width="28" height="28">`;

                b.innerHTML += `<div class='self-center'>`;
                let nameHTML = parts.map(part => {
                    return part.highlight ? `<b>${part.text}</b>` : part.text;
                }).join(''); // unimos todo sin separar en spans

                b.innerHTML += `
                    <span class='self-center'>${nameHTML}</span>
                    <input type='hidden' name='name' value='${players[i].name}'>
                    <input type='hidden' name='id' value='${players[i].id}'>
                </div>`;
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;

                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();

                    addRow(Number(this.getElementsByTagName("input")[1].value));

                    inp.value = '';
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus += 2;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus -= 2;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    // players.find ( p => { return p.id == 47323 })

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active", "bg-slate-200", "pointer");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active", "bg-slate-200", "pointer");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
module.exports = {autocomplete}
},{"./match.js":5,"./parse.js":6,"./rows.js":7}],2:[function(require,module,exports){
const { getStats } = require('./stats.js');

 const folder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-6 w-6" name="folder"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>`;
 const leftArrow = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="h-4 w-4 absolute right-0 -bottom-0.5" name="leftArrowInCircle"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg>`;
 const stringToHTML = (str) => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body
};
 const higher = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20
20" fill="white" aria-hidden="true" width="25" style="margin-right: -8px; margin-left: -3px;"><path fill-rule="evenodd" d="M5.293 7.707a1 1
0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1
1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"
></path></svg>`
 const lower = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20
" fill="white" aria-hidden="true" width="25" style="margin-right: -8px
; margin-left: -3px;"><path fill-rule="evenodd" d="M14.707 12.293a1 1
0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586
V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd
"></path></svg>`

 let toggle = function(){
    if (document.getElementById("showHide").nextSibling.firstChild.style.display == 'none') {
        document.getElementById("showHide").innerText = "Hide Guess Distribution"
        document.getElementById("showHide").nextSibling.firstChild.style.display = 'block'
    }else {
        document.getElementById("showHide").innerText = "Show Guess Distribution"
        document.getElementById("showHide").nextSibling.firstChild.style.display = 'none'
    }
}

 let headless = function (inner) {
    return `<div id="headlessui-portal-root">
  <div>
    <div class="fixed z-10 inset-0 overflow-y-auto" id="headlessui-dialog-1" role="dialog" aria-modal="true" aria-labelledby="headlessui-dialog-title-6">
      <div class="flex items-center justify-center min-h-screen py-10 px-2 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" id="headlessui-dialog-overlay-5" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&ZeroWidthSpace;</span>
        ${inner}
      </div>
    </div>
  </div>
</div>`
}

 const stats = function () {
    const {totalGames, bestStreak, currentStreak, successRate, gamesFailed, winDistribution} = getStats("gameStats");

    let blocks = `<div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden sh
adow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 dark:bg-gray-800"><div class="absolute right-4 top-4" id="closedialog"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="h-6 w-6 cursor-pointer dark:stroke-white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><div class="text-center"><h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="headlessui-dialog-title-7">Statistics</h3><div class="mt-2"><div class="flex justify-center my-2"><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${totalGames}</div><div class="text-xs">Total tries</div></div><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${successRate}%</div><div class="text-xs">Success rate</div></div><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${currentStreak}</div><div class="text-xs">Current streak</div></div><div class="items-center justify-center m-1 w-1/4 dark:text-white"><div class="text-3xl font-bold">${bestStreak}</div><div class="text-xs">Best streak</div></div></div>
<h4 class="cursor-pointer text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="showHide">Show Guess Distribution</h4><div class="columns-1 justify-left m-2 text-sm dark:text-white">`

    let sum = winDistribution.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue;
    });

    blocks += "<div id='guesscontainer' style='display:none'>"
    for(let i=1; i<=8; i++){
        blocks += `<div class="flex justify-left m-1">
                        <div class="items-center justify-center w-2">${i}</div>
                        <div class="rounded-full w-full ml-2">
                            <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 rounded-l-full" style="width: ${Math.ceil(winDistribution[i] / sum * 100) }%;">
                                ${winDistribution[i]}
                            </div>
                        </div>
                    </div>`
    }
    blocks += "</div>"

    blocks += `<div class="mt-2 justify-center items-center space-x-2 dark:text-white">
                    <div>
                        <h5>New footballer:</h5>
                        <span class="text-lg font-medium text-gray-900 dark:text-gray-100" id="nextPlayer"></span>
                    </div>
                   <!-- <button type="button" class="rounded-md border border-transparent shadow-sm px-4 pt-1 pb-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm" tabindex="0"><span class="block text-2xl tracking-wide font-bold leading-7">Share</span>
                   <span class="block text-xs tracking-tight font-light">#HashTag</span></button> -->
               </div>
               <div class="mt-3">
               </div>
               <div class="dark:text-white">
                   <div class="text-lg font-extrabold text-[#b837c6] dark:text-[#ceff27]" style="color: #ceff27">Web Sistemak</div>
                   <div class="text-sm">2025/2026 ikasturteko praktika</div>
               </div>               
               </div></div></div></div>`

    return blocks
}
module.exports = { folder, leftArrow, stringToHTML, higher, lower, toggle, headless, stats };
},{"./stats.js":8}],3:[function(require,module,exports){
async function fetchJSON(what) {
    // YOUR CODE HERE
    const response = await fetch(what);
    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al cargar ${what}`);
    }
    const data = await response.json(); // Convierte JSON
    return data;
}
module.exports = { fetchJSON };
},{}],4:[function(require,module,exports){
const { folder, leftArrow } = require("./fragments.js");
const { fetchJSON } = require("./loaders.js");
const { setupRows } = require('./rows.js');
const { autocomplete } = require("./autocomplete.js");

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

},{"./autocomplete.js":1,"./fragments.js":2,"./loaders.js":3,"./rows.js":7}],5:[function(require,module,exports){
const match = require('autosuggest-highlight/match');
module.exports = match;

},{"autosuggest-highlight/match":9}],6:[function(require,module,exports){
const parse = require('autosuggest-highlight/parse');
module.exports = parse;

},{"autosuggest-highlight/parse":10}],7:[function(require,module,exports){
// YOUR CODE HERE :
// .... stringToHTML ....
// .... setupRows .....
const { stringToHTML, higher, lower, headless, toggle, stats } = require('./fragments.js');
const { initState, updateStats } = require('./stats.js');

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']


let setupRows = function (game) {

    let [state, updateState] = initState('WAYgameState', game.solution.id);

    function leagueToFlag(leagueId) {
        // YOUR CODE HERE
        return game.leagues[leagueId];
    }


    function getAge(dateString) {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        return age;
    }

    let check = function (theKey, theValue) {
        if (theKey === "birthdate") {
            const solutionAge = getAge(game.solution[theKey]);
            const userAge = getAge(theValue);

            if (solutionAge === userAge) return "correct";
            if (solutionAge > userAge) return "higher";
            if (solutionAge < userAge) return "lower";
        }
        if (game.solution[theKey] === theValue) {
            return "correct";
        }

        return "incorrect";
    }

    function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The player was " + game.solution.name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }

    function showStats(timeout) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.body.appendChild(stringToHTML(headless(stats())));
                document.getElementById("showHide").onclick = toggle;
                bindClose();
                resolve();
            }, timeout)
        })
    }

    function bindClose() {
        document.getElementById("closedialog").onclick = function () {
            document.body.removeChild(document.body.lastChild)
            document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
        }
    }

    function setContent(guess) {
        let ageClass = check('birthdate', guess.birthdate);
        let ageDisplay = getAge(guess.birthdate);
        if (ageClass === 'higher') {
            ageDisplay += ` ${higher}`;
        } else if (ageClass === 'lower') {
            ageDisplay += ` ${lower}`;
        }

        return [
            `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            ageDisplay
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }

    function resetInput(){
        // YOUR CODE HERE
        let input = document.getElementById("myInput");
        input.value = "";
        input.placeholder = `Guess ${game.guesses.length}/8`;
    }

    let getPlayer = function (playerId) {
        // YOUR CODE HERE
        return game.players.find(player => player.id === playerId);
    }

    function gameEnded(lastGuess){
        // YOUR CODE HERE
        return (lastGuess == game.solution.id) || (game.guesses.length >= 8);
    }

    async function success() {
        await unblur('success');
        showStats(2500).then();
    }

    async function gameOver() {
        await unblur('gameOver');
        showStats(2500).then();
    }

    resetInput();

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)

        game.guesses.push(playerId)
        updateState(playerId)

        resetInput();

        if (gameEnded(playerId)) {
            updateStats(game.guesses.length);

            if (playerId == game.solution.id) {
                success();
            }

            if (game.guesses.length == 8) {
                gameOver();
            }

            let interval = setInterval(() => {

                const next = document.getElementById("nextPlayer");
                if (!next) return;

                // Hora del próximo jugador → siguiente día a las 00:00:00
                const now = new Date();
                const tomorrow = new Date();
                tomorrow.setHours(24, 0, 0, 0);

                let diff = tomorrow - now; // milisegundos restantes

                if (diff <= 0) {
                    next.textContent = "00 ordu 00 minutu eta 00 segundu";
                    clearInterval(interval);
                    return;
                }

                const totalSeconds = Math.floor(diff / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                next.textContent =
                    `${String(hours).padStart(2,'0')} ordu ` +
                    `${String(minutes).padStart(2,'0')} minutu eta ` +
                    `${String(seconds).padStart(2,'0')} segundu`;

            }, 1000);
        }

        showContent(content, guess)
    }
}
module.exports = { setupRows };
},{"./fragments.js":2,"./stats.js":8}],8:[function(require,module,exports){
let initState = function(what, solutionId) {
    // YOUR CODE HERE
    let saved = localStorage.getItem(what);
    let state;
    if (saved) {
        state = JSON.parse(saved);
    } else {
        state = {
            guesses: [],
            solution: solutionId
        };
    }

    let fun = function(guess) {
        state.guesses.push(guess);
        localStorage.setItem(what, JSON.stringify(state));
    }

    return [state, fun];
}

function successRate(e) {
    // YOUR CODE HERE
    const gamesWon = e.winDistribution.reduce((sum, val) => sum + val, 0);

    if (e.totalGames === 0) return 0;

    const rate = (gamesWon / e.totalGames) * 100;

    return Math.round(rate);
}

let getStats = function(what) {
    // YOUR CODE HERE
    let saved = localStorage.getItem(what);
    if (saved) {
        return JSON.parse(saved);
    } else {
        return {
            winDistribution: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            gamesFailed: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalGames: 0,
            successRate: 0
        };
    }
}

function updateStats(t) {
    // YOUR CODE HERE
    gamestats.totalGames += 1;
    if (t < 8) {
        gamestats.currentStreak += 1;
        gamestats.winDistribution[t] += 1;
        if (gamestats.currentStreak > gamestats.bestStreak) {
            gamestats.bestStreak = gamestats.currentStreak;
        }
    } else {
        gamestats.currentStreak = 0;
        gamestats.gamesFailed += 1;
    }
    gamestats.successRate = successRate(gamestats);
    localStorage.setItem('gameStats', JSON.stringify(gamestats));
}

let gamestats = getStats('gameStats');

module.exports= {initState, getStats, updateStats}
},{}],9:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.AutosuggestHighlightMatch=t():e.AutosuggestHighlightMatch=t()}(this,(()=>{return e={772:(e,t,o)=>{const r=o(826).remove,i=/[.*+?^${}()|[\]\\]/g,n=/[a-z0-9_]/i,u=/\s+/;e.exports=function(e,t,o){var s,a;a={insideWords:!1,findAllOccurrences:!1,requireMatchAll:!1},s=(s=o)||{},Object.keys(s).forEach((e=>{a[e]=!!s[e]})),o=a;const c=Array.from(e).map((e=>r(e)));let l=c.join("");return(t=r(t)).trim().split(u).filter((e=>e.length>0)).reduce(((e,t)=>{const r=t.length,u=!o.insideWords&&n.test(t[0])?"\\b":"",s=new RegExp(u+t.replace(i,"\\$&"),"i");let a,A;if(a=s.exec(l),o.requireMatchAll&&null===a)return l="",[];for(;a;){A=a.index;const t=r-c.slice(A,A+r).join("").length,i=A-c.slice(0,A).join("").length,n=[A+i,A+r+i+t];if(n[0]!==n[1]&&e.push(n),l=l.slice(0,A)+new Array(r+1).join(" ")+l.slice(A+r),!o.findAllOccurrences)break;a=s.exec(l)}return e}),[]).sort(((e,t)=>e[0]-t[0]))}},826:e=>{var t={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",Ấ:"A",Ắ:"A",Ẳ:"A",Ẵ:"A",Ặ:"A",Æ:"AE",Ầ:"A",Ằ:"A",Ȃ:"A",Ç:"C",Ḉ:"C",È:"E",É:"E",Ê:"E",Ë:"E",Ế:"E",Ḗ:"E",Ề:"E",Ḕ:"E",Ḝ:"E",Ȇ:"E",Ì:"I",Í:"I",Î:"I",Ï:"I",Ḯ:"I",Ȋ:"I",Ð:"D",Ñ:"N",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",Ố:"O",Ṍ:"O",Ṓ:"O",Ȏ:"O",Ù:"U",Ú:"U",Û:"U",Ü:"U",Ý:"Y",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",ấ:"a",ắ:"a",ẳ:"a",ẵ:"a",ặ:"a",æ:"ae",ầ:"a",ằ:"a",ȃ:"a",ç:"c",ḉ:"c",è:"e",é:"e",ê:"e",ë:"e",ế:"e",ḗ:"e",ề:"e",ḕ:"e",ḝ:"e",ȇ:"e",ì:"i",í:"i",î:"i",ï:"i",ḯ:"i",ȋ:"i",ð:"d",ñ:"n",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",ố:"o",ṍ:"o",ṓ:"o",ȏ:"o",ù:"u",ú:"u",û:"u",ü:"u",ý:"y",ÿ:"y",Ā:"A",ā:"a",Ă:"A",ă:"a",Ą:"A",ą:"a",Ć:"C",ć:"c",Ĉ:"C",ĉ:"c",Ċ:"C",ċ:"c",Č:"C",č:"c",C̆:"C",c̆:"c",Ď:"D",ď:"d",Đ:"D",đ:"d",Ē:"E",ē:"e",Ĕ:"E",ĕ:"e",Ė:"E",ė:"e",Ę:"E",ę:"e",Ě:"E",ě:"e",Ĝ:"G",Ǵ:"G",ĝ:"g",ǵ:"g",Ğ:"G",ğ:"g",Ġ:"G",ġ:"g",Ģ:"G",ģ:"g",Ĥ:"H",ĥ:"h",Ħ:"H",ħ:"h",Ḫ:"H",ḫ:"h",Ĩ:"I",ĩ:"i",Ī:"I",ī:"i",Ĭ:"I",ĭ:"i",Į:"I",į:"i",İ:"I",ı:"i",Ĳ:"IJ",ĳ:"ij",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",Ḱ:"K",ḱ:"k",K̆:"K",k̆:"k",Ĺ:"L",ĺ:"l",Ļ:"L",ļ:"l",Ľ:"L",ľ:"l",Ŀ:"L",ŀ:"l",Ł:"l",ł:"l",Ḿ:"M",ḿ:"m",M̆:"M",m̆:"m",Ń:"N",ń:"n",Ņ:"N",ņ:"n",Ň:"N",ň:"n",ŉ:"n",N̆:"N",n̆:"n",Ō:"O",ō:"o",Ŏ:"O",ŏ:"o",Ő:"O",ő:"o",Œ:"OE",œ:"oe",P̆:"P",p̆:"p",Ŕ:"R",ŕ:"r",Ŗ:"R",ŗ:"r",Ř:"R",ř:"r",R̆:"R",r̆:"r",Ȓ:"R",ȓ:"r",Ś:"S",ś:"s",Ŝ:"S",ŝ:"s",Ş:"S",Ș:"S",ș:"s",ş:"s",Š:"S",š:"s",Ţ:"T",ţ:"t",ț:"t",Ț:"T",Ť:"T",ť:"t",Ŧ:"T",ŧ:"t",T̆:"T",t̆:"t",Ũ:"U",ũ:"u",Ū:"U",ū:"u",Ŭ:"U",ŭ:"u",Ů:"U",ů:"u",Ű:"U",ű:"u",Ų:"U",ų:"u",Ȗ:"U",ȗ:"u",V̆:"V",v̆:"v",Ŵ:"W",ŵ:"w",Ẃ:"W",ẃ:"w",X̆:"X",x̆:"x",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Y̆:"Y",y̆:"y",Ź:"Z",ź:"z",Ż:"Z",ż:"z",Ž:"Z",ž:"z",ſ:"s",ƒ:"f",Ơ:"O",ơ:"o",Ư:"U",ư:"u",Ǎ:"A",ǎ:"a",Ǐ:"I",ǐ:"i",Ǒ:"O",ǒ:"o",Ǔ:"U",ǔ:"u",Ǖ:"U",ǖ:"u",Ǘ:"U",ǘ:"u",Ǚ:"U",ǚ:"u",Ǜ:"U",ǜ:"u",Ứ:"U",ứ:"u",Ṹ:"U",ṹ:"u",Ǻ:"A",ǻ:"a",Ǽ:"AE",ǽ:"ae",Ǿ:"O",ǿ:"o",Þ:"TH",þ:"th",Ṕ:"P",ṕ:"p",Ṥ:"S",ṥ:"s",X́:"X",x́:"x",Ѓ:"Г",ѓ:"г",Ќ:"К",ќ:"к",A̋:"A",a̋:"a",E̋:"E",e̋:"e",I̋:"I",i̋:"i",Ǹ:"N",ǹ:"n",Ồ:"O",ồ:"o",Ṑ:"O",ṑ:"o",Ừ:"U",ừ:"u",Ẁ:"W",ẁ:"w",Ỳ:"Y",ỳ:"y",Ȁ:"A",ȁ:"a",Ȅ:"E",ȅ:"e",Ȉ:"I",ȉ:"i",Ȍ:"O",ȍ:"o",Ȑ:"R",ȑ:"r",Ȕ:"U",ȕ:"u",B̌:"B",b̌:"b",Č̣:"C",č̣:"c",Ê̌:"E",ê̌:"e",F̌:"F",f̌:"f",Ǧ:"G",ǧ:"g",Ȟ:"H",ȟ:"h",J̌:"J",ǰ:"j",Ǩ:"K",ǩ:"k",M̌:"M",m̌:"m",P̌:"P",p̌:"p",Q̌:"Q",q̌:"q",Ř̩:"R",ř̩:"r",Ṧ:"S",ṧ:"s",V̌:"V",v̌:"v",W̌:"W",w̌:"w",X̌:"X",x̌:"x",Y̌:"Y",y̌:"y",A̧:"A",a̧:"a",B̧:"B",b̧:"b",Ḑ:"D",ḑ:"d",Ȩ:"E",ȩ:"e",Ɛ̧:"E",ɛ̧:"e",Ḩ:"H",ḩ:"h",I̧:"I",i̧:"i",Ɨ̧:"I",ɨ̧:"i",M̧:"M",m̧:"m",O̧:"O",o̧:"o",Q̧:"Q",q̧:"q",U̧:"U",u̧:"u",X̧:"X",x̧:"x",Z̧:"Z",z̧:"z"},o=Object.keys(t).join("|"),r=new RegExp(o,"g"),i=new RegExp(o,""),n=function(e){return e.replace(r,(function(e){return t[e]}))};e.exports=n,e.exports.has=function(e){return!!e.match(i)},e.exports.remove=n}},t={},function o(r){var i=t[r];if(void 0!==i)return i.exports;var n=t[r]={exports:{}};return e[r](n,n.exports,o),n.exports}(772);var e,t}));
},{}],10:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.AutosuggestHighlightParse=e():t.AutosuggestHighlightParse=e()}(this,(()=>{return t={705:t=>{t.exports=function(t,e){const h=[];return 0===e.length?h.push({text:t,highlight:!1}):e[0][0]>0&&h.push({text:t.slice(0,e[0][0]),highlight:!1}),e.forEach(((i,o)=>{const s=i[0],r=i[1];h.push({text:t.slice(s,r),highlight:!0}),o===e.length-1?r<t.length&&h.push({text:t.slice(r,t.length),highlight:!1}):r<e[o+1][0]&&h.push({text:t.slice(r,e[o+1][0]),highlight:!1})})),h}}},e={},function h(i){var o=e[i];if(void 0!==o)return o.exports;var s=e[i]={exports:{}};return t[i](s,s.exports,h),s.exports}(705);var t,e}));
},{}]},{},[4]);
