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
        input.placeholder = `Guess ${state.guesses.length}/8`;
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

    for (let playerId of state.guesses) {
        let guess = getPlayer(playerId);
        if (guess) {
            let content = setContent(guess);
            showContent(content, guess);
        }
        if (gameEnded(playerId)) {
            if (playerId == state.solution.id) {
                break
                success();
            }
        }
    }
    if (state.guesses.length >= 8) {
        gameOver();
    }

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