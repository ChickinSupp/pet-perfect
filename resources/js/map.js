const address = [];
const apiKey = "AIzaSyDEewIlfcIcurMzXVtLW1QTqvCp19nhuLA";
const placeIDs = [];
let map;
let isPlaceComp = false;

let parkIDs = [];

//check to see if check boxes are disabled
let btnDisabled = false;

//term to search for
let toSearchFor = "";

//checks to see if user completed form
let isFormComplete = false;

const getAddress = () => {
  let userAdd = $("#user-address")
    .val()
    .trim();

  address.push(userAdd);
};

$(document).ready(function() {
  $(".userChoice").on("click", function() {
    toSearchFor = "";
    toSearchFor = $(this).attr("data-text");
    $('#location-dump').empty();
    isFormComplete = true;
    parkIDs = [];
  });
});

$("#submit-map").on("click", function() {
  getAddress();

  let userAddress = address.join();
  let coords;
  let queryUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${userAddress}&key=${apiKey}`;

  document.querySelector('.container-dimension').style.display = 'block';

  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function(response) {
    var source = response.results;
    for (var i = 0; i < source.length; i++) {
      coords = {
        lat: source[i].geometry.location.lat,
        lng: source[i].geometry.location.lng
      };
    }
    initMap(coords);
  });
});

const initMap = coords => {
  map = new google.maps.Map(document.getElementById("google-maps"), {
    center: coords,
    zoom: 11
  });
  getPetPlaces(coords);
};

const getPetPlaces = coords => {
  let coordsArr = [];

  for (num in coords) {
    coordsArr.push(coords[num]);
  }

  let originalUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
    coordsArr[0]
  },${coordsArr[1]}&radius=10000&keyword=${toSearchFor}&key=${apiKey}`;
  let queryUrl = "https://cors-anywhere.herokuapp.com/" + originalUrl;

  $.ajax({
    url: queryUrl,
    method: "GET",
    dataType: "json",
    headers: {
      "x-requested-with": "xhr"
    }
  }).then(function(response) {
    let source = response.results;
    for (let i = 0; i < source.length; i++) {
      //create obj that holds an id of the place received by the api
      let place = {
        id: source[i].place_id
      };
      //pushes place id into parkIDs
      parkIDs.push(place);
    }
    //renders palce markers to the map
    renderMarks(map, parkIDs);
  });
};

const renderMarks = (map, idArr) => {
  //initialize info window
  let infowindow = new google.maps.InfoWindow();
  // initialize google place details service
  let service = new google.maps.places.PlacesService(map);
  for (let i = 0; i < idArr.length; i++) {
    service.getDetails(
      {
        //passes ids for each of the places in the array
        placeId: idArr[i].id
      },
      function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          //create for a place
          let marker = new google.maps.Marker({
            icon: {
              url: `resources/img/marker/mark3.png`,
              size: new google.maps.Size(22, 43),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(25.5, 29)
            },
            map: map,
            animation: google.maps.Animation.DROP,
            position: place.geometry.location
          });
          marker.addListener("click", toggleBounce);
          //if click on the marker, an info window will render above it showing specific detais about the place
          google.maps.event.addListener(marker, "click", function() {
            infowindow.setContent(
              '<div id="fade-test"><strong>' +
                place.name +
                "</strong><br>" +
                "Rating: " +
                place.rating +
                checkPhone() +
                getTravelUrl(address, place.formatted_address) +
                "</div>"
            );
            infowindow.open(map, this);
          });
          function toggleBounce() {
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
            }
          }
          //checks to see if the place has a phone
          function checkPhone() {
            let phone = place.formatted_phone_number;

            if (typeof phone !== typeof undefined && phone !== false) {
              //if phone number is present, add phone to the content
              return `<br> ${phone} <br>`;
            } else {
              //else just had a space
              return `<br>`;
            }
          }
          //if the place rating is greater than or equal to 4.6, render the follwoing conent to the 'recommendations' div
          if (place.rating >= 4.0) {
            let text = $(
              '<div id="fade-test"><strong>' +
                place.name +
                "</strong><br>" +
                "Rating: " +
                place.rating +
                checkPhone() +
                "</div>" +
                getTravelUrl(address, place.formatted_address)
            );

            $("#location-dump").append(text);
          }
        }
      }
    );
  }
};

//returns googlemap directions url
const getTravelUrl = (origin, destination) => {
  return `<a href="https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving" target="_blank">${destination}</a>`;
};
