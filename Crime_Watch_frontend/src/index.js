window.addEventListener('DOMContentLoaded', (event) => {


const POSTURL = 'http://localhost:3000/api/v1/reports'
// const FETCHURL = 'http://localhost:3000/api/v1/reports'

let lat
let lng

const submiBtn = document.getElementById('submit-btn')
const descriptionInput = document.getElementById('description-input')
let inputField = document.getElementById('report-index')
let mymap = L.map('mapid').setView([40.70547963400777, -74.01334879919888], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibWNhcm5lYWwiLCJhIjoiY2p0b2djYmliMWk2dTQ5azZyOGI0bDUzbSJ9.zkhBCYrFE03PBOMS3pVY_w'
}).addTo(mymap);


let circle = L.circle([40.70587193411145,-74.01266098022462], {
    color: 'red',
    fillColor: 'blue',
    fillOpacity: .3,
    radius: 500
}).addTo(mymap);


let polygon = L.polygon([
    [40.72707989466791, -74.0028762817383],
    [40.719534278094905, -74.00545120239259],
    [40.72369748267996, -73.99257659912111]
]).addTo(mymap);


// marker.bindPopup("<b>Hello world!</b><br>I am a popup.")
// circle.bindPopup("<b>I Was Mugged around 2pm</b><br>in this area last night")

// marker.on('click', function(ev){
//   var latlng = mymap.mouseEventToLatLng(ev.originalEvent);
//   console.log(latlng.lat + ', ' + latlng.lng);
// });

mymap.on('click', function(e){
  let coord = e.latlng;
   lat = coord.lat;
   lng = coord.lng;
  console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
  let testMarker = L.marker([lat,lng]).addTo(mymap)
  testMarker.bindPopup(`My latitue is  ${lat} and my longitude is ${lng}` ).openPopup()
  });

  submiBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    data = {lat: lat, lng: lng, description: descriptionInput.value, user_id: 2}
    postNewReport(data)
  })

  function fetchReport(){
    fetch(POSTURL)
  .then(res => res.json())
  .then(renderReport)
  }



  function renderReport(reports){
      reports.forEach(report =>{
        let marker = L.marker([report.lat, report.lng]).addTo(mymap)
        marker.bindPopup(`${report.description} <br> Please Contact: ${report.user.email}`)
      })
  }


  fetchReport()

  function postNewReport(data ={}){
    fetch(POSTURL,{
      method: 'POST',
      headers: {
            "Content-Type": "application/json"
        },
      body: JSON.stringify(data)
    })
  }

  // postNewReport({lat: 9.1, lng: 10.1, description: "test", user_id: 1 })



});
