let map, playerMarker, correctLocation;
const submitGuessBtn = document.getElementById('submitGuess');
const resultDisplay = document.getElementById('result');
const clueDisplay = document.getElementById('clue');

// Predefined locations with clues
const locations = [
    {
        lat: 48.8584,
        lng: 2.2945,
        clue: "You are near a landmark built in the 19th century that is famous for its iron lattice tower. Can you guess where?"
    },
    {
        lat: 40.6892,
        lng: -74.0445,
        clue: "This location is home to a famous 19th-century statue that represents freedom and democracy. Where are you?"
    },
    {
        lat: 51.5007,
        lng: -0.1246,
        clue: "This landmark is a 17th-century clock tower located in a famous capital city. What is the name of the city?"
    }
];

// Initialize map
function initMap() {
    const center = { lat: 20.5937, lng: 78.9629 };  // Initial map center (India)
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: center
    });

    map.addListener('click', function(e) {
        placeMarker(e.latLng);
    });

    // Load a random location clue and correct location
    loadRandomLocation();
}

// Place player marker where the player clicks
function placeMarker(location) {
    if (playerMarker) {
        playerMarker.setPosition(location);
    } else {
        playerMarker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
}

// Load random location and clues
function loadRandomLocation() {
    const randomIndex = Math.floor(Math.random() * locations.length);
    const randomLocation = locations[randomIndex];

    correctLocation = {
        lat: randomLocation.lat,
        lng: randomLocation.lng
    };

    // Display the corresponding clue
    clueDisplay.innerText = randomLocation.clue;
}

// Calculate the distance between player's guess and the correct location
function calculateDistance(playerPosition, correctPosition) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(correctPosition.lat - playerPosition.lat());
    const dLng = degreesToRadians(correctPosition.lng - playerPosition.lng());
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(degreesToRadians(playerPosition.lat())) * Math.cos(degreesToRadians(correctPosition.lat)) * 
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

// Helper function to convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Check the player's guess and provide feedback
submitGuessBtn.addEventListener('click', function() {
    if (!playerMarker) {
        resultDisplay.innerText = 'Please place a marker on the map!';
        resultDisplay.style.color = 'red';  // Display error message in red
        return;
    }

    const playerPosition = playerMarker.getPosition();
    const distance = calculateDistance(playerPosition, correctLocation);

    if (distance < 100) {
        resultDisplay.innerText = `Correct! You're only ${Math.round(distance)} km away!`;
        resultDisplay.style.color = 'green';  // Display success message in green
    } else {
        resultDisplay.innerText = `Not quite. You're ${Math.round(distance)} km away from the correct location. Try again!`;
        resultDisplay.style.color = 'orange';  // Display warning message in orange
    }
});

// Initialize map on window load
window.onload = initMap;
