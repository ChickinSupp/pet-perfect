let map;
const address = [];
const apiKey = "AIzaSyDEewIlfcIcurMzXVtLW1QTqvCp19nhuLA";

const placeIDs = [];
let isPlaceComp = false;

const getAddress = () => {
    let userAdd = $("#user-address").val().trim();

    address.push(userAdd);
}

$(function() {
    $('#google-maps').removeAttr('style');
});

$('#submit-map').on('click', function () {
    getAddress();

    let userAddress = address.join();
    let coords;
    let queryUrl =`https://maps.googleapis.com/maps/api/geocode/json?address=${userAddress}&key=${apiKey}`;

    $.ajax({
        url: queryUrl,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        var source = response.results;
        for (var i = 0; i < source.length; i++) {
            coords = { lat: source[i].geometry.location.lat, lng: source[i].geometry.location.lng };
            console.log(coords);
        }
        initMap(coords);
    });
});

const initMap = (coords) => {
    map = new google.maps.Map(document.getElementById('google-maps'), {
        center: coords,
        zoom: 11
    });
    getVetPlaces(coords);

}

const getVetPlaces = (coords) => {
    let coordsArr = [];

    for(num in coords){
        coordsArr.push(coords[num]);
    }

    let originalUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=${coordsArr[0]},${coordsArr[1]}&radius=10000&type=veterinary_care&key=${apiKey}`;
    let queryUrl = "https://cors-anywhere.herokuapp.com/" + originalUrl;

    $.ajax({
        url: queryUrl,
        method: 'GET',
        dataType: "json",
        headers: {
            "x-requested-with" : "xhr"
        }
    }).then(function(response){
        let source = response.results;
        for( var i = 0; i < source.length; i++ ){
            let place = {
                id : source[i].place_id
            }

            placeIDs.push(place);

        }
        isPlaceComp = true;
        console.log(placeIDs);
        renderMarks(map);
    });
}

const renderMarks = (map) => {
    console.log("IT runs, it scores");
    let infowindow = new google.maps.InfoWindow();
    let service = new google.maps.places.PlacesService(map);
    for(var i = 0; i < placeIDs.length; i++ ){
    
    service.getDetails({
      placeId: placeIDs[i].id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent('<div id="fade-test"><strong>' + place.name + '</strong><br>' +
            'Rating: ' + place.rating + '<br>' + place.formatted_phone_number + '<br>' +
            place.formatted_address + '</div>');
          infowindow.open(map, this);
        });
      }
    });
    }
}
