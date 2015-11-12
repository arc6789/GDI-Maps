
L.mapbox.accessToken = 'pk.eyJ1IjoiYXJjNjc4OSIsImEiOiIyUU9lcmdJIn0.nZKA7rHTaVFz-M2oTt2ZMA';
var map = L.mapbox.map('map', 'arc6789.78f63ca4').setView([37.7833, -122.4167], 13);  /*examples.map-i86nkdio*/ 
var geocoder = L.mapbox.geocoder('mapbox.places');//

var MEETUP_URL = "";

function awesomeClick(){
    var htmlString = "";
    var meetup_key= document.getElementById('meetup-key').value;
    var meetup_event=document.getElementById('meetup-event').value;
    var meetup_city = document.getElementById('city-geocode').value; //

    if(meetup_key=="" || meetup_event==""){
      alert('Please enter a valid Meetup key and Meetup event')
    };  

    geocoder.query(meetup_city, showMap); //

    function showMap(err, data) {
      // The geocoder can return an area, like a city, or a
      // point, like an address. Here we handle both cases,
      // by fitting the map bounds to an area or zooming to a point.
      if (data.lbounds) {
          map.fitBounds(data.lbounds);
      } else if (data.latlng) {
          map.setView([data.latlng[0], data.latlng[1]], 13);
      }
    }

    $(document).ready(function(){
          
      var MEETUP_URL = "http://api.meetup.com/2/events?key="+meetup_key+"&offset=0&format=json&limited_events=False&group_urlname="+meetup_event+"&sign=true&photo-host=public&page=20&fields=&order=time&desc=false&status=upcoming&callback=";

      function convert(epoch){
        var epoch;
        var myDate = new Date(epoch);
        return myDate.toLocaleString();

       }; 
      
        $.ajax({

          url: MEETUP_URL,
          type: "GET",
          dataType: 'jsonp',
          cache: false,
          success: function(response){  
              $.each(response.results, function (i, item) {
                  var mgeojson = L.mapbox.featureLayer({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        // coordinates here are in longitude, latitude order because
                        // x, y is the standard for GeoJSON and many formats
                        coordinates: [
                          item.venue.lon,
                          item.venue.lat
                        ]
                    },
                    properties: {
                        title: item.venue.name,
                        description: item.venue.address_1,
                        'marker-size': 'small',
                        'marker-color': '#f95a61', /*#f95a61 #BE9A6B*/
                        // 'marker-symbol': 'cafe',
                    }
                        
                  })

                  mgeojson.addTo(map);
                  htmlString += '<h5><a href=\"www.google.com\"' + item.link + '" target="_blank">' + item.name + '</a></h5>';
                  htmlString += '<p> Address: ' + item.venue.address_1 + '</br></p>' ;
                  // htmlString += 'lon ' + item.venue.lon + ' lat ' + item.venue.lat + "<br/>";
                  htmlString += '<p>'+ convert(item.time)+'</br></p>';
                  // htmlString += '<button> Click this</button>'; 
                  htmlString += '<hr>';

                  $("ol").append(htmlString);
                  htmlString="";
                  
                  // console.log(response.results, i, item );
              }); /* end of .each item*/
          } /*end of sucess response*/
 
        }); /*ajax request ends */

    });

};






