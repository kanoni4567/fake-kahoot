// Page elements:
let questionViewWrap = document.getElementById('questionViewWrap')
let userInfo = document.getElementById('userInfo')
let questionNumber = document.getElementById('questionNumber')
let questionContent = document.getElementById('questionContent')
let greetBox = document.getElementById('greetBox')
let answer1 = document.getElementById('answer1')
let answer2 = document.getElementById('answer2')
let answer3 = document.getElementById('answer3')
let answer4 = document.getElementById('answer4')
let userName = document.getElementById('greetBoxUsernameInput')
let popupWrap = document.getElementById('popupWrap')
let popupMessageUsername = document.getElementById('popupMessageUsername')
let popupMessageScore = document.getElementById('popupMessageScore')
let popupMessageStreak = document.getElementById('popupMessageStreak')
let notification = document.getElementById('notify')
let notifyTitle = document.getElementById('notify_title')
let notifyWrap = document.getElementById('wrap')
let questionType = document.getElementById('trivia_category')

let currentQuestion = {}
let userObject = {}

let assessQuestionResult = (chosenAnswer) => {
  serverRequest('POST', '/validateanswer', `chosenAnswer=${chosenAnswer}`, (xmlhttp) => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      let xmlhttpResult = JSON.parse(xmlhttp.responseText)
      userObject = xmlhttpResult.currentUser
      if (xmlhttpResult.result === true) {
        displayNotification('right')
      } else {
        displayNotification('wrong')
      }
      populatePopupResult()
    }
  })
}

let storeQuizResult = () => {
  questionViewWrap.style.top = '-100vh'
  serverRequest('POST', '/storeuser', '', (xmlhttp) => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 201) {
      swal('Success', 'Your score has been saved!', 'success')
    } else {
      swal('Error', 'Unknown error!', 'error')
    }
  })
  notifyWrap.style.display = 'block'
  notification.style.right = '0'
  setTimeout(() => {
    notification.style.right = '-100%'
    popupWrap.style.top = '50vh'
    setTimeout(() => {
      notifyWrap.style.display = 'none'
    }, 300)
  }, 1200)
}

/**
 *
 * @param {number} - ????
 */
let playWithoutAccount = (event = 1) => {
  if (event === 1 || event.keyCode === 13) {
    if (userName.value !== '') {
      serverRequest('POST', '/playWithoutAccount', `username=${userName.value}`, (xmlhttp) => {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          notifyTitle.innerHTML = `Welcome ${userName.value}`
          document.getElementById('tooltip').style.backgroundImage = 'url(/assets/images/icons/puzzle.svg)'
          userObject = JSON.parse(xmlhttp.responseText)
          startTrivia()
        }
      })
    } else {
      swal('Error!', 'You left the username or category blank!', 'warning')
    }
  }
}

/**
 * @desc Displays the current user's name to the popup message Username along with their current Score and Highest Streak
 *
 */
let populatePopupResult = () => {
  popupMessageUsername.innerHTML = userObject.username
  popupMessageScore.innerHTML = `SCORE: ${userObject.currentScore.userScore}`
  popupMessageStreak.innerHTML = `HIGHEST STREAK: ${userObject.currentScore.highestStreak}`
}
/**
 * @desc function displays the next question or the result when the game is over
 */
let getNextQuestion = () => {
  serverRequest('POST', '/getnextquestion', '', (xmlhttp) => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      currentQuestion = JSON.parse(xmlhttp.responseText)
      displayQuestion()
      startMyTimer()
      greetBox.style.opacity = '0'
      setTimeout(() => {
        greetBox.style.display = 'none'
      }, 300)
    } else if (xmlhttp.readyState === 4 && xmlhttp.status === 204) {
      storeQuizResult()
    }
  })
}

/**
 * @desc Opens new HTTP request and looks for POST "/getquestions", if there is a state change, then it will parse into a JSON object which is displayed back to the user in the greet Box which only shows for 0.3 seconds then dissapears. Send quiz category value to back end.
 * 
 */
let startTrivia = () => {
  serverRequest('POST', '/starttrivia', '', (xmlhttp) => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      currentQuestion = JSON.parse(xmlhttp.responseText)
      displayQuestion()
      greetBox.style.opacity = '0'
      setTimeout(() => {
        greetBox.style.display = 'none'
      }, 300)
    }
  })
}
/**
 * @desc Displays a game question
 */
let displayQuestion = () => {
  notifyWrap.style.display = 'block'
  questionViewWrap.style.top = '-100vh'
  setTimeout(() => {
    notification.style.right = '0'
  }, 1)
  setTimeout(() => {
    userInfo.innerHTML = `${userObject.username} - ${userObject.currentScore.userScore}`
    questionNumber.innerHTML = 'QUESTION ' + (currentQuestion.index + 1)
    questionContent.innerHTML = currentQuestion.question
    answer1.innerHTML = currentQuestion.option1
    answer2.innerHTML = currentQuestion.option2
    answer3.innerHTML = currentQuestion.option3
    answer4.innerHTML = currentQuestion.option4
    questionViewWrap.style.top = '45vh'
    notification.style.right = '-100%'
    setTimeout(() => {
      notifyWrap.style.display = 'none'
    }, 300)
    startMyTimer()
  }, 1200)
}

/**
 * @desc Displays a pop up notifying if the answer was right or wrong
 * @param {string} mode - refers to user answer right/wrong
 */
let displayNotification = (mode) => {
  let thumbUp = 'url(/assets/images/icons/thumb-up.svg)'
  let thumbDown = 'url(/assets/images/icons/dislike.svg)'

  if (mode === 'wrong') {
    notifyTitle.innerHTML = 'Wrong! :('
    document.getElementById('tooltip').style.backgroundImage = thumbDown
  } else if (mode === 'right') {
    notifyTitle.innerHTML = 'Good Job! :)'
    document.getElementById('tooltip').style.backgroundImage = thumbUp
  }
}
