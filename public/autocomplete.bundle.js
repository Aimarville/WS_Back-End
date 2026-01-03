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
                b.innerHTML = `<img src="/images/teams/${players[i].teamId}.png"  width="28" height="28">`;

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
},{"./match.js":2,"./parse.js":3,"./rows.js":4}],2:[function(require,module,exports){
const match = require('autosuggest-highlight/match');
module.exports = match;

},{"autosuggest-highlight/match":5}],3:[function(require,module,exports){
const parse = require('autosuggest-highlight/parse');
module.exports = parse;

},{"autosuggest-highlight/parse":6}],4:[function(require,module,exports){
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
        if (theKey === "birthdate" || theKey === 'number') {
            let solution;
            let user;
            if (theKey === "birthdate") {
                solution = getAge(game.solution[theKey]);
                user = getAge(theValue);
            }
            if (theKey === 'number'){
                solution = game.solution[theKey];
                user = theValue;
            }

            if (solution === user) return "correct";
            if (solution > user) return "higher";
            if (solution < user) return "lower";
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
        let numberClass = check('number', guess.number);
        let numberDisplay = '#' + guess.number;
        if (numberClass === 'higher') {
            numberDisplay += ` ${higher}`;
        } else if (numberClass === 'lower') {
            numberDisplay += ` ${lower}`;
        }

        return [
            `<img src="/images/flags/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="images/leagues/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="images/players/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            ageDisplay,
            numberDisplay
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/6 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full w-14 h-14 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
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
        return (lastGuess == state.solution.id) || (state.guesses.length >= 8);
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
            if (playerId == state.solution) {
                success();
                break
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

        updateState(playerId)

        resetInput();

        if (gameEnded(playerId)) {
            updateStats(state.guesses.length);

            if (playerId == state.solution) {
                success();
            }

            if (state.guesses.length == 8) {
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
},{}],5:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.AutosuggestHighlightMatch=t():e.AutosuggestHighlightMatch=t()}(this,(()=>{return e={772:(e,t,o)=>{const r=o(826).remove,i=/[.*+?^${}()|[\]\\]/g,n=/[a-z0-9_]/i,u=/\s+/;e.exports=function(e,t,o){var s,a;a={insideWords:!1,findAllOccurrences:!1,requireMatchAll:!1},s=(s=o)||{},Object.keys(s).forEach((e=>{a[e]=!!s[e]})),o=a;const c=Array.from(e).map((e=>r(e)));let l=c.join("");return(t=r(t)).trim().split(u).filter((e=>e.length>0)).reduce(((e,t)=>{const r=t.length,u=!o.insideWords&&n.test(t[0])?"\\b":"",s=new RegExp(u+t.replace(i,"\\$&"),"i");let a,A;if(a=s.exec(l),o.requireMatchAll&&null===a)return l="",[];for(;a;){A=a.index;const t=r-c.slice(A,A+r).join("").length,i=A-c.slice(0,A).join("").length,n=[A+i,A+r+i+t];if(n[0]!==n[1]&&e.push(n),l=l.slice(0,A)+new Array(r+1).join(" ")+l.slice(A+r),!o.findAllOccurrences)break;a=s.exec(l)}return e}),[]).sort(((e,t)=>e[0]-t[0]))}},826:e=>{var t={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",Ấ:"A",Ắ:"A",Ẳ:"A",Ẵ:"A",Ặ:"A",Æ:"AE",Ầ:"A",Ằ:"A",Ȃ:"A",Ç:"C",Ḉ:"C",È:"E",É:"E",Ê:"E",Ë:"E",Ế:"E",Ḗ:"E",Ề:"E",Ḕ:"E",Ḝ:"E",Ȇ:"E",Ì:"I",Í:"I",Î:"I",Ï:"I",Ḯ:"I",Ȋ:"I",Ð:"D",Ñ:"N",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",Ố:"O",Ṍ:"O",Ṓ:"O",Ȏ:"O",Ù:"U",Ú:"U",Û:"U",Ü:"U",Ý:"Y",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",ấ:"a",ắ:"a",ẳ:"a",ẵ:"a",ặ:"a",æ:"ae",ầ:"a",ằ:"a",ȃ:"a",ç:"c",ḉ:"c",è:"e",é:"e",ê:"e",ë:"e",ế:"e",ḗ:"e",ề:"e",ḕ:"e",ḝ:"e",ȇ:"e",ì:"i",í:"i",î:"i",ï:"i",ḯ:"i",ȋ:"i",ð:"d",ñ:"n",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",ố:"o",ṍ:"o",ṓ:"o",ȏ:"o",ù:"u",ú:"u",û:"u",ü:"u",ý:"y",ÿ:"y",Ā:"A",ā:"a",Ă:"A",ă:"a",Ą:"A",ą:"a",Ć:"C",ć:"c",Ĉ:"C",ĉ:"c",Ċ:"C",ċ:"c",Č:"C",č:"c",C̆:"C",c̆:"c",Ď:"D",ď:"d",Đ:"D",đ:"d",Ē:"E",ē:"e",Ĕ:"E",ĕ:"e",Ė:"E",ė:"e",Ę:"E",ę:"e",Ě:"E",ě:"e",Ĝ:"G",Ǵ:"G",ĝ:"g",ǵ:"g",Ğ:"G",ğ:"g",Ġ:"G",ġ:"g",Ģ:"G",ģ:"g",Ĥ:"H",ĥ:"h",Ħ:"H",ħ:"h",Ḫ:"H",ḫ:"h",Ĩ:"I",ĩ:"i",Ī:"I",ī:"i",Ĭ:"I",ĭ:"i",Į:"I",į:"i",İ:"I",ı:"i",Ĳ:"IJ",ĳ:"ij",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",Ḱ:"K",ḱ:"k",K̆:"K",k̆:"k",Ĺ:"L",ĺ:"l",Ļ:"L",ļ:"l",Ľ:"L",ľ:"l",Ŀ:"L",ŀ:"l",Ł:"l",ł:"l",Ḿ:"M",ḿ:"m",M̆:"M",m̆:"m",Ń:"N",ń:"n",Ņ:"N",ņ:"n",Ň:"N",ň:"n",ŉ:"n",N̆:"N",n̆:"n",Ō:"O",ō:"o",Ŏ:"O",ŏ:"o",Ő:"O",ő:"o",Œ:"OE",œ:"oe",P̆:"P",p̆:"p",Ŕ:"R",ŕ:"r",Ŗ:"R",ŗ:"r",Ř:"R",ř:"r",R̆:"R",r̆:"r",Ȓ:"R",ȓ:"r",Ś:"S",ś:"s",Ŝ:"S",ŝ:"s",Ş:"S",Ș:"S",ș:"s",ş:"s",Š:"S",š:"s",Ţ:"T",ţ:"t",ț:"t",Ț:"T",Ť:"T",ť:"t",Ŧ:"T",ŧ:"t",T̆:"T",t̆:"t",Ũ:"U",ũ:"u",Ū:"U",ū:"u",Ŭ:"U",ŭ:"u",Ů:"U",ů:"u",Ű:"U",ű:"u",Ų:"U",ų:"u",Ȗ:"U",ȗ:"u",V̆:"V",v̆:"v",Ŵ:"W",ŵ:"w",Ẃ:"W",ẃ:"w",X̆:"X",x̆:"x",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Y̆:"Y",y̆:"y",Ź:"Z",ź:"z",Ż:"Z",ż:"z",Ž:"Z",ž:"z",ſ:"s",ƒ:"f",Ơ:"O",ơ:"o",Ư:"U",ư:"u",Ǎ:"A",ǎ:"a",Ǐ:"I",ǐ:"i",Ǒ:"O",ǒ:"o",Ǔ:"U",ǔ:"u",Ǖ:"U",ǖ:"u",Ǘ:"U",ǘ:"u",Ǚ:"U",ǚ:"u",Ǜ:"U",ǜ:"u",Ứ:"U",ứ:"u",Ṹ:"U",ṹ:"u",Ǻ:"A",ǻ:"a",Ǽ:"AE",ǽ:"ae",Ǿ:"O",ǿ:"o",Þ:"TH",þ:"th",Ṕ:"P",ṕ:"p",Ṥ:"S",ṥ:"s",X́:"X",x́:"x",Ѓ:"Г",ѓ:"г",Ќ:"К",ќ:"к",A̋:"A",a̋:"a",E̋:"E",e̋:"e",I̋:"I",i̋:"i",Ǹ:"N",ǹ:"n",Ồ:"O",ồ:"o",Ṑ:"O",ṑ:"o",Ừ:"U",ừ:"u",Ẁ:"W",ẁ:"w",Ỳ:"Y",ỳ:"y",Ȁ:"A",ȁ:"a",Ȅ:"E",ȅ:"e",Ȉ:"I",ȉ:"i",Ȍ:"O",ȍ:"o",Ȑ:"R",ȑ:"r",Ȕ:"U",ȕ:"u",B̌:"B",b̌:"b",Č̣:"C",č̣:"c",Ê̌:"E",ê̌:"e",F̌:"F",f̌:"f",Ǧ:"G",ǧ:"g",Ȟ:"H",ȟ:"h",J̌:"J",ǰ:"j",Ǩ:"K",ǩ:"k",M̌:"M",m̌:"m",P̌:"P",p̌:"p",Q̌:"Q",q̌:"q",Ř̩:"R",ř̩:"r",Ṧ:"S",ṧ:"s",V̌:"V",v̌:"v",W̌:"W",w̌:"w",X̌:"X",x̌:"x",Y̌:"Y",y̌:"y",A̧:"A",a̧:"a",B̧:"B",b̧:"b",Ḑ:"D",ḑ:"d",Ȩ:"E",ȩ:"e",Ɛ̧:"E",ɛ̧:"e",Ḩ:"H",ḩ:"h",I̧:"I",i̧:"i",Ɨ̧:"I",ɨ̧:"i",M̧:"M",m̧:"m",O̧:"O",o̧:"o",Q̧:"Q",q̧:"q",U̧:"U",u̧:"u",X̧:"X",x̧:"x",Z̧:"Z",z̧:"z"},o=Object.keys(t).join("|"),r=new RegExp(o,"g"),i=new RegExp(o,""),n=function(e){return e.replace(r,(function(e){return t[e]}))};e.exports=n,e.exports.has=function(e){return!!e.match(i)},e.exports.remove=n}},t={},function o(r){var i=t[r];if(void 0!==i)return i.exports;var n=t[r]={exports:{}};return e[r](n,n.exports,o),n.exports}(772);var e,t}));
},{}],6:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.AutosuggestHighlightParse=e():t.AutosuggestHighlightParse=e()}(this,(()=>{return t={705:t=>{t.exports=function(t,e){const h=[];return 0===e.length?h.push({text:t,highlight:!1}):e[0][0]>0&&h.push({text:t.slice(0,e[0][0]),highlight:!1}),e.forEach(((i,o)=>{const s=i[0],r=i[1];h.push({text:t.slice(s,r),highlight:!0}),o===e.length-1?r<t.length&&h.push({text:t.slice(r,t.length),highlight:!1}):r<e[o+1][0]&&h.push({text:t.slice(r,e[o+1][0]),highlight:!1})})),h}}},e={},function h(i){var o=e[i];if(void 0!==o)return o.exports;var s=e[i]={exports:{}};return t[i](s,s.exports,h),s.exports}(705);var t,e}));
},{}]},{},[1]);
