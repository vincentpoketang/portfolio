/**
 * Created by C4.17 Team 4 Hackathon 2 on 5/10/2017.
 */

/**
 * load stuff when document start
 */
$(document).ready(function(){
    clickHandler();
    getCurrentLocation();
});

/**
 * wait for shift key to get pressed
 * @
 */

$(document).keypress(function(e) {
    if(e.which == 13) {
        searchFunction();
    }
});

/**
 * restaurants - global array to hold restaurantsh
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
    $('#firstButton').click(function () {
        if ($('#input_location').val() === '') {
            $('#alert-location').css('display','block');
            $('#alert-location').addClass('animated bounceIn');
            setTimeout(function(){
                $('#alert-location').removeClass('animated bounceIn');
            }, 500);
        } else {
            $('#alert-location').removeClass('animated bounceIn');
            $('#alert-location').css('display','none');
            searchFunction();
        }
    });
    $('#backToFront').click(function(){
        $('.beforeSearch').removeClass('animated fadeOutLeftBig');
        $('.beforeSearch').addClass('animated fadeInLeftBig');
        // clear the existing results
        setTimeout(function(){
            map = {};
            $('.map_header').text('Loading...');
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
    user_input = $('#input_food').val();
    search_term += user_input;
    search_location = $('#input_location').val();
    ajaxCall(search_term, search_location);
    $('.beforeSearch').removeClass('animated fadeInLeftBig');
    $('.beforeSearch').addClass('animated fadeOutLeftBig');
}

/**
 * ajaxCall - get json info from php file and if it is success, push info to restaurants,
 *              else console.log an error
 * @params term - input of the term the user is searching
 * @params search_location - the area the user input and/or their current location
 */
function ajaxCall(term, search_location) {
    $.ajax({
        method : 'get',
        dataType : 'json',
        data : {
            'location' : search_location,
            'term' : term
        },
        url : 'yelp.php',
        success: function (response){
            restaurants = response;
            initMap();
            console.log(restaurants);
            $('.map_header').text('Check out these ' + restaurants.length + ' spots near ' + search_location);
            if(restaurants.length === 0) {
                noResultsModal();
            }
        },
        error: function (response){
            console.log(response);
            // dummy();
            // // ^
            // // L__fake data when mamp doesnt work
        }
    });
}

/**
 * function that will pop-up if the search result is zero
 */
function noResultsModal() {
    $('.modal-body').empty();
    var categories_div = $('<div>',{
        class: 'modal-div no-results'
    });
    $('.modal-title').text('Uh-Oh!');
    $('.modal-title').addClass('no-results-header');
    $(categories_div).append('Sorry but there are no results for ' + user_input + ' near ' + search_location);
    $(categories_div).append('<br>' + 'Try one of these common food categories:');
    var categories_list = $('<ul>');
    for(i = 0; i < common_categories.length; i++){
        var food_category_li = $('<li>');
        $(food_category_li).append(common_categories[i]);
        $(categories_list).append(food_category_li);
    }
    $('.modal-body').append(categories_div, categories_list);
    $('#myModal').modal('show');
}

/**
 * initMap - initialize map object and setting up markers
 */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(findCenterForMap()[0],findCenterForMap()[1]),
        zoom: 13,
        mapTypeId: 'terrain'
    });
    for(var i = 0; i < restaurants.length; i++){
        var restaurant_name = "";
        for(var j = 0; j < 12 && j < restaurants[i].name.length; j++){
            restaurant_name += restaurants[i].name[j];
        }
        if(restaurants[i].name.length > 12){
            restaurant_name += '...';
        }
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(restaurants[i].coordinates.latitude,restaurants[i].coordinates.longitude),
            map:map,
            icon: 'img/label-bg.png',
            mapId: i,
            label: restaurant_name
        });
        marker.addListener('click',function(){
            var business = restaurants[this.mapId];
            modalEdits(business);
        });
    }
}

/**
 * findCenterForMap - get all the latitude and longitude and added them together and get back average location for each one
 * @returns {[*,*]}
 */
