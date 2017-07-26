/**
 * Created by C4.17 Team 4 Hackathon 2 on 5/10/2017.
 */

/**
 * load stuff when document start
 */
$(document).ready(function () {
  clickHandler();
  getCurrentLocation();
});

/**
 * wait for enter key to get pressed
 * @
 */
$(document).keypress(function (e) {
  if (e.which == 13) {
    searchFunction();
  }
});

/**
 * restaurants - global array to hold restaurants
 * @type {Array}
 */
var restaurants = [];
var search_term = 'hole in the wall ';

/**
 * user_location - global variable that, as an absolute worst-case scenario, default the user location to the LF HQ
 * @type {{lat: number, lng: number}}
 */
var user_location = {
  lat: 33.634910999999995,
  lng: -117.7404998
};

/**
 * search_location - global variable that stores location that is searched
 */
var search_location = user_location;

/**
 * map - global object for map
 * @type {Object}
 */
var map;

/**
 *
 * @type {[array]} //used to hold a list of common food categories and/or terms that would return results
 */
var common_categories = ['Thai', 'Mexican', 'Japanese', 'Sushi', 'Sandwich', 'Chinese', 'Pizza', 'American', 'Burgers', 'Seafood', 'Italian', 'Vietnamese', 'Coffee', 'Latin American', 'Salad', 'Koren', 'BBQ'];

/**
 * clickHandler - Event Handler when user clicks the search button
 */
function clickHandler() {
  var $alert = $('#alert-location');
  $('#button-search').click(function () {
    if ($('#input-location').val() === '') {
      $alert
        .css('display', 'block')
        .addClass('animated bounceIn');
      setTimeout(function () {
        $('#alert-location').removeClass('animated bounceIn');
      }, 500);
    } else {
      $alert
        .removeClass('animated bounceIn')
        .css('display', 'none');
      searchFunction();
    }
  });
  $('#back-to-front').click(function () {
    $('.search-container')
      .removeClass('animated fadeOutLeftBig')
      .addClass('animated fadeInLeftBig');

    // clear the existing results
    setTimeout(function () {
      map = {};
      $('.map-header').text('Loading...');
      $('#map').empty();
    }, 1000);
  });
}

/**
 * search function
 *
 */
function searchFunction() {
  search_term = 'hole in the wall ';
  user_input = $('#input-food').val();
  search_term += user_input;
  search_location = $('#input-location').val();
  ajaxCall(search_term, search_location);
  $('.search-container')
    .removeClass('animated fadeInLeftBig')
    .addClass('animated fadeOutLeftBig');
}

/**
 * ajaxCall - get json info from php file and if it is success, push info to restaurants,
 *              else console.log an error
 * @params term - input of the term the user is searching
 * @params search_location - the area the user input and/or their current location
 */
function ajaxCall(term, search_location) {
  $.ajax({
    method: 'get',
    dataType: 'json',
    data: {
      'location': search_location,
      'term': term
    },
    url: 'yelp.php',
    success: function (response) {
      restaurants = response;

      // Occasionally Yelp bugs out and doesn't send us lat/long coordinates,
      // if that's the case, we need to remove those places from the results array
      for (var i = 0; i < restaurants.length; i++) {
        if (!restaurants[i].coordinates.latitude || !restaurants[i].coordinates.longitude){
          restaurants.splice(i, 1);
        }
      }

      initMap();
      $('.map-title').text('Check out these ' + restaurants.length + ' spots near ' + search_location);
      if (restaurants.length === 0) {
        noResultsModal();
      }
    },
    error: function (response) {
      console.log(response);
    }
  });
}

/**
 * function that will pop-up if the search result is zero
 */
function noResultsModal() {
  $('.modal-body').empty();
  var categories_div = $('<div>', {
    class: 'modal-div no-results'
  });
  $('.modal-title').text('Uh-Oh!');
  $('.modal-title').addClass('no-results-header');
  $(categories_div).append('Sorry but there are no results for ' + user_input + ' near ' + search_location + '.');
  $(categories_div).append('<br>' + 'Try one of these common food categories:');
  var categories_list = $('<ul>');
  for (i = 0; i < common_categories.length; i++) {
    var food_category_li = $('<li>');
    $(food_category_li).append(common_categories[i]);
    $(categories_list).append(food_category_li);
  }
  $('.modal-body').append(categories_div, categories_list);
  $('#restaurant-modal').modal('show');
}

