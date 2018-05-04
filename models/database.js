const {Client} = require('pg')



let executeQuery = (query) => {
  let client = new Client({
  connectionString: process.env.DATABASE_URL
  })
  return new Promise((resolve, reject) => {
    client.connect()
    client.query(query, (err, res) => {
      if (err) {
        console.log(err)
      } else {
        if (res.command === 'SELECT') {
          let result = JSON.stringify(res.rows)
          client.end()
          resolve(result)
        } else {
          client.end()
          resolve(true)
        }
      }
    })
  })
}

let getUsersList = () => {
  executeQuery('SELECT "USERNAME" FROM "ACCOUNTS"')
}

module.exports = {
  executeQuery,
  getUsersList
}