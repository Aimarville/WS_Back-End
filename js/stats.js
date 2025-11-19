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