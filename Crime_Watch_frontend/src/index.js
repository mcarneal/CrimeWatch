window.addEventListener('DOMContentLoaded', (event) => {

  let USEROBJECT
  let USERNAME
  let USERID
  let REPORTID
  let NEWREPORTID
  let NEWCOMMENT
  let USERREPORTIDS = []
  const uiCardsDiv = document.createElement('div')



  const findReportIds = (reports) => {
    reports.forEach(report => {
      USERREPORTIDS.push(report.id)
    })
    return USERREPORTIDS
  }


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
    loginField.value = ''
    loginBtn.id = 'login-btn'
    loginBtn.innerText = 'login'
    loginDiv.appendChild(loginField)
    loginDiv.appendChild(loginBtn)


    loginBtn.addEventListener("click", (e)=>{
      const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (regexp.test(loginField.value)) {
        USERNAME = {email: loginField.value}
        loginDiv.innerHTML = ''
        createUser(USERNAME).then(()=> loadUserInterface())
      } else {
          alert("You have entered an invalid email address!")
      }
    })



    const createUser = (id) => {
        return fetch(USERURL,{
        method: 'POST',
        headers: {
              "Content-Type": "application/json"
          },
        body: JSON.stringify(id)
      }).then(res => res.json())
    }

    /// end of LoadInterface
  }
  const addNextBackBtns = () => {
    const reportIndexDiv = document.getElementById('report-index')
    let nextBtn = document.createElement('button')
    nextBtn.innerText = '->'
    nextBtn.id = 'nextBtn'
    let backBtn = document.createElement('button')
    backBtn.innerText = '<-'
    backBtn.id = 'prevBtn'
    reportIndexDiv.append(backBtn)
    reportIndexDiv.append(nextBtn)
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


    addNextBackBtns()

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
          USEROBJECT = user
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
        testMarker.closePopup()
        appendNewReport(descriptionInput, reportDivUl)
        descriptionInput.value = ''
        }

    })

  const appendNewReport = (descriptionInput, reportDivUl) => {
    console.log(NEWREPORTID)
    const reportBtn = document.createElement("button")
    const deleteBtn = document.createElement("button")
    deleteBtn.id = NEWREPORTID
    deleteBtn.className = 'delete-btn'
    deleteBtn.innerText = 'Delete'
    reportBtn.id = NEWREPORTID
    reportBtn.innerText = 'See More Details...'
    reportBtn.className = 'detailsBtn'
    let reportLi = document.createElement('li')
    reportLi.innerText= `${descriptionInput.value} was reported by: ${USERNAME.email}`
    reportDivUl.appendChild(reportLi)
    reportDivUl.appendChild(reportBtn)
    reportDivUl.appendChild(deleteBtn)
    loadReports(reportDivUl)
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
    .then(json => renderReportToUi(json.slice(start,end), element))
  }

  const renderReportToUi = (reports, element) => {
    const uiCardsDiv = document.createElement('div')
    uiCardsDiv.className = "ui cards"
    element.append(uiCardsDiv)
    reports.forEach(report => {
      console.log(uiCardsDiv)
      if (USERID === report.user.id){
      const reportBtn = document.createElement("button")
      const deleteBtn = document.createElement("button")
      const userListDiv = document.createElement("div")

      userListDiv.className = 'reportDiv'
      deleteBtn.innerText = "Delete"
      deleteBtn.className = 'delete-btn'
      deleteBtn.id = report.id
      reportBtn.id = report.id
      reportBtn.innerText = 'See More Details...'
      reportBtn.className = 'detailsBtn'

      // reportLi.innerText= `${report.description} was reported by: ${report.user.email}`

      // const uiCardsDiv = document.createElement('div')
      // uiCardsDiv.className = "ui cards"
      // element.append(uiCardsDiv)
      uiCardsDiv.innerHTML +=
      `
        <div class="card">
          <div class="content">
          <div class="header">${report.user.email}</div>
          <div class="description">
          ${report.description}
          </div>
        </div>
        <div class="ui bottom attached button">
          <button id=${report.id} class='detailsBtn'>See More Details...</button>
          <button id=${report.id} class='delete-btn'>Delete</button>
        </div>
        </div>
      `
        // element.appendChild(reportLi)
        // reportLi.innerHTML+=`<br>`
        // reportLi.append(reportBtn)
        // reportLi.innerHTML+=`<br>`
        // reportLi.append(deleteBtn)
        // userListDiv.append(reportLi)
        // element.append(userListDiv)
    } else {
      console.log(uiCardsDiv)
      const reportBtn = document.createElement("button")
      // const userListDiv = document.createElement("div")
      // userListDiv.className = 'reportDiv'
      reportBtn.id = report.id
      reportBtn.innerText = 'See More Details...'
      reportBtn.className = 'detailsBtn'
      // let reportLi = document.createElement('li')
      // reportLi.innerText= `${report.description} was reported by: ${report.user.email}`
      // const uiCardsDiv = document.createElement('div')
      // uiCardsDiv.className = "ui cards"
      // element.append(uiCardsDiv)
      uiCardsDiv.innerHTML +=
      `
        <div class="card">
          <div class="content">
          <div class="header">${report.user.email}</div>
          <div class="description">
          ${report.description}
          </div>
        </div>
        <div class="ui bottom attached button">
          <button id=${report.id} class='detailsBtn'>See More Details...</button>
          </div>
        </div>
      `
      // `
      // <div>
      //   <h2>TEST</h2>
      // </div>
      // `

        // element.appendChild(reportLi)
        // reportLi.append(reportBtn)
        // userListDiv.append(reportLi)
        // element.append(userListDiv)
      }
    })
  }

  let start = 0
  let end = 10
  // const loadTen = () => {
  //
  // }


  reportIndexDiv.addEventListener('click', (e) => {
    // let start = 0
    // let end = 9
    if (e.target.className === 'detailsBtn') {
     const nextBtn = document.getElementById('nextBtn')
     const prevBtn = document.getElementById('prevBtn')
     nextBtn.style.visibility = 'hidden'
     prevBtn.style.visibility = 'hidden'
     let reportId = parseInt(e.target.id)
     fetchOneReport(reportId)
   } else if (e.target.innerText === '->') {
     start += 10
     end += 10
     console.log(start);
     console.log(end);
     loadReports(reportDivUl)
   } else if (e.target.innerText === '<-') {
      if (start > 0) {
        start -= 10
        end -= 10
        console.log(start);
        console.log(end);
        loadReports(reportDivUl)
      }
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
    newComment = parentNode.querySelector('#textarea')
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
  }


  loadReports(reportDivUl)

  reportIndexDiv.addEventListener("click", (e) => {
    if (e.target.innerText === 'Back'){
      const nextBtn = document.getElementById('nextBtn')
      const prevBtn = document.getElementById('prevBtn')
      loadReports(reportDivUl)
      nextBtn.style.visibility = 'visible'
      prevBtn.style.visibility = 'visible'
    }
  })




  reportIndexDiv.addEventListener('click', (e) => {
    if(e.target.innerText === 'Delete'){
        let child = e.target
        let parent = e.target.parentNode.parentNode
        let id = parseInt(e.target.id)
        deleteReport(id)
        parent.remove(child)

    }
  })


  const deleteReport = (id) => {
    fetch(`http://localhost:3000/api/v1/reports/${id}`,{
      method: 'DELETE'
    } )
  }



// findReportIds(USEROBJECT.reports)

/// load user interface ends right here!!!!!!!!!!!!!!!!!!!!!
}

loadLoginInterface()
});
