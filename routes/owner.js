const express = require('express');
const router = express.Router();
const monk = require('monk');
const db = monk('localhost:27017/ofo');
const items = db.get('items');
const orders = db.get('orders');

/* GET Add item page. */
router.get('/additem',(req, res) => {
    if(req.session && req.session.user && (req.session.user.role == 1)){
        res.render('additem',{success:false,item:false});
    }else{
      res.redirect('/')
    }
  });
  
/* POST items to db */
router.post('/additem',(req,res) => {
    if(req.session && req.session.user && (req.session.user.role == 1)){
        let details = {
            item:req.body.name,
            price:req.body.price,
            owner:req.session.user._id
        }
        items.insert(details,(err,docs)=>{
            if(err){
                console.log(err)
            }else{
                res.render('additem',{success:true,item:docs.item})
            }
        })
    }
})


/* DELETE orderd from db */
router.get('/delete/:id',(req,res)=>{
    orders.remove({"_id":req.params.id},(err,docs)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/orders')
        }
    })
})


/* GET orders page. */
router.get('/orders',(req, res) => {
    if(req.session && req.session.user && (req.session.user.role == 1)){
        orders.find({"seller":req.session.user._id},(err,docs)=>{
            if(err || !docs){
                console.log(err)
            }else{
                docs.reverse();
                res.render('orders',{docs:docs});
            }
        })
      }else{
        res.redirect('/')
      }
  });

module.exports = router;