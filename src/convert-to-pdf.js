
import getBrowser from './get-browser'

export default async function convertToPdf (html) {
  try {
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.setContent(html)
    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    })
    return buffer
  } catch (error) {
    console.error(error)
    return ''
  }
}
