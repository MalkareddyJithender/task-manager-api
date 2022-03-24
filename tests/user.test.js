const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId,userOne,Setupdatabase} = require('./fixtures/db')


beforeEach(Setupdatabase)

test('Should sign up a new users',async () =>
{
     const response = await request(app).post('/users').send({
    name: 'mallika', 
    email: 'mallika@gmail.com', 
    password: 'mallikaa' 
     }).expect(201) 

     //assert that the database was changed correctly
     const user =await User.findById(response.body.user._id)
     expect(user).not.toBeNull()

     //assertions about response
    expect(response.body).toMatchObject({
        user: {  
            name: 'mallika',
            email: 'mallika@gmail.com'
        },
        token:user.tokens[0].token
    })
    expect(user.password).not.toBe('mallikaa')
})

test('Should login an existing user!',async () =>
{
   const response =  await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
    //assert that token was saved 
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existent user!',async () =>
{
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:'thisisnotmypass'
    }).expect(400)
})


test('Should get the profile for a user',async () =>
{
     await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

})

test('Should not get profile for unauthenticated user',async () =>
{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for a user',async () =>
{
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        //validate user is removed
        const user = await User.findById(userOneId)
        expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user',async () =>
{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar',async () =>
{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update the valid user fields',async () =>
{
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            name:'mallikareddy',
            email:'mallikamalkareddy@gmail.com',
            password:'123456789!'
        })
        .expect(200)
        const user = await User.findById(userOneId)
        expect(user.name).toBe('mallikareddy')
})

test('Should not update invalid user fields',async () =>
{
   const response = await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            location:'Mentrajpally'
        })
        .expect(400)

        expect(response.body.error).toBe('Invalid updates!')

})