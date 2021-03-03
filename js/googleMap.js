var map;
var markers = [];

///Initializes the google map
function initMap() {
    var mapProp= {
      center:new google.maps.LatLng(44.9727,-93.2354),
      zoom:14,
    };

    //Creates an instance of a map that is displayed on the webpage
    map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

///Each table row has the name, contact information, and location information extracted
///A new tableInfo object is created for each row of the table to hold this information and is stored in the tableInfoList
function tableInfo(name, location, contactInfo) {
    this.name = name;
    this.location = location;
    this.contactInfo = contactInfo;
}

var tableInfoList = [];

///Extract the necessary data from the table
function getTableInfo() {
    //Each <td> element that has data necessary to extract has a class that is either
    //Name, Location, or ContactInfo
    var names = document.getElementsByClassName('Name');
    var addresses = document.getElementsByClassName('Location');
    var contactInfos = document.getElementsByClassName('ContactInfo');

    //names, addresses, and contactInfos are all the same length, since each row has a name, address, and contact Info 
    //Loop through and push a new tableInfo object with the name, address, and contact info for the given row
    for (let i = 0; i <names.length; i++) {
        tableInfoList.push(new tableInfo(names[i].textContent, addresses[i].textContent, contactInfos[i].textContent));
    }
}

///Adds a marker to the map with an infoWindow
///Uses an address to get the location through geocoding 
function addMarkerFromTable(tableInfoItem) {
    const geocoder = new google.maps.Geocoder();

    let address = tableInfoItem.location;
    let name = tableInfoItem.name;
    let contactInfo = tableInfoItem.contactInfo;

    //Geocodes the address to get the location for the marker
    //source: https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple#maps_geocoding_simple-javascript
    geocoder.geocode( { address: address }, (results, status) => {
        if (status === "OK") {
            const marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                icon: 'img/mapMarkerRed.png',
                
            });
            markers.push(marker);
    
            //InfoWindow source: https://developers.google.com/maps/documentation/javascript/infowindows
            const contentString = '<p>' + name + '<br/>' + contactInfo + '<br/>' +  address + '</p>';
            //Creates a new instance of an infoWIndow to be displayed
            const infowindow = new google.maps.InfoWindow({
                content: contentString,
            });
    
            //Displays text above marker when clicked
            marker.addListener("click", () => {
                infowindow.open(map, marker);
            });
        }
        else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });    
}

///Extract the data from the table and add a marker for data from each row when the page loads
window.onload = function() {
    getTableInfo();
    tableInfoList.forEach(addMarkerFromTable);
}

var service;

///Searches for nearby places based on user input
function search() {
    let input = document.getElementById('findTypeID').value;
    if (input == "other") {
        input = document.getElementById('keywordBox').value;
    }

    let radius = document.getElementById('radiusID').value;
    if (radius == "") {
        radius = "500"; //default value for radius if nothing entered
    }

    //Only executes if the user allows location services
    //geolocation source: https://developers.google.com/maps/documentation/javascript/geolocation
    if (navigator.geolocation) {
        clearMarkers();
        removeDirections();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);

                //Search request format
                var request = {
                    location: pos,
                    radius: radius,
                    type: [input]
                };

                //Gets places based on request information and creates markers for them
                //source: https://developers.google.com/maps/documentation/javascript/places#place_search_requests
                service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, (results, status) => {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        for (var i = 0; i < results.length; i++) {
                            createMarker(results[i]);
                        }
                    }
                    else if (status == "ZERO_RESULTS") {
                        alert("No " + input + "s found in " + radius + " meters");
                    }
                });
            },
            // () => {
            //     handleLocationError(true, infoWindow, map.getCenter());
            // }
        );
    }
    else {
        alert('Need to enable location services')
        //handleLocationError(false, infoWindow, map.getCenter());
    }
}

///Creates a marker and adds an infowindow to it
///Source: https://developers.google.com/maps/documentation/javascript/examples/place-search#maps_place_search-javascript
///Marker image source: http://www.pngall.com/map-marker-png/download/17483
function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      icon: 'img/mapMarkerRed.png',
    });
    markers.push(marker);

    let contentString = '<p>' + place.name + '</br>' + place.vicinity + '</p>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
    marker.addListener("click", () => {
        infowindow.open(map, marker);
    });
}

///Clears markers by setting the map to null
///Clears the markers array as well
///Source: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

var directionsList = [];

///Gets and displays directions from the user's current location to the input location
///Source: https://developers.google.com/maps/documentation/javascript/examples/directions-travel-modes
///Source: https://developers.google.com/maps/documentation/javascript/examples/directions-panel
function directions() {

    //Remove existing directions (if any) so there will not be multiple directions on the map
    //if the user changes the destination or mode of travel
    removeDirections();
    clearMarkers();

    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directionsPanel"));
    directionsList.push(directionsRenderer);

    //Get the user's selected mode of travel by looping through the transportation radio buttons
    //to see which one is selected
    let modeOfTravel;
    let transportationRadioButtons = document.getElementsByName('transportation');

    for (let i = 0; i < transportationRadioButtons.length; i++) {
        if (transportationRadioButtons[i].checked) {
            modeOfTravel = transportationRadioButtons[i].value;
            break;
        }
    }

    if (navigator.geolocation) {
        //Get current position for the origin location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const startPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                let destinationAddress = document.getElementById('destinationAddress').value;

                directionsService.route(
                    {
                        origin: { lat: startPos.lat, lng: startPos.lng },
                        destination: destinationAddress,
                        travelMode: google.maps.TravelMode[modeOfTravel],
                    },
                    (response, directionServiceStatus) => {
                        if (directionServiceStatus == "OK") {
                            directionsRenderer.setDirections(response);
                            document.getElementById('sideBySideMap').style.gridTemplateColumns = "1fr 3fr 1fr";
                        }
                        else {
                            alert("Directions request failed due to " + status);
                        }
                    }
                );
            },
        );
    }
    else {
        alert('Must enable location services')
    }
}

///Clears the directions in the same way as clearMarkers
function removeDirections() {
    for (let i = 0; i < directionsList.length; i++) {
        directionsList[i].setMap(null);
        directionsList[i].setPanel(null);
    }
    directionsList = [];
    document.getElementById('sideBySideMap').style.gridTemplateColumns = "0fr 3fr 1fr";
}