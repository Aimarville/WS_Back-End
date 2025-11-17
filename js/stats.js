export {initState}

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



