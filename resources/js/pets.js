$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
});

// parallax effect
const parallax = document.getElementById('parallax');

window.addEventListener("scroll", function() {
    let offset = window.pageYOffset;
    parallax.style.backgroundPositionY = offset * 0.7 + 'px';
});

// Define params
const secretId = 'mEQQjdPJguNqITS2J6vonPDwQfciH9elGRTluER3'
const apiKey = 'H8TDMo0avTLwWzx10WMPcoDZDyh234p5cMz6EbXVssyIeQz79o';
const url = 'https://api.petfinder.com/v2/';
let petFinder;
let input, myPet, zip, page;
let tempBreed = '';
let computerPick, factsTimeout;
let factCounter = 0;

let facts = [
    "Cats have over one hundred vocal sounds, while dogs only have about ten.",
    "A bird's heart beats 400 times per minute while they are resting.",
    "Many hamsters only blink one eye at a time.",
    "Dogs have about 100 different facial expressions, most of them made with the ears.",
    "A goldfish can live up to 40 years.",
    "Larger parrots such as the macaws and cockatoos live more than 75 years.",
    "A pack of kittens is called a kindle, while a pack of adult cats is called a clowder.",
    "Cats have five toes on each front paw, but only four toes on each back paw.",
    "Dogs do not have an appendix.",
    "Dalmatians are born spotless: at first pure white, their spots develop as they age.",
    "Americans own more than 60 million pet birds.",
    "A garter snake can give birth to 85 babies.",
    "To survive, every bird must eat at least half its own weight in food each day.",
    "Most domestic dogs are capable of reaching speeds up to about nineteen miles per hour when running at full speed.",
    "A cat can jump as much as seven times its height.",
    "The nose pad of each cat has ridges in a unique pattern not unlike a person's fingerprints.",
    "Dogs have about 10 vocal sounds."
];

$(document).ready(function () {
    // Init Pet Finder
    petFinder = new petfinder.Client({ apiKey: apiKey, secret: secretId });

    // Get Animal Types and populate the drop-down
    petFinder.animalData.types()
        .then((res, rej) => {
            res.data.types.map(type => type.name)
                .forEach(name => {
                    $('#pet-types').append(`
                        <option value=${name}>${name}</option>
                    `);
                });
        })
        .catch(err => console.log(err));

    $('#find').on('click', function () {
        event.preventDefault();
        page = 1;                   // reset the pagination
        input = $('#zip').val().trim();

        if(input.match(/^\d{5}$/)) {     // input validation
            zip = input;
            $('#more').css('display', 'block'); // enable the more button
            getPets();
        } else {
            $('#list').empty();
            $('#list').append(`
                <div class="col-sm-12 col-md-6 text-center">
                <img class="img-fluid" src="https://vignette.wikia.nocookie.net/battlefordreamislandfanfiction/images/b/be/Error_Sign_Body_Asset.png/revision/latest?cb=20170426033544" alt="error"><br>
                <h1>Invalid Zip Code!</h1><br>
                <h3>Try Again.</h3>
                </div>`
            );
        }
    });
    
    $('#more').on('click', function () {
        event.preventDefault();
        page++;
        getPets();
    });
    $('#back').on('click', function () {
        event.preventDefault();
        if (page > 1) page--;
        getPets();
    });

    $('#factsBtn').on('click', function () {
        factCounter += 1;
        console.log(factCounter);

        if (!(factCounter % 2 === 0)) {
            getRandomFact();
        } else {
            clearInterval(factsTimeout);
        }
    })
});

async function getPets() {

    const petType = $('#pet-types option:selected').text().trim();
    let searchRes;
    try {
        searchRes = await petFinder.animal.search({
            type: petType,
            location: zip,
            distance: 25,
            page: page,
            limit: 20
        });
    } catch (err) {
        console.log(err);
        $('#list').empty();
        $('#list').append(`
            <div class="col-sm-12 col-md-6 text-center">
            <p>An Error has occurred. :(</p>
            <p>Try Again.</p>
            </div>`);
    }

    if (searchRes && searchRes.data.animals.length > 0) {
        displayResults(searchRes.data.animals);
    } else if (searchRes &&
        (searchRes.data.total_count === 0 || searchRes.data.animals.length === 0)) {
        $('#list').empty();
        $('#list').append(`
            <div class="col-sm-12 col-md-6 text-center">
            <p>No results found :(</p>
            <p>Try a different search</p>
            </div>`);
    }
}

function displayResults(response) {

    let modal = $('#list');
    modal.empty();                          // empty the contents of the div
    response.forEach(function (record) {
        const petName = record.name;
        const id = record.id;
        let breed;
        let age = record.age;
        let img;

        // test for images
        if (!jQuery.isEmptyObject(record.photos)) {
            img = record.photos[0].medium;
        } else {
            img = "https://pawedin.com/system/pets/default_images/default_pet.jpg";
        }

        if(!jQuery.isEmptyObject(record.breeds)) {
            // in the case of multiple breeds
            if(Array.isArray(record.breeds)) {                // check to see if the object is an array
                record.breeds.forEach(function (arrayItem) {
                    tempBreed += (arrayItem.primary + arrayItem.secondary + '');               // concatenate the breed names
                });
                breed = tempBreed.trim();
                tempBreed = '';
            } else {
                breed = record.breeds.primary;
            }
        }

        modal.append(`
            <div id="animals" class="col-sm-4 col-md-3">
                <img src="${img}"  id="petImg" alt="${petName}"><br>
                <div class="container" id="petInfo">
                <span>Name: <a href="https://www.petfinder.com/petdetail/${id}" target="_blank">${petName}</a></span><br>
                <span>Breed: ${breed}</span><br>
                <span>Age: ${age}</span>
                </div>
            </div>`);
    });

}

function getRandomFact() {

    clearInterval(factsTimeout);            // clear the interval from last time
    computerPick = facts[Math.floor(Math.random() * facts.length)];            // select a random fact
    let factDiv = $(".factIs");
    factDiv.empty();
    factDiv.append(`<p>${computerPick}</p>`);       // append the question to the section

    factsTimeout = setInterval(getRandomFact, 5000);    //
}