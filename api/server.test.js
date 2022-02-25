// Write your tests here

const Users = require('./auth/auth-model')
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server');






beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
});

beforeEach( async () => {
  await db('users').truncate()
})


test('verify we are using the correct environment', ()  => {
  expect(process.env.NODE_ENV).toBe('testing');
});

describe('[POST] /register test server endpoint', () => {
    test('[POST] register endpoint' , async () => {
      let result = await request(server)
        .post('/api/auth/register')
        .send({ username: 'Jorge', password: '1234'})
      expect(result.status).toBe(201)
      result = await Users.findById(1)
      expect(result.username).toBe('Jorge')
    });

    test('[POST] register require fields' , async () => {
      let result = await request(server)
        .post('/api/auth/register')
        .send({ username: '', password: ''})
      expect(result.status).toBe(401)
    })

    test('[POST] username taken' , async () => {
      let result = await request(server)
        .post('/api/auth/register')
        .send({ username: 'Jorge', password: '1234'})
      expect(result.status).toBe(201)
      result = await Users.findById(1)

      expect(result.username).toBe('Jorge')
      result = await request(server)
        .post('/api/auth/register')
        .send({ username: 'Jorge', password: '1234'})
      expect(result.status).toBe(422)
      
    });
})

describe('[POST] /login test server endpoint', () => {
  test('[POST] login endpoint' , async () => {
    await request(server)
        .post('/api/auth/register')
        .send({ username: 'Jorge', password: '1234'})

    const result = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Jorge', password: '1234'})
    expect(result.status).toBe(200)
  })

  test('[POST] login invalid username' , async () => {
    const result = await request(server)
        .post('/api/auth/login')
        .send({ username: 'Gustavo', password: '1234'})
    expect (result.status).toBe(401)
  })

  test('[POST] login require fields' , async () => {
    let result = await request(server)
      .post('/api/auth/login')
      .send({ username: '', password: ''})
    expect(result.status).toBe(401)
  })
})


describe('[GET] /jokes test server endpoint', () => {
  test('[GET] jokes endpoint' , async () => {
    const results = await request(server)
      .get('/api/jokes')
      expect(results.status).toBe(401)
      
  })

  test('[GET] jokes endpoint' , async () => {

    await request(server)
        .post('/api/auth/register')
        .send({ username: 'Jorge', password: '1234'})

    const result = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Jorge', password: '1234'})
  
    
    const token = JSON.parse(result.text).token

    await request(server)
      .get('/api/jokes')
      .set('Authorization', token)
      .expect(200) 
  })
})