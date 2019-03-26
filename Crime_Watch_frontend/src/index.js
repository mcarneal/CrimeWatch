window.addEventListener('DOMContentLoaded', (event) => {

  let USERNAME
  let USERID
  let REPORTID
  let NEWREPORTID
  let NEWCOMMENT

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
      return fetch(POSTURL,{
        method: 'POST',
        headers: {
              "Content-Type": "application/json"
          },
        body: JSON.stringify(data)
      }).then()
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
        fetchLastReport()
        e.preventDefault()
        data = {lat: lat, lng: lng, description: descriptionInput.value, user_id: parseInt(USERID)}
        postNewReport(data)
        // let reportLi = document.createElement('li')
        // reportLi.innerText= `${descriptionInput.value} was reported by: ${USERNAME.email}`
        // reportDivUl.appendChild(reportLi)
        testMarker.closePopup()
        // loadReports(reportDivUl)
        appendNewReport(descriptionInput, reportDivUl)
        descriptionInput.value = ''
        }

    })

  const appendNewReport = (descriptionInput, reportDivUl) => {
    const reportBtn = document.createElement("button")
    reportBtn.id = NEWREPORTID
    reportBtn.innerText = 'See More Details...'
    reportBtn.className = 'detailsBtn'
    let reportLi = document.createElement('li')
    reportLi.innerText= `${descriptionInput.value} was reported by: ${USERNAME.email}`
    reportDivUl.appendChild(reportLi)
    reportDivUl.appendChild(reportBtn)
  }

  const fetchLastReport = () =>{
    fetch('http://localhost:3000/api/v1/reports')
    .then(res => res.json())
    .then(json => findLastReport(json.slice(-1)))
  }


  const findLastReport = (report) => {
    NEWREPORTID = report[0].id + 1
    console.log(report[0].id, 'is the latest report ID')
    console.log(NEWREPORTID, 'is the soon to be report')
  }


  const loadReports = (element) => {
    element.innerHTML = ''
    return fetch('http://localhost:3000/api/v1/reports')
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
    if (e.target.className === 'detailsBtn') {
      console.log(e.target.id)
     let reportId = parseInt(e.target.id)
     fetchOneReport(reportId)

    }
  })

  // functions for grabbing a single report from the UL div
  const fetchOneReport = (id) => {
    fetch('http://localhost:3000/api/v1/reports')
    .then(res => res.json())
    .then(json => findOneReport(json, id))
  }

  const findOneReport = (reports, id) => {
    reports.forEach(report => {
      if(report.id === id){
        renderOneReport(report)
      }
    })
  }

  const renderOneReport = (report) => {

    const container = document.getElementById('report-ul')
    container.innerHTML = ''
    const backBtn = document.createElement('button')
    backBtn.innerText = 'Back'
    backBtn.id = 'back-button'
    const showDiv = document.createElement('div')
    showDiv.innerHTML = `
    <h4>Description: ${report.description}</h4>
    <a>Contact: ${report.user.email}</a><br><br>
    Add Comment:
    `
    const textFieldInput = document.createElement('textarea')
    textFieldInput.id = 'textarea'
    const commentDiv = document.createElement('div')
    const commentsUl = document.createElement('ul')
    commentsUl.id = 'commentUl'
    const submitCommentBtn = document.createElement('button')
    submitCommentBtn.innerText = 'Submit Comment'

    container.append(showDiv)
    container.append(textFieldInput)
    container.append(submitCommentBtn)

    container.appendChild(backBtn)
    commentDiv.append(commentsUl)
    container.append(commentDiv)


    report.comments.forEach(comment => {
      console.log(comment)
      commentLi = document.createElement('li')
      commentLi.innerText= comment.comment
      commentsUl.appendChild(commentLi)
    })


    REPORTID = report.id
  }

  // end of single fetch area

reportIndexDiv.addEventListener("click", (e)=> {
  if (e.target.innerText === 'Submit Comment'){
    parentNode = e.target.parentNode
    console.log(parentNode)
    newComment = parentNode.querySelector('#textarea')
    console.log(USERID, REPORTID, newComment.value)
    newCommentPost = {comment: newComment.value, user_id: USERID, report_id: REPORTID}
    postComment(newCommentPost)
    const commentUl = document.getElementById('commentUl')
    parentNode.appendChild(commentUl)
    commentLi = document.createElement('li')
    commentLi.innerText= newComment.value
    commentUl.appendChild(commentLi)
    newComment.value = ''
  }
})


  // event instener to send a post request for a new comment




  const postComment = (data) => {
    fetch('http://localhost:3000/api/v1/comments', {
      method: 'POST',
      headers: {
            "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      // .then()
  }


  loadReports(reportDivUl)

  reportIndexDiv.addEventListener("click", (e) => {
    if (e.target.innerText === 'Back'){
      loadReports(reportDivUl)
    }
  })


/// load user interface ends right here!!!!!!!!!!!!!!!!!!!!!
}

loadLoginInterface()
});
