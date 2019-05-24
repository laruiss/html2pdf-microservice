import express from 'express'
import bodyParser from 'body-parser'
import fileupload from 'express-fileupload'

import npmVersion from '../package.json'

const app = express()

export const apiPrefix = '/api/v1'

app.get(`${apiPrefix}/version`, function (req, res) {
  res.send(npmVersion.version)
})

app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
app.use(fileupload({ limits: { fileSize: 50 * 1024 * 1024 } }))

export default app
