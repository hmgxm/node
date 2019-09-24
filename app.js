const port =process.env.PORT || 5000;
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');  //express 版本超过4，直接引如
const flash = require('connect-flash')
const session = require('express-session')
const passport=require('passport');
const db=require('./config/database')

const path=require('path');//引入静态资源

//引入模块并使用
const ideas=require('./routes/ideas')
const users=require('./routes/users')

require('./config/passport')(passport)





//引入method-override  node.js 用来做put请求
const methodOverride = require('method-override');

//引入Mongoose
const mongoose = require('mongoose');
//连接数据库
mongoose.connect(db.mongoURL)
//后面需要换成远程路径
    .then(() => {
        console.log('MongoDB  connect ...')
    })
    .catch((err) => {
        console.log(err);
    })


//引入模型实例化
require('./models/Idea');
const Idea = mongoose.model('ideas');  //使用Idea存取数据





//handlebars  中间件midddleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//使用静态文件
app.use(express.static(path.join(__dirname,'public')))
//使用中间件
app.use(methodOverride('_method'))

//使用session中间件
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

//配置全局变量,中间件
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');//success_msg自定义
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user ||null;
    next();
})


//配置路由
app.get('/', (req, res) => {
    const title = "大家好，我是何苗苗！"
    res.render("index", {
        title: title
    });  //访问一个页面12
})

//关于我们
app.get('/about', (req, res) => {
    res.render('about');
})




app.use('/ideas',ideas)
app.use('/users',users)


app.listen(port, () => {
    console.log(`Server started on ${port}`);
})