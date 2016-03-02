// initialize map object
function initialize() {
  var myOptions = {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var loc = [];
  var retail; // to hold the dispensary name
  var marker;
  var upcpArr;
  var strainloc;
  var geocoder = new google.maps.Geocoder();

// initialize on user location with W3C geolocation
  document.getElementById('plotIt').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });

  var map = new google.maps.Map(document.getElementById("map"), myOptions);

  var initialLocation;
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
  var address = document.getElementById('hamburger').value;

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
      console.log(userChoice);
      var strainGame;

    // make an ajax call to get strains objects
    $.ajax({
      url: 'https://www.cannabisreports.com/api/v1.0/strains/search/' + userChoice,
      method: 'GET',
      data: {
        key: 'fd6b7cc1c345cdfe7605da9d46a1d5f3dfc614aa'
      },

      dataType: "jsonp",

      })


      .fail(function(err){
        if (err) throw err;
      })

      .done(function(data){
      var query = data;
      console.log(query);
      strainGame = query.data[0].ucpc;

      $.ajax({
      url: 'https://www.cannabisreports.com/api/v1.0/strains/'+strainGame+'/availability/geo/'+loc[0]+'/'+loc[1]+'/25',
      method: 'GET',
      data : {
        key: 'fd6b7cc1c345cdfe7605da9d46a1d5f3dfc614aa'
      },
      dataType: "jsonp",
    })

    .fail(function(err){
        if (err) throw err;
    })

    .done(function(data){
      console.log(data);
      var strainloc = [];        //array of dispensary lat & lng
      var dspot = [];             //array of same dispensary names
        for (i=0; i < data.data.length; i++){
          strainloc.push(data.data[i].location);
          console.log(strainloc);

          dspot.push(data.data[i].location.name);
          console.log(dspot);

          // var disdesc = '<div id="content">'+
          //   '<div id="siteNotice">'+
          //   '</div>'+
          //   '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
          //   '</div>';

          //
          function storeName(){
            for (i=0; i < dspot.length; i++) {
              return dspot[i]
          };
        }

          var infowindow = new google.maps.InfoWindow({
            // content: disdesc
          });

        function dropMarker() {
          var latlng = new google.maps.LatLng(strainloc[i].lat, strainloc[i].lng);
          var marker = new google.maps.Marker({
            position: latlng,
            map: map,
          });
          google.maps.event.addListener(marker, 'click', function(){
            infowindow.close(); // Close previously opened infowindow
            infowindow.setContent( "<div id='infowindow'>"+ dspot[0] +"</div>");
            infowindow.open(map, marker);
          });
        }

        for (i = 0; i < strainloc.length; i++) {
          dropMarker(strainloc[i]);
        }


        }
      })
    })
    })
  });


};


