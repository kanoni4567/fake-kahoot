
const db = require('./database')
const bcrypt = require('bcrypt')
const saltRounds = 10

class Account {
  constructor () {
    this.username = undefined
    this.password = undefined
    this.userID = undefined
  }

  /**
   * @desc [To be determined]
   * @returns {undefined}
   */
  login (username, password) {
    console.log(username)
    console.log(password)
    return new Promise((resolve, reject) => {
      db.executeQuery(`SELECT * FROM public."ACCOUNTS" WHERE "USERNAME" = '${username}';`).then((queryResult) => {
        console.log(queryResult)

        // console.log(queryResult.slice(49, 109))
        // let result = queryResult.slice(49, 109)
        let result = JSON.parse(queryResult)
        console.log(result)
      }).then((result) => {
        if (bcrypt.compareSync(password, result)) {
          resolve(true)
        }
      })
    })
    resolve(false)
  }

  // decrypPassword (password) {
  //   return new Promise((resolve, reject) => {
  //     bcrypt.compare(password, hash).then((res) => {
  //     // res == true
  //     })
  //   })
  // }
  encryptPassword (password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10).then((hash) => {
        resolve(hash)
      })
    })
  }

  /**
   * @desc [To be determined]
   * @returns {undefined}
   */
  register (username, password) {
    return new Promise((resolve, reject) => {
      this.encryptPassword(password).then((result) => {
        db.executeQuery(`INSERT INTO public."ACCOUNTS"("USERNAME", "PASSWORD") VALUES ('${username}', '${result}');`).then((result) => {
          resolve(result)
        })
      })
    })
  }

  validateUsername (USERNAME) {
    return new Promise((resolve, reject) => {
      db.executeQuery('SELECT "USERNAME" FROM "ACCOUNTS"').then((result) => {
        console.log(result)
        let userArray = JSON.parse(result)
        var found = userArray.some(function (el) {
          return el.USERNAME === USERNAME
        })
        resolve(!found)
      })
    })
  }

  validatePassword (pass) {
    let numbers = pass.match(/\d+/g)
    let uppers = pass.match(/[A-Z]/)
    let lowers = pass.match(/[a-z]/)
    let lengths = pass.length >= 6

    if (numbers === null || uppers === null || lowers === null || lengths === false) {
      return false
    }

    if (numbers !== null && uppers !== null && lowers !== null && lengths) {
      return true
    }
  }
}

module.exports = {
  Account
}
