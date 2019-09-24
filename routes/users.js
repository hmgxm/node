
const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); //密码加密
const passport=require('passport');//登录验证
const router = express.Router()
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//引入模型实例化
require('../models/User')
const User = mongoose.model('users')

//user  login  &  use register

router.get('/login', (req, res) => {
    res.render('users/login')
})


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.get('/logout',(req,res)=>{
    req.logout();

    req.flash("success_msg",'退出成功')
    res.redirect('/users/login')
})

//登录
router.post('/login',urlencodedParser, (req, res,next) => {
    passport.authenticate('local', { failureRedirect: '/users/login',successRedirect: '/ideas',failureFlash:true  })(req,res,next)
   //查询数据

})


//注册
router.post('/register', urlencodedParser, (req, res) => {
    // res.render('users/register')
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({
            text: '两次密码不一致'
        })
    }

    if (req.body.password.length < 4) {
        errors.push({
            text: '密码的长度不能下于4位'
        })
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    }
    else {

        User.findOne({
            email: req.body.email
        })
            .then(user => {
                if (user) {
                    req.flash('error_msg', "邮箱已经存在，请更换邮箱注册")
                    res.redirect('/users/register');
                }
                else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    })
//加密
                    bcrypt.genSalt(10, (err, salt) =>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=> {
                            // Store hash in your password DB.
                            if(err) throw err;
                            newUser.password=hash; //加密后的值
                            newUser.save()
                            .then(user => {
                                req.flash('success_msg', '账号注册成功')
                                res.redirect('/users/login')
    
                            })
                            .catch(err => {
                                req.flash('error_msg', '账号注册成失败')
                                res.redirect('/users/register')
                            })
                        });
                    });


                   

                }
            })


    }
})





module.exports = router