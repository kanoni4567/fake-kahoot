const db = require('./database')
const bcrypt = require('bcrypt')
const score = require('./score')
const saltRounds = 10

class Account {
  constructor (username = undefined, userID = undefined) {
    this.username = username
    this.userID = userID
    this.currentScore = new score.Score()
  }

  /**
   * @desc Provide desc later
   * @param username - user's username
   * @param password - user's password
   * @returns {Promise<object>}
   */
  login (username, password) {
    return new Promise((resolve, reject) => {
      db.executeQuery(`SELECT * FROM public."ACCOUNTS" WHERE "USERNAME" = '${username}';`).then((queryResult) => {
        let result = JSON.parse(queryResult)
        if (result.length > 0 && bcrypt.compareSync(password, result[0].PASSWORD)) {
          this.username = result[0].USERNAME
          this.userID = result[0]['ACCOUNT_ID']
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  /**
   * @desc Encrypts user's password
   * @param password - user's password
   * @returns {Promise<object>}
   */
  encryptPassword (password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10).then((hash) => {
        resolve(hash)
      })
    })
  }

  /**
   * @desc Registration of the user in the database
   * @param username - user's username
   * @param password - user's password
   * @returns {Promise<object>}
   */
  register (username, password) {
    return new Promise((resolve, reject) => {
      this.encryptPassword(password).then((result) => {
        db.executeQuery(`INSERT INTO public."ACCOUNTS"("USERNAME", "PASSWORD") VALUES ('${username}', '${result}');`).then((result) => {
          console.log(result)
          resolve(result)
        })
      })
    })
  }

  toJSON () {
    return {
      'username': this.username,
      'userID': this.userID,
      'currentScore': this.currentScore.toJSON()
    }
  }

  saveCurrentScore () {
    return new Promise((resolve, reject) => {
      let date = new Date()
      let timeStamp = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      db.executeQuery(`INSERT INTO public."SCORES" ("ACCOUNT_ID", "SCORE", "HIGHEST_STREAK", "DATE") VALUES ('${this.userID}', '${this.currentScore.userScore}', '${this.currentScore.highestStreak}', '${timeStamp}')`).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  /**
   * @desc <provide description>
   * @param {string} USERNAME - User's username
   * @returns {Promise<object>}
   */
  validateUsername (USERNAME) {
    return new Promise((resolve, reject) => {
      db.executeQuery('SELECT "USERNAME" FROM "ACCOUNTS"').then((result) => {
        let userArray = JSON.parse(result)
        var found = userArray.some(function (el) {
          return el.USERNAME === USERNAME
        })
        resolve(!found)
      })
    })
  }

  /**
   * @desc Validates for a strong password
   * Jump to bottom of Loading... dialog
   * Add a File - ACIT-2811-0 - UX/UI Development - 85406 - Lecture/Lab Combo - British Columbia Institute of Technology
   * Close this Dialog
   * Jump to top of Loading... dialog
   * Upload files from your computer.
   * e otherwise
   * @param pass - password passed by the user <** correct? **>
   * @returns {boolean} if password is valid returns true, fals
   */
  validatePassword (pass) {
    let numbers = pass.match(/\d+/g)
    let uppers = pass.match(/[A-Z]/)
    let lowers = pass.match(/[a-z]/)
    let lengths = pass.length >= 6
    let valid = undefined

    if (numbers === null || uppers === null || lowers === null || lengths === false) valid = false

    if (numbers !== null && uppers !== null && lowers !== null && lengths) valid = true

    return valid
  }
}

module.exports = {
  Account
}
