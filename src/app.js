import express from 'express'
import bodyParser from 'body-parser'
import fileupload from 'express-fileupload'
import morgan from 'morgan'

import { loggerStream } from './util/logger'
import npmVersion from '../package.json'
import mime from 'mime'
import convertToPdf from './convert-to-pdf'

const app = express()
app.disable('x-powered-by')

const contentLimit = '20mb'
const fileSizeLimit = 50 * 1024 * 1024

export const apiPrefix = '/api/v1'

const formatAsNginx =
':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time'

app.use(morgan(formatAsNginx, { stream: loggerStream }))

app.get(`${apiPrefix}/version`, function (req, res) {
  res.send(npmVersion.version)
})

app.use(bodyParser.json({ limit: contentLimit }))
app.use(bodyParser.urlencoded({ limit: contentLimit, extended: false }))
app.use(fileupload({ limits: { fileSize: fileSizeLimit } }))

app.post(`${apiPrefix}/html2pdf`, async (req, res) => {
  const { html, filename } = req.body
  try {
    const buffer = await convertToPdf(html)

    const mimetype = mime.lookup(filename)
    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${filename}"`,
    })
    res.send(buffer)
  } catch (error) {
    res.status(error.httpStatusCode || 500).json({
      error: error.message,
    })
  }
})

export default app
