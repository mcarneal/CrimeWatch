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
    loginDiv.scrollIntoView()
    const welcomeBanner = document.getElementById('welcome-banner')
    let reportIndexDiv = document.createElement('div')
    // const fieldDiv = document.createElement('div')
    loginDiv.className = "field"
    const createElement = (e) => {
      return document.createElement(e)
    }
    const loginField = createElement("input")
    const loginBtn = createElement("button")
    loginField.id = "login-field"
    loginField.value = ''
    loginField.placeholder = 'enter email...'
    loginField.type = 'email'
    loginBtn.id = 'login-btn'
    loginBtn.innerText = 'Login'
    loginBtn.className = "ui blue button"
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


  }

  const addNextBackBtns = () => {
    const reportIndexDiv = document.getElementById('report-index')
    let nextBtn = document.createElement('button')
    nextBtn.innerText = '-->'
    nextBtn.id = 'nextBtn'
    let backBtn = document.createElement('button')
    backBtn.innerText = '<--'
    backBtn.id = 'prevBtn'
    reportIndexDiv.append(backBtn)
    reportIndexDiv.append(nextBtn)
  }

  const loadUserInterface = () => {
    const contentContainer = document.querySelector('.content-container')
    contentContainer.scrollIntoView()
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
        marker._icon.id = report.id
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
      reportBtn.className = 'ui olive button'

      // reportLi.innerText= `${report.description} was reported by: ${report.user.email}`

      // const uiCardsDiv = document.createElement('div')
      // uiCardsDiv.className = "ui cards"
      // element.append(uiCardsDiv)
      uiCardsDiv.innerHTML +=
      `
        <div class="card" id=${report.id}>
          <div class="content" id=${report.id}>
          <div class="header" id=${report.id}>${report.user.email}</div>
          <div class="description" id=${report.id}>
          ${report.description}
          </div>
        </div>
        <div class="ui bottom attached button" id=${report.id}>
          <button id=${report.id} class='detailsBtn ui green button'>See More Details...</button>
          <button id=${report.id} class='delete-btn ui red button'>Delete</button>
        </div>
        </div>
      `

    } else {
      console.log(uiCardsDiv)
      const reportBtn = document.createElement("button")
      // const userListDiv = document.createElement("div")
      // userListDiv.className = 'reportDiv'
      reportBtn.id = report.id
      reportBtn.innerText = 'See More Details...'
      reportBtn.className = 'ui green button'
      // let reportLi = document.createElement('li')
      // reportLi.innerText= `${report.description} was reported by: ${report.user.email}`
      // const uiCardsDiv = document.createElement('div')
      // uiCardsDiv.className = "ui cards"
      // element.append(uiCardsDiv)
      uiCardsDiv.innerHTML +=
      `
        <div class="card" id=${report.id}>
          <div class="content" id=${report.id}>
          <div class="header" id=${report.id}>${report.user.email}</div>
          <div class="description" id=${report.id}>
          ${report.description}
          </div>
        </div>
        <div class="ui bottom attached button" id=${report.id}>
          <button id=${report.id} class='detailsBtn ui green button'>See More Details...</button>
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

  document.addEventListener('mouseover', (e) => {
    if (e.target.parentNode.className === 'card' || e.target.parentNode.className === 'content') {
      const icon = document.getElementById(e.target.id)
      icon.src = 'https://i.pinimg.com/originals/d9/7f/ea/d97feac57bebf6007994f6a6286d005b.png';
      console.log(icon.style);
      e.target.addEventListener('mouseleave', (e) => {
          const icon = document.getElementById(e.target.id)
          icon.src = 'https://i.imgur.com/WANnswn.png';

     })
    }
  })

  reportIndexDiv.addEventListener('click', (e) => {
    // let start = 0
    // let end = 9
    console.log(e.target.className);
    if (e.target.className === 'detailsBtn ui green button') {
     const nextBtn = document.getElementById('nextBtn')
     const prevBtn = document.getElementById('prevBtn')
     nextBtn.style.visibility = 'hidden'
     prevBtn.style.visibility = 'hidden'
     let reportId = parseInt(e.target.id)
     fetchOneReport(reportId)
   } else if (e.target.innerText === '-->') {
     start += 10
     end += 10
     console.log(start);
     console.log(end);
     loadReports(reportDivUl)
   } else if (e.target.innerText === '<--') {
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
    REPORTID = report.id
    const container = document.getElementById('report-ul')
    container.innerHTML = ''

    const descriptionContainer = document.createElement('div')
    descriptionContainer.className = 'report-description'
    descriptionContainer.innerHTML = `
      <h2>Description:</h2>
      <p>${report.description} ... was reported by: ${report.user.email}</p>
    `
    container.append(descriptionContainer)

    // comments and reply section
    const uiCommentsDiv = document.createElement('div')
    uiCommentsDiv.className = 'ui comments'
    container.append(uiCommentsDiv)
    const uiDividingHeader = document.createElement('h3')
    uiDividingHeader.className = 'ui dividing header'
    uiDividingHeader.innerText = 'Comments'
    uiCommentsDiv.append(uiDividingHeader)

    report.comments.forEach(comment => {
      const commentDiv = document.createElement('div')
      commentDiv.className = 'comment'
      uiCommentsDiv.appendChild(commentDiv)
      const avatar = document.createElement('a')
      avatar.className = 'avatar'
      commentDiv.append(avatar)
      const content = document.createElement('div')
      content.className = 'content'
      commentDiv.append(content)
      const author = document.createElement('a')
      author.className = 'author'
      author.innerText = `${comment.user_email}`
      content.append(author)
      const metaDataDiv = document.createElement('div')
      metaDataDiv.className = 'metadata'
      const dateSpan = document.createElement('span')
      dateSpan.className = 'data'
      dateSpan.innerText = `${Date()}`
      metaDataDiv.appendChild(dateSpan)
      content.append(metaDataDiv)
      const text = document.createElement('div')
      text.className='text'
      text.innerText =`${comment.comment}`
      content.append(text)
    })

    const uiReplyForm = document.createElement('div')
    uiReplyForm.className = 'ui reply form'
    uiCommentsDiv.append(uiReplyForm)

    const field = document.createElement('div')
    field.className = 'field'
    field.innerHTML = `<textarea>add a comment...`
    uiReplyForm.append(field)

    const replyBtn = document.createElement('div')
    replyBtn.className = 'ui blue labeled submit icon button'
    replyBtn.innerHTML = `<i class="icon edit"></i> Add Reply`

    field.append(replyBtn)
    const backBtn = document.createElement('button')
    backBtn.className = 'ui red button'
    backBtn.innerText = 'Back'
    field.append(backBtn)



  }

  // end of single fetch area

reportIndexDiv.addEventListener("click", (e)=> {
    if (e.target.innerText === 'Add Reply'){
      const textField = e.target.parentNode
      const text = textField.firstElementChild.value
      console.log(text)
      console.log(REPORTID)
       newCommentPost = {comment: text, user_id: USERID, report_id: REPORTID}
       console.log(newCommentPost)
  // if (e.target.innerText === 'Submit Comment'){
    // parentNode = e.target.parentNode
    // newComment = parentNode.querySelector('#textarea')
    // newCommentPost = {comment: newComment.value, user_id: USERID, report_id: REPORTID}
    postComment(newCommentPost)
    fetchOneReport(REPORTID)
    // fetchOneReport(REPORTID)
    // const commentUl = document.getElementById('commentUl')
    // parentNode.appendChild(commentUl)
    // commentLi = document.createElement('li')
    // commentLi.innerText= newComment.value
    // commentUl.appendChild(commentLi)
    // newComment.value = ''
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
    } ).then(()=> loadReports(reportDivUl))
  }



// findReportIds(USEROBJECT.reports)

/// load user interface ends right here!!!!!!!!!!!!!!!!!!!!!

}

loadLoginInterface()
});
