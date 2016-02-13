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

      },

      dataType: "jsonp",

      })


      .fail(function(err){
        if (err) throw err;
      })

      .done(function(data){
      var query = data;
      strainGame = [query.data[0].name, query.data[0].ucpc];
      // console.log(strainGame[1]);
      // strainGame = 'L2KQMTUFDH000000000000000';

      $.ajax({
      url: 'https://www.cannabisreports.com/api/v1.0/strains/' + strainGame[1] + '/availability/geo/37.7674193/-122.4286195/25',
      method: 'GET',
      data : {

      },
      dataType: "jsonp",
      })

      .fail(function(err){
        if (err) throw err;
      })

      .done(function(data){
      for (i = 0; i < data.data.length; i++){

      var meridian = [data.data[i].location.lat, data.data[i].location.lng];
      console.log(meridian);
    }

    })
    })






    })

});







      // google.maps.event.addDomListener(window, 'load', initialize)
   //EOL



 // EOP

// <!-- for (i = 0; i < query.data.length ;  i++){
//       //   // var hamburger = [parseFloat(query.data[i].lat), parseFloat(query.data[i].lng)];
//       //   // console.log(hamburger);
//       //   var latLng = new google.maps.LatLng(parseFloat(query.data[i].lat),parseFloat(query.data[i].lng));
//       //   var marker = new google.maps.Marker({
//       //     position: latLng,
//       //     map: map
//       //       })
//       //     }
//  -->




      // for (i = 0; i < query.data.length; i++){
      //   var meridian = ([parseFloat(query.data[i].lat), parseFloat(query.data[i].lng)]);
      //   console.log(meridian);
        // var latLng = new google.maps.LatLng(meridian[0],meridian[1]);
        // var marker = new google.maps.Marker({
        //   position: latLng,
        //   map: map
        //       })
