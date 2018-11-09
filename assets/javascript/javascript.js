
// Build an array to store the button data

let topics = ['rocket', 'laser', 'space', 'planet', 'satellite', 'alien', 'shuttle', 'meteor', 'asteroid'];
let reRequest = false;
// Turn array into buttons and append to the DOM

let buttonSection = document.getElementById('button_area');
let gifBullPen = document.getElementById('queued_area');
let gifPlaying = document.getElementById('watching_area');
let gifSeen = document.getElementById('watched_area');
let gifFavorites = document.getElementById('favorite_area');
let favoritesLocalStorage = 1;
let watchingAreaNode = 5;
// let downloadButton = document.getElementById('download');

function buttonAdder() {
    while(buttonSection.hasChildNodes()) {
        buttonSection.removeChild(buttonSection.firstChild);
    };
    for(let i = 0; i < topics.length; i++) {
        let buttonizer = document.createElement('button');
        buttonizer.textContent = topics[i];
        buttonizer.setAttribute('id', 'search' + i);
        buttonizer.setAttribute('class', 'topic_button');
        buttonSection.appendChild(buttonizer);
    };
};

buttonAdder();

// Prevent submit default

document.getElementById('add_form_submit').addEventListener('click', function(event) {
    event.preventDefault();
});

// Event delegation to allow button clicks to be montiored

document.addEventListener('click', function(e) {
    let grabId = '';
    let grabClass = '';
    grabId = e.target.id;
    grabClass = e.target.className;
    if(grabClass === 'topic_button') {
        let grabbedButton = document.getElementById(grabId);
        let buttonPressed = grabbedButton.textContent;
        gifRetriever(buttonPressed);
    };
    if(grabClass === 'topic_gif' || grabClass === 'topic_gif favorited_gif') {
        let grabbedGif = document.getElementById(grabId);
        gifPlayer(grabbedGif);
    };
    if(grabId === "add_form_submit") {
        formValidation();
    }
    if(grabId === 'favorite') {
        moveToFavorites();
    };
    // Add a button focus function that will make it obvious which button has been selected
    // Maybe have it say "click me for more of the same"    
});

// Turn text entered into the search field, and add to the end of existing butotns

function formValidation() {
    let addChecker = document.forms['button_add']['add_this'];
    if(addChecker.value === '') {
        alert('Please enter a Gif keyword you would like to search');
    } else {
        formToArray(addChecker);
    };
};

function formToArray(addChecker) {
    let toArray = addChecker.value;
    if(topics.indexOf(toArray) === -1) {
        topics.push(toArray);
    }
    addChecker.value = '';
    buttonAdder();
};

// API call to GIPHY based on which butotns are pressed

function gifRetriever(buttonPressed) { 
    let apiQueryURL = `https://api.giphy.com/v1/gifs/search?q=${buttonPressed}&api_key=t8Z9NbgWFivLfTMNNBZORucEY3zm66zC&`;
    $.ajax({
        url: apiQueryURL,
        method: 'GET'
    }).then(function(response) {
        gifPublisherInitial(response, buttonPressed);
        console.log(response);
    });
};


// Display 10 gifs based on which button is pressed

function gifPublisherInitial(res, buttonPressed) {
    let classCheck = gifBullPen.getAttribute('class')
    if(buttonPressed !== classCheck) {
        while(gifBullPen.hasChildNodes()) {
            gifBullPen.removeChild(gifBullPen.firstChild);
        };
        gifBullPen.textContent = 'Not Yet Watched';
        gifBullPen.setAttribute('class', buttonPressed);
        for(let i = 0 ; i < 10; i ++) {
            let gifStill = res.data[i].images.fixed_height_small_still.url;
            let gifMoving = res.data[i].images.fixed_height.url;
            let gifPaste = document.createElement('img');
            gifPaste.dataset.still = gifStill;
            gifPaste.dataset.move = gifMoving;
            gifPaste.dataset.state = 'still';
            gifPaste.setAttribute('id', 'gif' + i);
            gifPaste.setAttribute('class', 'topic_gif');
            gifPaste.src = gifStill;
            gifBullPen.appendChild(gifPaste);
        };
    } else {
        alert("10 more!");
    };
    if(gifPlaying.childNodes[watchingAreaNode] !== undefined) {
        stageClear();
    };
};

// A different button press will prepend 10 more of the same topic

// Display the rating above the gif

function cardPublisher(res) {
    for(let i = 0; i < 10; i++) {
        letGifInfo = document.createElement('p')

    };
};

// Click on a gif to play, click again to stop

function gifPlayer(grabbedGif) {
    let dataGrab = grabbedGif.dataset;
    if(dataGrab.state === 'still') {
        dataGrab.state = 'running';
        gifStager(grabbedGif);
        grabbedGif.setAttribute('src', dataGrab.move);
    } else {
        dataGrab.state = 'still';
        grabbedGif.setAttribute('src', dataGrab.still);
    };
};

// This will move the gif into the watched area, and also clear the watched area

function gifStager(grabbedGif) {
    if(gifPlaying.childNodes[watchingAreaNode] !== undefined) {
        stageClear();
    };
    gifPlaying.appendChild(grabbedGif);
    // downloadGifSet();
};

// Allows user to download gif

// function downloadGifSet() {
//     let gifToDownload = gifPlaying.childNodes[watchingAreaNode].dataset.move;
//     downloadButton.setAttribute('href', gifToDownload);
// };

// Clears currently playing gif and stores it in favorites

function moveToFavorites() {
    let currentlyPlaying = gifPlaying.childNodes[watchingAreaNode];
    if(currentlyPlaying.className !== 'topic_gif favorited_gif') {
        localStorage.setItem(favoritesLocalStorage, currentlyPlaying.dataset.still);
        favoritesLocalStorage++;
    };
    currentlyPlaying.setAttribute('class', 'topic_gif favorited_gif');
    gifFavorites.appendChild(currentlyPlaying);
    stopCleared(currentlyPlaying);
};

// This clears the currently playing gif

function stageClear() {
    let currentlyPlaying = gifPlaying.childNodes[watchingAreaNode];
    if(currentlyPlaying.className === 'topic_gif favorited_gif') {
        moveToFavorites();
    } else {
        gifSeen.appendChild(currentlyPlaying);
        stopCleared(currentlyPlaying);
    };
};

function stopCleared(currentlyPlaying) {
    if(currentlyPlaying !== undefined) {
        currentlyPlaying.dataset.state = 'still'
        currentlyPlaying.setAttribute('src', currentlyPlaying.dataset.still);
    };
};