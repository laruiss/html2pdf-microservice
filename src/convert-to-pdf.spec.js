import { getPdf } from './convert-to-pdf'

const html = `<html>
    <head>
        <title>
            Hello World
        </title>
        <link rel="stylesheet" href="../main.css">
    </head>
    <body>
        <h1>
            Hello World from an HTML file!
        </h1>
    </body>
</html>`

describe('convert-to-pdf', () => {
  it('Should convert to pdf', async () => {
    const pdfBuffer = await getPdf({ html })
    const pdfString = pdfBuffer.toString()

    expect(pdfString).toContain('PDF')
  })

  it('Should convert to pdf', async () => {
    const url = 'https://www.duckduckgo.com'
    const pdfBuffer = await getPdf({ url })
    const pdfString = pdfBuffer.toString()

    expect(pdfString).toContain('PDF')
  })
})
