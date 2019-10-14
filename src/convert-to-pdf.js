import getBrowser from './get-browser'

const getPage = async () => {
  const browser = await getBrowser()
  const page = await browser.newPage()
  return page
}

const getPdfFromPage = page => {
  return page.pdf({
    format: 'A4',
    printBackground: true,
  })
}

const convertHtmlToPdf = async (content, method) => {
  try {
    const page = await getPage()
    await page[method](content)
    const buffer = await getPdfFromPage(page)
    return buffer
  } catch (error) {
    console.error(error)
    return ''
  }
}

export const getPdf = async ({ file, html, url }) => {
  if (html) {
    return convertHtmlToPdf(html, 'setContent')
  }
  if (url) {
    return convertHtmlToPdf(url, 'goto')
  }
  if (file) {
    return convertHtmlToPdf(file.toString(), 'setContent')
  }
}
