
// Build an array to store the button data

let topics = ['rocket', 'space', 'planet', 'satellite', 'alien', 'shuttle'];
let reRequest = false;
// Turn array into buttons and append to the DOM

let buttonSection = document.getElementById('button_area');
let gifBullPen = document.getElementById('queued_area');
let gifPlaying = document.getElementById('currently_watching');
let gifSeen = document.getElementById('seen_gif_div');
let gifFavorites = document.getElementById('favorite_area');
let favoritesLocalStorage = 1;
let watchingAreaNode = 0;
let gifIdNumber = 0;
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
        gifPlayer(grabbedGif, grabbedGif.parentNode);
    };
    if(grabId === "add_form_submit") {
        formValidation();
    }
    if(grabId === 'favorite') {
        moveToFavorites();
    };
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
    if(topics.length < 12) {
        if(topics.indexOf(toArray) === -1) {
            topics.push(toArray);
        };
    } else {
        if(topics.indexOf(toArray) === -1) {
            topics.shift();
            topics.unshift(toArray);
        };
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
    });
};


// Display 10 gifs based on which button is pressed

function gifPublisherInitial(res, buttonPressed) {
    let classCheck = gifBullPen.getAttribute('class');
    let childCheck = gifBullPen.childNodes[3].hasChildNodes();
    if(buttonPressed !== classCheck) {
        while(childCheck === true) {
            gifBullPen.childNodes[3].removeChild(gifBullPen.childNodes[3].firstChild);
            childCheck = gifBullPen.childNodes[3].hasChildNodes();
        };
        gifBullPen.setAttribute('class', buttonPressed);
        for(let i = 0 ; i < 10; i ++) {
            let gifDiv = document.getElementById('gif_div');
            let gifStill = res.data[i].images.fixed_height_small_still.url;
            let gifMoving = res.data[i].images.fixed_height.url;
            let gifHolder = document.createElement('figure');
            let gifImage = document.createElement('img');
            let gifCaption = document.createElement('figcaption');
            let gifRating = res.data[i].rating;
            gifCaption.textContent = `Category: ${buttonPressed} / Rating: ${gifRating}`;
            gifImage.dataset.still = gifStill;
            gifImage.dataset.move = gifMoving;
            gifImage.dataset.state = 'still';
            gifImage.setAttribute('id', 'gif' + gifIdNumber);
            gifImage.setAttribute('class', 'topic_gif');
            gifImage.src = gifStill;
            gifHolder.appendChild(gifImage);
            gifHolder.appendChild(gifCaption);
            gifHolder.setAttribute('class', 'gif_house');
            gifDiv.appendChild(gifHolder);
            gifIdNumber++;
        };
    } else {
        alert("10 more!");
    };
};

// A different button press will prepend 10 more of the same topic


// Click on a gif to play, click again to stop

function gifPlayer(grabbedGif, gifParent) {
    let dataGrab = grabbedGif.dataset;
    if(dataGrab.state === 'still') {
        dataGrab.state = 'running';
        gifStager(gifParent);
        grabbedGif.setAttribute('src', dataGrab.move);
    } else {
        dataGrab.state = 'still';
        grabbedGif.setAttribute('src', dataGrab.still);
    };
};

// This will move the gif into the watched area, and also clear the watched area

function gifStager(gifParent) {
    if(gifPlaying.childNodes[watchingAreaNode] !== undefined) {
        stageClear();
    };
    gifPlaying.appendChild(gifParent);
};

// Clears currently playing gif and stores it in favorites

function moveToFavorites() {
    let currentlyPlaying = gifPlaying.childNodes[watchingAreaNode];
    if(currentlyPlaying.childNodes[0].className !== 'topic_gif favorited_gif') {
        currentlyPlaying.childNodes[0].setAttribute('class', 'topic_gif favorited_gif');
        gifFavorites.appendChild(currentlyPlaying);
        stopCleared(currentlyPlaying);
    } else {
        gifFavorites.appendChild(currentlyPlaying);
        stopCleared(currentlyPlaying);
    };
};

// This clears the currently playing gif

function stageClear() {
    let currentlyPlaying = gifPlaying.childNodes[watchingAreaNode];
    if(currentlyPlaying.childNodes[0].className === 'topic_gif favorited_gif') {
        moveToFavorites();
    } else {
        stopCleared(currentlyPlaying);
        gifSeen.appendChild(currentlyPlaying);
    };
};

function stopCleared(currentlyPlaying) {
    if(currentlyPlaying !== undefined) {
        currentlyPlaying.childNodes[0].dataset.state = 'still'
        currentlyPlaying.childNodes[0].setAttribute('src', currentlyPlaying.childNodes[0].dataset.still);
    };
};