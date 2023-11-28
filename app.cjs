const { writeFile } = require('node:fs/promises')

const http = require('http')
const express = require('express')
const { translitRusEng } = require('./translit.cjs')

const app = express()

app.use(express.json({ limit: '10mb' }))

app.post('/positions', async (req, res) => {
  const data = req.body
  const position = translitRusEng(data.position)

  const parseModule = await import('./parsing/parse.mjs')
  const resumes = await parseModule.default(position)

  writeFile('resumes.json', JSON.stringify(resumes, null, 2))

  res.json({
    "resumes": resumes
  })

})

const server = http.createServer(app)
const timeout = 30 * 60 * 1000

server.setTimeout(timeout)
server.keepAliveTimeout = timeout
server.headersTimeout = timeout

server.listen(3000)
