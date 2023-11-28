const http = require('http')
const express = require('express')
const { translitRusEng } = require('./translit.cjs')

const app = express()

app.use(express.json({limit: '10mb'}))

app.post('/positions', async (req, res) => {
  const data = req.body
  const position = translitRusEng(data.position)

  const parseModule = await import('./parsing/parse.mjs')
  const resumes = await parseModule.default(position)
  
  res.json({
    "resumes": resumes
  })

  // import('./mock.mjs')
  //   .then(parsing => {
  //     res.json({
  //       "resumes": parsing.mock_resumes
  //     })
  //   })

})

const server = http.createServer(app)
const timeout = 30 * 60 * 1000

server.setTimeout(timeout)
server.keepAliveTimeout = timeout
server.headersTimeout = timeout

server.listen(3000)
