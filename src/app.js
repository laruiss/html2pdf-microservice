import express from 'express'
import morgan from 'morgan'
import mime from 'mime'
import bodyParser from 'body-parser'
import fileupload from 'express-fileupload'

import { loggerStream } from './util/logger'
import npmVersion from '../package.json'
import { getPdf } from './convert-to-pdf'

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
  try {
    const { filename, html, url } = req.body
    const file = req.files && req.files.file

    if (!filename) {
      res.status(400).json({
        error: 'Parameter "filename" must be specified',
      })
    }

    const options = {
      file,
      html,
      url,
    }

    const buffer = await getPdf(options)

    const mimetype = mime.lookup(filename)
    res
      .set({
        'Content-Type': mimetype,
        'Content-Disposition': `attachment; filename="${filename}"`,
      })
      .send(buffer)
  } catch (error) {
    res.status(error.httpStatusCode || 500).json({
      error: error.message,
    })
  }
})

export default app
