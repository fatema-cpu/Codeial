const express=require('express')

const router=express.Router()
const passport=require('passport')
const userController=require('../controllers/users_controller')
// manual auth
// router.get('/profile',userController.profile)
router.get('/profile',passport.checkAuthentication,userController.profile)
router.get('/sign-up',userController.signUp)
router.get('/sign-in',userController.signIn)
router.post('/create',userController.create)
// use passport as middleware to auth
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'}
),userController.createSession)

// manual auth routes start
// router.post('/create-session',userController.createSession)
// router.post('/sign-out',userController.signOut)
// ends

module.exports=router
