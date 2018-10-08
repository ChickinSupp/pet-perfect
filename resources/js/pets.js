$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
});

// Define params
let apiKey = '40902c4189b33d9649efd9725215fcf6';
let url = 'http://api.petfinder.com/pet.find';
let input, myPet, zip, myOffset;
let tempBreed = '';

$(document).ready(function () {

    $('#find').on('click', function () {
        event.preventDefault();
        myOffset = 0;                       // reset the pagination
        input = $('#zip').val().trim();

        if(input.match(/^\d{5}$/)) {        // input validation
            zip = input;
            $('#more').css('display', 'block'); // enable the more button
            getPets();
        } else {
            $('#list').empty();
            $('#list').append(`
            <div class="col-sm-12 col-md-6 center">
            <img src="https://vignette.wikia.nocookie.net/battlefordreamislandfanfiction/images/b/be/Error_Sign_Body_Asset.png/revision/latest?cb=20170426033544" alt="error"><br>
            <h1>Invalid Zip Code!</h1><br>
            <h3>Try Again.</h3>
            </div>`);
        }
    });
    
    $('#more').on('click', function () {
        event.preventDefault();
        getPets()
    })

});

function getPets() {
    myPet = $('#pets option:selected').text().toLowerCase();
    console.log(input);
    console.log(myPet);

    $.ajax({
        url: url,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            key: apiKey,
            animal: myPet,
            'location': zip,
            offset: myOffset,
            output: 'basic',
            format: 'json'
        },// Here is where we handle the response we got back from Petfinder
        success: function( response ) {
            console.log(response); // debugging
            myOffset = response.petfinder.lastOffset.$t;        // save the lastOffset value in case user wants more results
            console.log(myOffset);

            if (response) {
                if (response.petfinder.pets.pet.length > 0) {
                    displayResults(response.petfinder.pets.pet);
                }
            }

        },
        error : function(request, error)
        {
            console.log("Request: "+JSON.stringify(request));
        }
    });

}

function displayResults(response) {
    let modal = $('#list');
    modal.empty();
    response.forEach(function (record) {
        let petName = record.name.$t;
        let id = record.id.$t;
        let breed;
        //let breed = record.breeds.breed.$t;
        let age = record.age.$t;
        let img;

        if (!jQuery.isEmptyObject(record.media)) {
            img = record.media.photos.photo[2].$t;
        } else {
            img = "https://pawedin.com/system/pets/default_images/default_pet.jpg";
        }

        if(!jQuery.isEmptyObject(record.breeds.breed)) {
            // in the case of multiple breeds
            if(Array.isArray(record.breeds.breed)) {
                record.breeds.breed.forEach(function (arrayItem) {
                    tempBreed += (arrayItem.$t + '');
                    console.log(tempBreed);
                });
                breed = tempBreed.trim();
                tempBreed = '';
                console.log('Breed: ' + breed);
            } else {
                breed = record.breeds.breed.$t;
            }
        }

        modal.append(`
            <div id="animals" class="col-sm-6 col-md-3">
                <img src="${img}"  id="petImg" alt="${petName}" target="_blank"><br>
                <div class="container" id="petInfo">
                <span>Name: <a href="https://www.petfinder.com/petdetail/${id}">${petName}</a></span><br>
                <span>Breed: ${breed}</span><br>
                <span>Age: ${age}</span>
                </div>
            </div>`);
    });

}


