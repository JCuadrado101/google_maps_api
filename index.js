function initMap() {
  // Create the map object
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
  });

  // Create the search box and link it to the UI element
  const input = document.getElementById('pac-input');
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the search box to within the bounds of the map
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction
  searchBox.addListener('places_changed', function() {
    const places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    // Clear out the old markers
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location
    const bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
  
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch(`https://widgetdata.azurewebsites.net/atms/search?lat=${latitude}&long=${longitude}&radius=2`, requestOptions)
        .then(response => response.text())
        .then(result => {
          let data = JSON.parse(result);

          for (let i = 0; i < data['data'].length; i++) {

            new google.maps.Marker({
              position: { 
                lat: data['data'][i]["attributes"]['latitude'],
                lng: data['data'][i]["attributes"]['longitude']
              },
              map,
              title: "Hello World"
            })
          }
        })
        .catch(error => console.log('error', error));
      
    });

    map.fitBounds(bounds);
  });

  // Initialize the markers array
  let markers = [];
}
// Call the initMap function when the page loads
window.onload = function() {
  initMap();
};