/**
 * initMap - initialize map object and setting up markers
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(findCenterForMap()[0], findCenterForMap()[1]),
    zoom: 13,
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeId: 'roadmap',
    styles: googleMapRetro
  });

  for (var i = 0; i < restaurants.length; i++) {
    var restaurant_name = "";
    for (var j = 0; j < 13 && j < restaurants[i].name.length; j++) {
      restaurant_name += restaurants[i].name[j];
    }
    if (restaurants[i].name.length > 13) {
      restaurant_name += '...';
    }

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(restaurants[i].coordinates.latitude, restaurants[i].coordinates.longitude),
      map: map,
      icon: 'img/label-bg.png',
      mapId: i,
      label: restaurant_name
    });
    marker.addListener('click', function () {
      var business = restaurants[this.mapId];
      modalEdits(business);
    });
  }
}

/**
 * findCenterForMap - get all the latitude and longitude and added them together and get back average location for each one
 * @returns {[*,*]}
 */
function findCenterForMap() {
  var globalTotalLat = 0;
  var globalTotalLng = 0;
  for (var i = 0; i < restaurants.length; i++) {
    globalTotalLat += restaurants[i].coordinates.latitude;
    globalTotalLng += restaurants[i].coordinates.longitude;
  }
  globalTotalLat /= restaurants.length;
  globalTotalLng /= restaurants.length;
  return [globalTotalLat, globalTotalLng];
}

/**
 * modalEdits - set up modal and modify it
 * @param business
 */
function modalEdits(business) {
  $('.modal-title').text(business.name);
  $('.modal-title').removeClass('no-results-header');
  var div = $('<div>', {
    class: 'modal-div'
  });
  var img = $('<img>', {
    src: business.image_url
  });
  var address = $('<h4>', {
    text: 'Address'
  });
  var address_info = $('<p>', {
    text: formatAddress(business.location)
  });
  var categories = $('<h4>', {
    text: 'Categories'
  });
  var categories_listing = business.categories[0].title;
  for (var i = 1; i < business.categories.length; i++) {
    categories_listing += ", " + business.categories[i].title;
  }
  var categories_info = $('<p>', {
    text: categories_listing
  });
  var website_url = $('<a>', {
    text: 'View on Yelp',
    href: business.url,
    target: '_blank'
  });

  var rating = $('<h4>', {
    text: 'Rating'
  });
  var rating_info = $('<p>');

  for (var i = 0; i < business.rating; i++) {
    var full_star = $('<img>', {
      src: "img/Star.png",
      height: '20px'
    });
    if (i + 0.5 === business.rating) {
      var half_star = $('<img>', {
        src: "img/Half Star.png",
        height: '20px'
      });
      $(rating_info).append(half_star);
    }
    else {
      $(rating_info).append(full_star);
    }
  }

  $(div).append(img, address, address_info, categories, categories_info, rating, rating_info, website_url);
  $('.modal-body').empty().append(div);
  $('#restaurant-modal').modal('show');
}

/**
 * formatAddress - format the address object that is passed and return the formatted address string
 * @param address
 * @returns {string}
 */
function formatAddress(address) {
  return address.address1 + ", " + address.city + ", " + address.state + " " + address.zip_code;
}

/**
 * getLocation - Get the user's current location using the HTML5 geolocation API,
 * and pass it in object form to the savePosition function
 */
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(savePosition, positionError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

/**
 * savePosition - Takes the position object and saves the lat/lng coords to the user location object
 * @param {object} position
 */
function savePosition(position) {
  user_location = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  getAddressFromCoords();
}

/**
 * getAddressFromCoords - using Google's Reverse Geocoding API, get a human-readable address from the user's location coordinates
 */
function getAddressFromCoords() {
  $.ajax({
    method: 'get',
    dataType: 'json',
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + user_location.lat + ',' + user_location.lng + '&key=AIzaSyAqq4jH5c4jX1asTtuCjYye7CrPotGihto',
    success: function (response) {
      $('#input-location').val(response.results[0].address_components[1].short_name + ', ' + response.results[0].address_components[3].short_name);
    },
    error: function (response) {
      console.log('Unable to convert user\'s coordinates into address: ', response);
    }
  });
}

/**
 * positionError - handles errors if we're unable to determine the user's location
 * @param {object} error
 */
function positionError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
    default:
      console.log("An unknown error occurred.");
  }
}