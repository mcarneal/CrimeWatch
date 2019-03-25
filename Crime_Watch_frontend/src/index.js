window.addEventListener('DOMContentLoaded', (event) => {


let mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibWNhcm5lYWwiLCJhIjoiY2p0b2djYmliMWk2dTQ5azZyOGI0bDUzbSJ9.zkhBCYrFE03PBOMS3pVY_w'
}).addTo(mymap);


var marker = L.marker([51.5, -0.09]).addTo(mymap);

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: 'blue',
    fillOpacity: .3,
    radius: 500
}).addTo(mymap);




});
