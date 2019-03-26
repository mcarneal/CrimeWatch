window.addEventListener('DOMContentLoaded', (event) => {

  let USERNAME
  let USERID

  const loadLoginInterface = () => {
    // start of loadinterface
    const USERURL = 'http://localhost:3000/api/v1/users'
    const loginDiv = document.querySelector(".login")
    const welcomeBanner = document.getElementById('welcome-banner')
    let reportIndexDiv = document.createElement('div')
    const createElement = (e) => {
      return document.createElement(e)
    }
    const loginField = createElement("input")
    const loginBtn = createElement("button")
    loginField.id = "login-field"
    loginField.value = '     Enter username'
    loginBtn.id = 'login-btn'
    loginBtn.innerText = 'login'
    loginDiv.appendChild(loginField)
    loginDiv.appendChild(loginBtn)


    loginBtn.addEventListener("click", (e)=>{
      const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (regexp.test(loginField.value)) {
        USERNAME = {email: loginField.value}
        createUser(USERNAME)
        loginDiv.innerHTML = ''
        loadUserInterface()
      } else {
          alert("You have entered an invalid email address!")
      }
    })


    const createUser = (id) => {
      fetch(USERURL,{
        method: 'POST',
        headers: {
              "Content-Type": "application/json"
          },
        body: JSON.stringify(id)
      }).then(res => res.json())
    }

    /// end of LoadInterface
  }

  const loadUserInterface = () => {
  const row = document.querySelector(".row")
    const reportIndexDiv = document.createElement('div')
    reportIndexDiv.id = 'report-index'
    const reportDivUl = document.createElement("ul")
    reportDivUl.id = 'report-ul'
    reportIndexDiv.appendChild(reportDivUl)
    row.appendChild(reportIndexDiv)
    const POSTURL = 'http://localhost:3000/api/v1/reports'
    const mapDiv = document.getElementById("mapid")
    let lat
    let lng
    let descriptionInput
    let testMarker
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



    mymap.on('click', function(e){
    let coord = e.latlng;
     lat = coord.lat;
     lng = coord.lng;
     if (testMarker){
        mymap.removeLayer(testMarker)
     } testMarker = L.marker([lat,lng]).addTo(mymap)
     testMarker.bindPopup(`<br>description<input type="text" id='description-input'><br>
     <input type="submit" value="Submit" id='submit-btn'>` ).openPopup()
     descriptionInput = document.getElementById('description-input')
     fetchReport()
   })


    const fetchReport = () => {
      fetch(POSTURL)
      .then(res => res.json())
      .then(renderReport)
    }

    const renderReport = (reports) => {
      reports.forEach(report => {
        let marker = L.marker([report.lat, report.lng]).addTo(mymap)
        marker.bindPopup(`${report.description} <br> Please Contact: ${report.user.email}`)
      })
    }

    const postNewReport = (data) => {
      fetch(POSTURL,{
        method: 'POST',
        headers: {
              "Content-Type": "application/json"
          },
        body: JSON.stringify(data)
      })
    }

    const fetchUserID = () => {
      fetch('http://localhost:3000/api/v1/users')
      .then(res => res.json())
      .then(assignUserID)
    }

    const assignUserID = (users) => {
      users.forEach(user => {
        if (user.email === USERNAME.email){
          USERID = user.id
        }
      })
    }



    fetchReport()

    fetchUserID()

    mapid.addEventListener('click', (e)=>{
      if (e.target.id === 'submit-btn'){
        e.preventDefault()
        data = {lat: lat, lng: lng, description: descriptionInput.value, user_id: parseInt(USERID)}
        postNewReport(data)
        descriptionInput.value = ''
        testMarker.closePopup()
      }
    })

  // }


  const loadReports = (element) => {
    fetch('http://localhost:3000/api/v1/reports')
    .then(res => res.json())
    .then(json => renderReportToUi(json, element))
  }

  const renderReportToUi = (reports, element) => {

    reports.forEach(report => {
      const reportBtn = document.createElement("button")
      reportBtn.id = report.id
      reportBtn.innerText = 'See More Details...'
      reportBtn.className = 'detailsBtn'

      let reportLi = document.createElement('li')
      reportLi.innerText= `${report.description} was reported by: ${report.user.email}`
        element.appendChild(reportLi)
        element.append(reportBtn)
    })
  }


  reportIndexDiv.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      console.log('hi');
    }
  })


  loadReports(reportDivUl)


/// load user interface ends right here!!!!!!!!!!!!!!!!!!!!!
}

loadLoginInterface()
});
