
// Build an array to store the button data

let topics = ['rocket', 'laser', 'space', 'planet', 'satellite', 'alien', 'shuttle', 'meteor', 'asteroid'];
let reRequest = false;
// Turn array into buttons and append to the DOM

let buttonSection = document.getElementById('button_area');

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

// Event delegation to allow button clicks to be montiored

buttonSection.addEventListener('click', function(e) {
    let grabId = e.target.id;
    let grabbedButton = document.getElementById(grabId);
    let buttonPressed = grabbedButton.textContent;
    // Maybe change the button to say "More!"
    // Add a class to "More!" to allow you to pull more of the same gifs
    gifRetriever(buttonPressed);
});

// Turn text entered into the search field, and add to the end of existing butotns

// API call to GIPHY based on which butotns are pressed

function gifRetriever(buttonPressed) { 
    let apiQueryURL = `https://api.giphy.com/v1/gifs/search?q=${buttonPressed}&api_key=t8Z9NbgWFivLfTMNNBZORucEY3zm66zC&`;
    console.log(apiQueryURL);
    $.ajax({
        url: apiQueryURL,
        method: 'GET'
    }).then(function(response) {
        console.log(response);
    });

};


// Display 10 gifs based on which button is pressed



// A different button press will prepend 10 more of the same topic

// Display the rating above the gif