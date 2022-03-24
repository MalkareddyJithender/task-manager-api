const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
      userOneId,
      userOne,
      userTwoId,
      userTwo,
      taskOne,
      taskTwo,
      taskThree,
      Setupdatabase
    } = require('./fixtures/db')

beforeEach(Setupdatabase)

test('Should create a task for a user',async () =>
{
   const response =  await request(app)
        .post('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
                description:'I have just tested task related endpoint',
                completed:true
            })
        .expect(201)
        //assert that database was changed correctly
        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
        //assertions about response
        expect(response.body).toMatchObject({
            description:'I have just tested task related endpoint',
            completed:true
        })
        expect(task.completed).toBe(true)
})

test('Should fetch user tasks',async () =>
{
   const response =  await request(app)
        .get('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks',async () =>
{
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

        const task = await Task.findById(taskOne._id)
        expect(task).not.toBeNull()
})