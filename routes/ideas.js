
const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');  
const router=express.Router()
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const  {ensureAuthenticated} =require('../helpers/auth') //导航守卫

//引入模型实例化
require('../models/Idea');
const Idea = mongoose.model('ideas');  //使用Idea存取数据







//添加页面
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
})

//ideas
router.get('/', ensureAuthenticated,(req, res) => {
    //获取数据
    Idea.find({user:req.user.id})//获取所有对象
        .sort({ data: 'desc' })  //排序
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        })

})


//编辑页面
router.get('/edit/:id',ensureAuthenticated, (req, res) => {
    // 根据Id获取数据
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => { 
            if(idea.user!=req.user.id){
                req.flash('error_msg','非法登录')
             res.redirect('/ideas')  
            }
            else{
                res.render('ideas/edit', {
                    idea: idea
                });
            }
            
        })

})

//想学页面  post
router.post('/', urlencodedParser, (req, res) => {
    // console.log(req.body) ;//{ title: 'fgxdg', details: 'gdfhgf' }  表单name值
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: '请输入标题!' })
    }

    if (!req.body.details) {
        errors.push({ text: '请输入详情!' })
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    }
    else {
        // res.send('ok');
        //存数据
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user:req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash("success_msg",'数据添加成功')
                res.redirect('/ideas')
            })
    }

})


//编辑页面

router.put('/:id', urlencodedParser, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            //写入数据库
            idea.save()
                .then(() => {
                    req.flash("success_msg",'数据编辑成功')
                    res.redirect('/ideas')
                })

        })
})


//删除

router.delete('/:id', (req, res) => {
    Idea.remove({
        _id: req.params.id
    })
        .then(() => {
            req.flash("success_msg",'数据删除成功')
            res.redirect('/ideas')
        })
})


module.exports=router;