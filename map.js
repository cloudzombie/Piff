// initialize map object
function initialize() {
  var myOptions = {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"), myOptions);
  var infowindow = new google.maps.InfoWindow({
    maxWidth: 150
  });

  var initialLocation;
  var marker;
  var loc = [];
  var strainloc = [];
  var geocoder = new google.maps.Geocoder();

// initialize on user location with W3C geolocation
  document.getElementById('plotIt').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });


  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var browserSupportFlag =  new Boolean();
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.


  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
      // place marker on user location upon initialization
      var marker = new google.maps.Marker({
        position: initialLocation,
        title: 'Your Location',
        map: map
      });

      google.maps.event.addDomListener(window, 'load', initialize)
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  }

  // geocoding function for user to change location
  function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('hotdog').value;

  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      loc[0]=results[0].geometry.location.lat();
      loc[1]=results[0].geometry.location.lng();

      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
    console.log(loc[0], loc[1]);
  });

}

 // get data from API via AJAX request
  $(document).ready(function() {
    $('#strainhunter').on('submit', function(event){
      event.preventDefault();
      var userChoice = $('#hamburger').val();
      var strainGame;

    // make an ajax call to get strains objects
    $.ajax({
      url: 'https://www.cannabisreports.com/api/v1.0/strains/search/' + userChoice,
      method: 'GET',
      data: {
        key: 'fd6b7cc1c345cdfe7605da9d46a1d5f3dfc614aa'
      },

      dataType: "json",

      })


      .fail(function(err){
        if (err) throw err;
      })

      .done(function(data){
      var query = data;
      strainGame = query.data[0].ucpc;

      $.ajax({
      url: 'https://www.cannabisreports.com/api/v1.0/strains/'+strainGame+'/availability/geo/'+loc[0]+'/'+loc[1]+'/25',
      method: 'GET',
      data : {
        key: 'fd6b7cc1c345cdfe7605da9d46a1d5f3dfc614aa'
      },
      dataType: "json",
    })

    .fail(function(err){
        if (err) throw err;
    })

    .done(function(data){
        for (i=0; i < data.data.length; i++){
            strainloc.push(data.data[i].location);
          };

        function dropMarker(loc) {
          var latlng = new google.maps.LatLng(loc.lat, loc.lng);
          var marker = new google.maps.Marker({
            position: latlng,
            map: map,
          });
          google.maps.event.addListener(marker, 'click', function(){
            infowindow.close(); // Close previously opened infowindow
            infowindow.setContent( "<div id='infowindow'>" + "</div>");
            infowindow.open(map, marker);
            $.ajax({
              url: loc['link'],
              method: 'GET',
              data: {
                key: 'fd6b7cc1c345cdfe7605da9d46a1d5f3dfc614aa'
              },
              dataType: 'json'
            })

            .fail(function(err){
              if (err) throw err;
            })
            .done(function(data){
              $("#infowindow").append("<h1><a href=" + data.data.url + ">" + loc['name'] + "</a></h1>" + "<p>" + data.data["city"] + "," + data.data["state"] + "<br>" +data.data.address["address1"] + "<br>" +data.data.address["zip"] + "</p>");
            });
          });
        } // end of dropMarker

        for (i = 0; i < strainloc.length; i++) {
          dropMarker(strainloc[i]);
        };
      }) // end of .done function
    })
    })
  });
};


