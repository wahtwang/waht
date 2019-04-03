//var express = require('express')
//var app = express()
//var bodyParser = require('body-parser')
//app.engine('html',require('express-art-template'))
//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
//app.get('/',function (req,res) {
//	res.render('ind.html',{
//		a:12
//	})
//})
//app.post('/post',function (req,res) {
//	console.log(req.body)
//})
//app.listen(80,function () {
//	console.log('running')
//})
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var router = require('./router')
var session = require('express-session')
app.use(session({
  // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
  // 目的是为了增加安全性，防止客户端恶意伪造
  secret: 'waht',
  resave: false,
  saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('views',__dirname + '/views/')
app.engine('html',require('express-art-template'))
app.use('/views/',express.static(__dirname + '/views'))
app.use('/public/',express.static(__dirname + '/public'))
app.use(router)
app.listen(8080,function () {
	console.log('runningasdas')
})
//app.set('views','./')
//var mysql = require('mysql')
//connection.connect()
//connection.query('SELECT * FROM `w_user`',function (error, results, fields) {
//	if(error){
//		throw  error
//	}
//	console.log('',results)
//})
//connection.end()