function findCenterForMap(){
    var globalTotalLat = 0;
    var globalTotalLng = 0;
    for(var i = 0; i < restaurants.length; i++){
        globalTotalLat += restaurants[i].coordinates.latitude;
        globalTotalLng += restaurants[i].coordinates.longitude;
    }
    globalTotalLat /= restaurants.length;
    globalTotalLng /= restaurants.length;
    return [globalTotalLat,globalTotalLng];
}

/**
 * modalEdits - set up modal and modify it
 * @param business
 */
function modalEdits(business){
    $('.modal-title').text(business.name);
    $('.modal-title').removeClass('no-results-header');
    var div = $('<div>',{
        class: 'modal-div'
    });
    var img = $('<img>',{
        src: business.image_url
    });
    var address = $('<h4>',{
        text: 'Address'
    });
    var address_info = $('<p>',{
        text: formatAddress(business.location)
    });
    var categories = $('<h4>',{
        text: 'Categories'
    });
    var categories_listing = business.categories[0].title;
    for(var i = 1; i < business.categories.length; i++){
        categories_listing += ", " + business.categories[i].title;
    }
    var categories_info = $('<p>',{
        text: categories_listing
    });

    var rating = $('<h4>',{
        text: 'Rating'
    });
    var rating_info = $('<p>');
    for(var i = 0; i < business.rating; i++){
        var full_star = $('<img>',{
            src: "img/Star.png",
            height: '20px'
        });
        if(i+0.5 === business.rating){
            var half_star = $('<img>',{
                src: "img/Half Star.png",
                height: '20px'
            });
            $(rating_info).append(half_star);
        }
        else {
            $(rating_info).append(full_star);
        }
    }
    $(div).append(img,address,address_info,categories,categories_info,rating,rating_info);
    $('.modal-body').empty().append(div);
    $('#myModal').modal('show');
}

/**
 * formatAddress - format the address that is passed and return the formatted address
 * @param address
 * @returns {string}
 */
function formatAddress(address){
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
        method : 'get',
        dataType : 'json',
        url : 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + user_location.lat + ',' + user_location.lng + '&key=AIzaSyAqq4jH5c4jX1asTtuCjYye7CrPotGihto',
        success: function (response){
            $('#input_location').val(response.results[0].address_components[1].short_name + ', ' + response.results[0].address_components[3].short_name);
        },
        error: function (response){
            console.log('Unable to convert user\'s coordinates into address: ', response);
        }
    });
}

/**
 * positionError - handles errors if we're unable to determine the user's location
 * @param {object} error
 */
