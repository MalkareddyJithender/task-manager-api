const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth');
const textToImage = require('text-to-image');
const router = new express.Router()
const data = require('../fixtures/data');
 
router.post('/tasks',auth, async (req,res) =>
{
    const task = new Task({
        description:'my work--01',
        completed:true,
        owner:'60166db76cbdca3380563930'
    });
    console.log(task);
    await task.save();
    console.log(task);
    // const task = new Task({
    //     ...req.body,
    //     owner: req.user._id   
    // });

    // try
    // {
    //     await task.save()
    //     res.status(201).send(task)
    // }
    // catch(e)
    // {
    //     res.status(400).send(e)
    // }
})

//GET/tasks?completed=true
//GET/tasks?limit=2&skip=2
//GET/tasks?sortBy=createdAt:desc/asc

router.get('/tasks',auth,async (req,res) =>
{
    const match = {}
    const sort =  {}

    if(req.query.completed)
    {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try
    {
   //const tasks =  await Task.find({owner:req.user.id})
   const tasks = await req.user.populate({
       path:'tasks',
       match,
       options:
       {
           limit:parseInt(req.query.limit),
           skip:parseInt(req.query.skip),
           sort:sort
       }
   }).execPopulate()
    res.send(req.user.tasks)
    }
    catch(e)
    {
        res.send(e)
    }

})

router.get('/tasks/:id',auth,async (req,res) =>
{ 
  const _id = req.params.id  
  try
  {
 // const task = await Task.findById(_id)
 const task = await Task.findOne({_id,owner:req.user._id})
  if(!task)
  {
      return res.status(404).send(task)
  }
  res.send(task)
  }
  catch(e)
  {
      res.status(500).send(e)
  }
})


router.patch('/tasks/:id',auth,async (req, res) =>
{
    const updates = Object.keys(req.body)
    const allowedupdates = ['description','completed']
    const isValidOperation = updates.every((update) => allowedupdates.includes(update))

    if(!isValidOperation)
    {
        res.status(400).send({error:'Invalid updates!'})
    }

    const _id = req.params.id
    try{
      
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id,owner:req.user._id})
        
       
       if(!task)
        {
            return res.status(404).send(task)
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)

    }
    catch(e)
    {
     res.status(500).send(e)
    }
})


router.delete('/tasks/:id',auth,async (req, res) =>
{
    const _id = req.params.id
    try{
        //const task = await Task.findByIdAndDelete(_id)
        const task = await Task.findOneAndDelete({_id,owner:req.user.id})
        if(!task)
        {
            return res.status(404).send(task)
        }

        res.send(task)

    }
    catch(e)
    {
        res.status(500).send(e)
    }
});



//get image url
const getImage = (req,res) =>
{
    try
    {
    if(!req.body.actualQuote)
    {
        throw new Error("Quote is required!");
    }
    if(!req.body.color)
    {
        throw new Error("Color is required!");
    };

    textToImage.generate(req.body.actualQuote,{
    maxWidth: 1000,
    customHeight:500,
    bgColor:'black',
    fontFamily:'Lato',
    fontSize:22,
    fontWeight:'bold',
    textColor:req.body.color,
    textAlign:"center",
    verticalAlign:"center"
    }).then(function (dataUri) {
        res.status(200).send(dataUri);
    });
        
    }
    catch(e)
    {
        res.status(400).send(e.message);
    }

};

router.post('/tasks/getUrlOfImage',getImage);

// exxtra added api for getting all comapnies
router.get('/companies',auth,async (req,res) =>
{ 
  const _id = req.params.id  
  try
  {
    if(req.query.name)
    {
      const foundItem = data.find((item) =>
      {
        return item.company_name.trim().toLowerCase() === req.query.name.trim().toLowerCase()
      });
      if(!foundItem)
      {
        throw new Error("No Company Found!");
      }
      return res.status(200).send(foundItem);
    }
    res.send(data);
  }
  catch(e)
  {
      res.status(500).send(e.message)
  }
})







module.exports = router