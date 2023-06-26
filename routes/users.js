var express = require('express');
var router = express.Router();
const {dbUrl}=require('../common/dbConfig')
const {UserModel}=require('../schemas/userSchema')
const mongoose=require('mongoose')
const{hashPassword,hashCompare,createToken,validate,roleAdminGaurd}=require('../common/auth')

mongoose.connect(dbUrl)

/* GET users listing. */
router.get('/',validate,roleAdminGaurd,async function(req, res, next) {
  try {
    let users=await UserModel.find();
    res.status(200).send({
      users,
      message:"Users data fetch Successfull"
    })
  } catch (error) {
    res.status(500).send({
      mesage:"Internal server error",
      error
    })
  }
});



router.post('/signup',async(req,res)=>{
  try{
    let user=await UserModel.findOne({email:req.body.email})
    if(!user){
    let hashedPassword=await hashPassword(req.body.password)
    req.body.password=hashedPassword;
    let user=await UserModel.create(req.body)
    res.status(201).send({message:"user Signup successfull!"})
    }else{
      res.status(400).send('User already exists')
    }
  }catch(error){
    res.sendStatus(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

router.post('/login',async(req,res)=>{
  try{
    let user=await UserModel.findOne({email:req.body.email})
    if(user){
      if(await hashCompare(req.body.password,user.password)){

        let token=await createToken({
          name:user.name,
          email:user.email,
          id:user._id,
          role:user.role
        })

        res.status(200).send({
          message:"user login Successfull",
          token
        })
      }else{
        res.status(402).send({message:"invalid Password"})
      }
    }else{
      res.status(400).send('User does not exists')
    }
  }catch(error){
    res.sendStatus(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

router.get('/:id',async function(req, res) {
  try {
    let user=await UserModel.findOne({_id:req.params.id});
     res.status(200).send({
      user,
      message:"Users data fetch Successfull"
    })
    
  
  }
   catch (error) {
    res.status(500).send({
      mesage:"Internal server error",
      error
    })
  }
});


router.delete('/:id',async(req, res)=>{
  try {
    let user=await UserModel.findOne({_id:req.params.id});
    if(user){
      let user=await UserModel.deleteOne({_id:req.params.id})
      res.status(200).send({
        message:"Users deleted Successfull"
      })
    }else{
      res.status(400).send({
        message:"Users doesnt exists"
      })
    }    
  } catch (error) {
    res.status(500).send({
      mesage:"Internal server error",
      error
    })
  }
});

router.put('/:id',async(req, res)=>{
  try {
    let user=await UserModel.findOne({_id:req.params.id});
    if(user){
      user.name=req.body.name
      user.email=req.body.email
      user.password=req.body.password
      user.mobile=req.body.mobile

      await user.save()


      res.status(200).send({
        message:"Users updated Successfull"
      })
    }else{
      res.status(400).send({
        message:"Users doesnt exists"
      })
    }    
  } catch (error) {
    res.status(500).send({
      mesage:"Internal server error",
      error
    })
  }
});





module.exports = router;
