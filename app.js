const minnum = document.querySelector('.minnumber'),
    maxnum = document.querySelector('.maxnumber');

const getinput = document.querySelector('#guessnumber');
const getbtn = document.querySelector('#btn');

const message1 = document.querySelector('.message1');
const message2 = document.querySelector('.message2');

const getgamecnt = document.getElementById('game-container');

const getmicbtn = document.getElementById('mic-button');
const getvoccnt = document.getElementById('voice-container');

let min = 10,
    max = 100,
    gameleft = 3,
    winningnum = randomnum(min,max);

minnum.textContent = min;
maxnum.textContent = max;

function randomnum(min, max) {
    let getrdm = Math.floor(Math.random() * (max - min) + 10);
    return getrdm;
}

// for chrome browser support
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    let getrec = new window.SpeechRecognition;

getmicbtn.addEventListener('click', function () {

    // start recognition, start() come from Recognition api
    getrec.start();

    getrec.addEventListener('result', (e) => talking(e));
    
})

function talking(ele) {
    // console.log(ele);

    const micresult = ele.results[0][0].transcript;
    // console.log(micresult);

    micmessage(micresult);
    getnumber(micresult);
}

function micmessage(msg) {
    getvoccnt.innerHTML = `<span class="voicemessage">Did you say !!! ${msg}</span>`;
}

function getnumber(msg) {
    const getnum = +msg;

    if (Number.isNaN(getnum)) {
        getvoccnt.innerHTML += `<div>This is not a valid number.</div>`;
        return;
    }

    getinput.value = getnum;

    //Stop Recognition, stop() come from SpeechRecognition api
    getrec.stop();
}

function setmessage1(msg,color) {
    message1.textContent = msg;
    message1.style.color = color;
}

function setmessage2(msg,color) {
    message2.textContent = msg;
    message2.style.color = color;
}

function gameover(won,msg) {
    let color;

    won === true ? color = 'green' : color = 'red';

    getinput.disabled = true;
    getinput.style.borderColor = color;

    setmessage1(msg,color);

    getbtn.value = 'Play Again';

    getbtn.classList.add('playagain');
}

getbtn.addEventListener('click', function () {
    let guess = +getinput.value;

    if (guess < min || guess > max || isNaN(guess)) {
        setmessage2(`Please enter a number between ${min} and ${max}`, 'red');
    }

    if (guess === winningnum) {
        // Game over WON 
        gameover(true, `${winningnum} is correct.`);
    } else {
        gameleft--;
        if (gameleft === 0) {
            //Game over LOSE
            gameover(false,`Game Over, You Lost, the correct number is ${winningnum}`)
        } else {
            //Continue Game

            getinput.style.borderColor = 'red';
            getinput.value = '';
            setmessage1(`${guess} is not correct. ${gameleft} guess left`, 'blue');

            if (guess > winningnum) {
                getvoccnt.innerHTML += `<div>You should go down a bit.</div>`;
            } else if (guess < winningnum) {
                getvoccnt.innerHTML += `<div>You should go up a bit.</div>`;
            }
        }
    }
})

getgamecnt.addEventListener('mousedown', function (e) {
    // console.log(e.target);

    if (e.target.classList.contains('playagain')) {
        window.location.reload();
    }
})