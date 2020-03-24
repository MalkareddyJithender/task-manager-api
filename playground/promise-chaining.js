require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('5e5206c1a28ccd0b38fe3d35',{age:20}).then((user)=>
// {
//     console.log(user)

//     return User.countDocuments({age:20})
// }).then((result2)=>
// {
//     console.log(result2)
// }).catch((e)=>
// {
//     console.log(e)
// })

const updateAgeAndCount = async (id, age)=>
{
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('5e51f0521336f01eacc71b2c',21).then((result) =>
{
    console.log(result)
}).catch((e) =>
{
    console.log(e)
})