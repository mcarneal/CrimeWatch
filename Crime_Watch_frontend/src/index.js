window.addEventListener('DOMContentLoaded', (event) => {

let inputField = document.getElementById('report-index')
let mymap = L.map('mapid').setView([40.70547963400777, -74.01334879919888], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibWNhcm5lYWwiLCJhIjoiY2p0b2djYmliMWk2dTQ5azZyOGI0bDUzbSJ9.zkhBCYrFE03PBOMS3pVY_w'
}).addTo(mymap);


var marker = L.marker([51.5, -0.09]).addTo(mymap);

var circle = L.circle([40.70587193411145,-74.01266098022462], {
    color: 'red',
    fillColor: 'blue',
    fillOpacity: .3,
    radius: 500
}).addTo(mymap);


var polygon = L.polygon([
    [40.72707989466791, -74.0028762817383],
    [40.719534278094905, -74.00545120239259],
    [40.72369748267996, -73.99257659912111]
]).addTo(mymap);


marker.bindPopup("<b>Hello world!</b><br>I am a popup.")
circle.bindPopup("<b>I Was Mugged around 2pm</b><br>in this area last night")

// marker.on('click', function(ev){
//   var latlng = mymap.mouseEventToLatLng(ev.originalEvent);
//   console.log(latlng.lat + ', ' + latlng.lng);
// });

mymap.on('click', function(e){
  var coord = e.latlng;
  var lat = coord.lat;
  var lng = coord.lng;
  console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
  var testMarker = L.marker([lat,lng]).addTo(mymap)
  testMarker.bindPopup(`My latitue is  ${lat} and my longitude is ${lng}` ).openPopup()
  inputField.innerHTML+= `<p>Crime reported at the following coordniates: latitude: ${lat} longitude:${lng}</p>`
  });

});
