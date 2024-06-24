const pianoKeys = document.querySelectorAll(".piano-keys .key"),
    volumeSlider = document.querySelector(".volume-slider input"),
    keysCheckbox = document.querySelector(".keys-checkbox input"),
    playSequenceButton = document.getElementById("play-sequence"),
    keySequenceTextarea = document.getElementById("key-sequence");

let allKeys = [],
    playedKeys = [],
    currentVolume = 0.5;

const playTune = (key) => {
    let audio = new Audio(`notes/${key}.mp3`); // audio src based on key
    audio.volume = currentVolume;
    audio.play(); // play audio
    playedKeys.push(key);

    var sliced = playedKeys.slice(playedKeys.length - 6, playedKeys.length),
        comb = ['t', 't', 'y', 't', 'i', 'u'],
        dre = ['i', 'p', 'c'];

    if (sliced.toString() === comb.toString()) {
        play();
    } else if (playedKeys.slice(playedKeys.length - 3, playedKeys.length).toString() === dre.toString()) {
        playDre();
    }

    const clickedKey = document.querySelector(`[data-key="${key}"]`); // clicked key
    clickedKey.classList.add("active");

    // removing active class 100ms after it was added when clicked
    setTimeout(() => {
        clickedKey.classList.remove("active");
    }, 100);
}

pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key); // adding data-key value to the array

    // calling playTune function with data-key value as argument
    key.addEventListener("click", () => playTune(key.dataset.key));
});

function delayDispatchKeyboardEvent(key, delay) {
    setTimeout(function () {
        if (key !== ' ') {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: key }));
        }
        playedKeys = [];
    }, delay);
}

const pressedKey = (e) => {
    // check if key is in allowed array
    if (allKeys.includes(e.key)) playTune(e.key);
}

const handleVolume = (e) => {
    // must be between 0 and 1
    currentVolume = e.target.value; // audio volume = range slider value
}

const showHideKeys = () => {
    // toggling hide class from each key
    pianoKeys.forEach(key => key.classList.toggle("hide"));
}

const playSequence = (sequence) => {
    let delay = 0;
    const noteDelay = 100; // delay between notes in ms
    const spaceDelay = 100; // additional delay for spaces (pause)

    sequence.forEach((key, index) => {
        if (key === '-') {
            delay += spaceDelay; // add extra delay for pause
        } else {
            delayDispatchKeyboardEvent(key, delay);
            delay += noteDelay;
        }
    });
}

playSequenceButton.addEventListener("click", () => {
    const sequence = keySequenceTextarea.value.trim().split('');
    playSequence(sequence);
});

document.addEventListener("keydown", pressedKey);
volumeSlider.addEventListener("input", handleVolume);
keysCheckbox.addEventListener("click", showHideKeys);
