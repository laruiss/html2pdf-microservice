import request from 'supertest'

import app, { apiPrefix } from './app'

describe('Test the root path', () => {
  afterAll(async () => {
    await app.close()
  })

  it('Should return with a 200 for the GET method on /version', async () => {
    await request(app)
      .get(`${apiPrefix}/version`)
      .expect(200)
  })
})