function positionError(error) {
    switch(error.code) {
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

/**
 * dummy - dummydata
 */
// function dummy(){
//     restaurants = [
//         {
//             "id": "hole-mole-tustin-3",
//             "name": "Hole Mole",
//             "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/8Fbuh-LdA-9xzC4fyz7MxA/o.jpg",
//             "is_closed": false,
//             "url": "https://www.yelp.com/biz/hole-mole-tustin-3?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw",
//             "review_count": 681,
//             "categories": [
//                 {
//                     "alias": "mexican",
//                     "title": "Mexican"
//                 },
//                 {
//                     "alias": "seafood",
//                     "title": "Seafood"
//                 },
//                 {
//                     "alias": "breakfast_brunch",
//                     "title": "Breakfast & Brunch"
//                 }
//             ],
//             "rating": 4,
//             "coordinates": {
//                 "latitude": 33.73307910864370029457859345711767673492431640625,
//                 "longitude": -117.826818639148001466310233809053897857666015625
//             },
//             "transactions": [],
//             "price": "$",
//             "location": {
//                 "address1": "14430 Newport Ave",
//                 "address2": "",
//                 "address3": "",
//                 "city": "Tustin",
//                 "zip_code": "92780",
//                 "country": "US",
//                 "state": "CA",
//                 "display_address": [
//                     "14430 Newport Ave",
//                     "Tustin, CA 92780"
//                 ]
//             },
//             "phone": "+17145052502",
//             "display_phone": "(714) 505-2502",
//             "distance": 6803.3665635099996507051400840282440185546875
//         },
//
//         {
//             "id": "normitas-surf-city-taco-huntington-beach",
//             "name": "Normita's Surf City Taco",
//             "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/NkXkivj1-pq_Fb8YfWlB-Q/o.jpg",
//             "is_closed": false,
//             "url": "https://www.yelp.com/biz/normitas-surf-city-taco-huntington-beach?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw",
//             "review_count": 458,
//             "categories": [
//                 {
//                     "alias": "mexican",
//                     "title": "Mexican"
//                 },
//                 {
//                     "alias": "breakfast_brunch",
//                     "title": "Breakfast & Brunch"
//                 }
//             ],
//             "rating": 4.5,
//             "coordinates": {
//                 "latitude": 33.6649578809738017071140347979962825775146484375,
//                 "longitude": -117.9893519729379960381265846081078052520751953125
//             },
//             "transactions": [],
//             "price": "$",
//             "location": {
//                 "address1": "815 Indianapolis Ave",
//                 "address2": "",
//                 "address3": "",
//                 "city": "Huntington Beach",
//                 "zip_code": "92648",
//                 "country": "US",
//                 "state": "CA",
//                 "display_address": [
//                     "815 Indianapolis Ave",
//                     "Huntington Beach, CA 92648"
//                 ]
//             },
//             "phone": "+17149608730",
//             "display_phone": "(714) 960-8730",
//             "distance": 18214.35240467999756219796836376190185546875
//         },
//
//         {
//             "id": "taco-adobe-orange",
//             "name": "Taco Adobe",
//             "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/dA56yAjejTAJ1AmI3VheqA/o.jpg",
//             "is_closed": false,
//             "url": "https://www.yelp.com/biz/taco-adobe-orange?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw",
//             "review_count": 526,
//             "categories": [
//                 {
//                     "alias": "seafood",
//                     "title": "Seafood"
//                 },
//                 {
//                     "alias": "tacos",
//                     "title": "Tacos"
//                 }
//             ],
//             "rating": 4,
//             "coordinates": {
//                 "latitude": 33.78837966918950286299150320701301097869873046875,
//                 "longitude": -117.8549499511720028976924368180334568023681640625
//             },
//             "transactions": [],
//             "price": "$",
//             "location": {
//                 "address1": "121 N Lemon St",
//                 "address2": "",
//                 "address3": "",
//                 "city": "Orange",
//                 "zip_code": "92866",
//                 "country": "US",
//                 "state": "CA",
//                 "display_address": [
//                     "121 N Lemon St",
//                     "Orange, CA 92866"
//                 ]
//             },
//             "phone": "+17146280633",
//             "display_phone": "(714) 628-0633",
//             "distance": 13472.013666280001416453160345554351806640625
//         },
//
//         {
//             "id": "taco-grill-westminster",
//             "name": "Taco Grill",
//             "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/WA7hi1XXKULmLvjohaE6Mg/o.jpg",
//             "is_closed": false,
//             "url": "https://www.yelp.com/biz/taco-grill-westminster?adjust_creative=WU6z7FsEd1hqqujqFUQXJw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=WU6z7FsEd1hqqujqFUQXJw",
//             "review_count": 462,
//             "categories": [
//                 {
//                     "alias": "mexican",
//                     "title": "Mexican"
//                 }
//             ],
//             "rating": 4.5,
//             "coordinates": {
//                 "latitude": 33.72332350699979741648348863236606121063232421875,
//                 "longitude": -117.9808550700550000556177110411226749420166015625
//             },
//             "transactions": [],
//             "price": "$",
//             "location": {
//                 "address1": "8481 Heil Ave",
//                 "address2": "",
//                 "address3": "",
//                 "city": "Westminster",
//                 "zip_code": "92683",
//                 "country": "US",
//                 "state": "CA",
//                 "display_address": [
//                     "8481 Heil Ave",
//                     "Westminster, CA 92683"
//                 ]
//             },
//             "phone": "+17148412444",
//             "display_phone": "(714) 841-2444",
//             "distance": 18044.856715879999683238565921783447265625
//         }
//     ];
//     initMap();
// }
