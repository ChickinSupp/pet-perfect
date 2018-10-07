$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
});

// Define params
let apiKey = '40902c4189b33d9649efd9725215fcf6';
let url = 'http://api.petfinder.com/pet.find';

$(document).ready(function () {

    $('#find').on('click', function () {
        event.preventDefault();
        let zip = $('#zip').val().trim();
        let myPet = $('#pets option:selected').text().toLowerCase();
        console.log(zip);
        console.log(myPet);
        getPets(myPet, zip);
    })

});

function getPets(pet, zip) {
    $.ajax({
        url: url,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            key: apiKey,
            animal: pet,
            'location': zip,
            output: 'basic',
            format: 'json'
        },// Here is where we handle the response we got back from Petfinder
        success: function( response ) {
            console.log(response.petfinder.pets.pet); // debugging

            if (response) {
                if (response.petfinder.pets.pet.length > 0) {
                    displayResults(response.petfinder.pets.pet);
                } else {
                    $('#list').append(`<h5>No results matching your criteria. Consider broadening your search.</h5>`);
                }
            } else {
                $('#list').append(`<h5>No results matching your criteria. Consider broadening your search.</h5>`);
            }


        }
    });

}

function displayResults(response) {
    let modal = $('#list');
    modal.empty();
    response.forEach(function (record) {
        let petName = record.name.$t;
        let id = record.id.$t;
        let breed = record.breeds.breed.$t;
        let age = record.age.$t;
        let img;

        if (!jQuery.isEmptyObject(record.media)) {
            img = record.media.photos.photo[2].$t;
        } else {
            img = "https://ubisafe.org/images/nose-vector-dogs.png";
        }

        modal.append(`
            <div id="animals" class="col-md-3">
                <img src="${img}" width="150" height="150" alt="${petName}"><br>
                <span>Name: <a href="https://www.petfinder.com/petdetail/${id}">${petName}</a></span><br>
                <span>Breed: ${breed}</span><br>
                <span>Age: ${age}</span>
            </div>`);
    });

}


