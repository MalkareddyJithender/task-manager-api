require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5e5208ae9c083a5590daf165').then((result)=>
// {
//     console.log(result)
    
//     return Task.countDocuments({completed:true})
// }).then((result2)=>
// {
//     console.log(result2)
// }).catch((e)=>
// {
//     console.log(e)
// })

const deleteDocumentAndCount = async (id, completed) =>
{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed})
    return count
}

deleteDocumentAndCount('5e59337d8c160335b4dd7022',false).then((count) =>
{
    console.log(count)
}).catch((e) =>
{
    console.log(e)
})