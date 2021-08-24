const express = require('express');
const router = express.Router();
const monk = require('monk');
const db = monk('localhost:27017/ofo');
const users = db.get('users');
const items = db.get('items');
const orders = db.get('orders');

const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '37512227',
  apiSecret: 'zO3VwiGlxdxrJx5P',
},{debug : true});

/* GET home page. */
router.get('/', (req, res) => {
  users.find({"role":"1"},(err,docs)=>{
    if(err || !docs){
      console.log("there is an error: ",err,docs)
    }else{
      if(req.session && req.session.user){
        res.render('index',{isloggedin:true,isOwner:req.session.user.role,names:docs})
      }else{
        res.render('index',{isloggedin:false,isOwner:false,names:docs});
      }
    }
  })
});

/* GET profile page. */
router.get('/profile',(req, res) => {
  if(req.session && req.session.user){
    res.render('profile',
    {
      name:req.session.user.name,
      email:req.session.user.email,
      phone:req.session.user.phone,
      isOwner:req.session.user.role,
      image:req.session.user.image
    });
  }else{
    res.redirect('/')
  }
});

/* GET items by id */
router.get('/items/:id',(req,res) => {
  if(req.session && req.session.user){
    if(req.session.user._id !== req.params.id){
      items.find({"owner":req.params.id},(err,docs)=>{
        if(err || !docs){
          console.log("something went wrong",err,docs)
        }else{
          res.render('items',{isOwner:req.session.user.role,docs,id:req.params.id})
        }
      })
    }else{
      res.redirect('/')
    }
  }else{
  res.redirect('/login')
  }
})

/* SEND sms to customer */
router.get('/send/:phone',(req,res)=>{
  const from = 'Vonage APIs';
  const to = "91" + req.params.phone ;
const text = 'your order was ready';

nexmo.message.sendSms(from, to, text);
res.redirect('/orders')
})


/* POST order from customer */
router.post('/order',(req,res)=>{
  if(req.session && req.session.user && req.body.items){
    let items = JSON.parse(req.body.items) 
    let uniqueItems = []
    for(item of items){
      if(!uniqueItems.includes(item)){
        uniqueItems.push(item)
      }
    }
    let final = []
    for(uniqueitem of uniqueItems){
      let count = 0
      for(item of items){
        if(item === uniqueitem) count++
      }
      final.push({name:uniqueitem,count:count})
    }
    orders.insert({items:final,customer:req.session.user,seller:req.body.id},(err,docs)=>{
      if(err || !docs){
        console.log(err,docs)
      }else{
        res.redirect('/')
      }
    })
  }else{
    res.redirect('/')
  }
})

module.exports = router;
