import express = require('express');
import bodyParser = require("body-parser");
import session = require("express-session");
const port = 3001;
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

// 登录时,提交表单。如果登录成功如何进入主页，如果失败如何弹窗提示
app.post('/login', (req, res)=>{
    let {user, passwd} = req.body;
    console.log(`user = ${user}, passwd = ${passwd}`);
    if(user == 'nash' && passwd == 890){
        let session = req.session as any;
        session.username= user;
        res.redirect('/user/lookup')
        //res.sendFile(process.cwd() + "/public/" + "home.html");
    }
    else
        res.sendFile(process.cwd() + "/public/" + "error.html");
})

// 加上这个中间件，可以确保下面定义的接口必须登录后才能访问
app.use(function (req, res, next) {
    let session = req.session as any;
    if(session.username != undefined){
        next();
    }
    else{
        console.error(`必须登录才能访问该接口!`);
        res.json({
            code : -1,
            msg : '未授权的接口'
        })
    }
  })

app.get('/user/lookup', (req, res)=>{
    let session = req.session as any;
    console.log(`username = ${session.username}`);
    res.json({
        name : 'nash',
        age  : 128,
        salary : 30000,
        workHours : 8
    })
})

app.post('/user', (req, res)=>{
    interface Request{
        name : string,
        age  : number,
        money: number
    };
    let ask : Request = req.body;
    console.log(`BODY : ${ask}`);
    res.send(JSON.stringify(req.body));
});



app.listen(port, '127.0.0.1', ()=>{
    console.log(`Example app listening on port ${port}`);
});