const express = require('express');
const router = express.Router();
const monk = require('monk');
const db = monk('localhost:27017/ofo');
const users = db.get('users');
const multer  = require('multer')
const path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  }) 
var upload = multer({ storage: storage })

/* GET login page. */
router.get('/login',(req, res) => {
  if(req.session && req.session.user){
    res.redirect('/')
  }else{
    res.render('login',{error:false});
  }
  });

/* GET signup page. */
router.get('/signup',(req, res) => {
  if(req.session && req.session.user){
    res.redirect('/')
  }else{
    res.render('signup',{modal:0,error:false});
  }
  });

/* POST signup form */
router.post('/signup',upload.single('photo'),(req,res) =>{
    let details = {
        name:req.body.name,
        password:req.body.password,
        image:req.file.filename,
        phone:req.body.phone,
        email:req.body.email,
        role:req.body.role
    }
      users.insert(details, (err,docs)=>{
        if(err || !docs){
            console.log(err)
        }else{
            res.render('signup',{modal:1})
        }
      })
  })  

/* POST login form */
router.post('/login',(req,res)=>{
  users.findOne({email:req.body.email,password:req.body.password},(err,docs)=>{
    if(err || !docs){
      res.render('login',{error: "Invalid Mail or Password"})
    }else{
      req.session.user = docs;
      delete docs.password
      res.redirect('/')
    }
  })
})

/* GET user logout */
router.get('/logout',function(req,res){
  req.session.reset();
  res.redirect('/')
})
module.exports = router;