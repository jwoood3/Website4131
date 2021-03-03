var map;

function initMap() {
    var mapProp= {
      center:new google.maps.LatLng(44.9727,-93.2354),
      zoom:14,
    };

    //Creates an instance of a map that is displayed on the webpage
    map = new google.maps.Map(document.getElementById("formGoogleMap"),mapProp);

    const geocoder = new google.maps.Geocoder();
    var input = document.getElementById('locationEntry');
    var autocomplete = new google.maps.places.Autocomplete(input);

    map.addListener("click", function(event) {
        if (typeof event.placeId != "undefined") {
            geocoder.geocode( { placeId: event.placeId }, (results, status) => {
                if (status == "OK") {
                    input.value = results[0].formatted_address;
                }
            });
        }
    }
    
    );
}