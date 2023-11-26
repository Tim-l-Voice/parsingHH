const http = require('http')
const express = require('express')
const { translitRusEng } = require('./translit.cjs')

const app = express()

app.use(express.json())

app.post('/positions', async (req, res) => {
  const data = req.body
  const position = translitRusEng(data.position)

  import('./parsing.mjs')
    .then(async parsing => {
      res.json({
        "resumes": await parsing.default(position)
      })
    })
})

// app.listen(3000, () => {
//   console.log(`App listening on 3000`)
// })

const server = http.createServer(app)
const timeout = 20 * 60 * 1000

server.setTimeout(timeout)
server.keepAliveTimeout = timeout
server.headersTimeout = timeout

server.listen(3000)