const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    msg: 'Hello World!'
  })
})

const port = process.env.PORT || 8081

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}`)
})
