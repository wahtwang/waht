var express = require('express')
var router = express.Router()
var fs = require('fs')
var conMysql = require('./connection')

router.get('/changePwd', function(req, res) {
  if (!req.session.user) {
    res.redirect('/')
  } else {
    var data = {
      user_Nickname: req.session.user.user_Nickname
    }
    res.render('personalZone/changepwd.html', data)
  }
})

router.post('/oldPwd', function(req, res) {
  if (req.body.user_Pwd === req.session.user.user_Pwd) {
    res.send('success')
  } else {
    res.send('false')
  }
})

router.post('/newPwd', function(req, res) {
  conMysql(
    `UPDATE w_user SET user_Pwd='${req.body.user_Pwd}' WHERE user_Id='${
      req.session.user.user_Id
    }'`,
    function(error) {
      if (error) {
        console.log(error)
      } else {
        req.session.user.user_Pwd = req.body.user_Pwd
        res.send('success')
      }
    }
  )
})

router.get('/deleteNote', function(req, res) {
  conMysql(`DELETE FROM w_notes WHERE n_Id='${req.query.n_Id}'`, function(
    error
  ) {
    if (error) {
      console.log(error)
    } else {
      res.send('success')
    }
  })
})

router.post('/changebase', function(req, res) {
  conMysql(
    `UPDATE w_user
SET user_Nickname='${req.body.user_Nickname}',user_realname='${
      req.body.user_realname
    }',user_location='${req.body.user_location}',user_hometown='${
      req.body.user_hometown
    }',user_sex='${req.body.user_sex}',user_orientation='${
      req.body.user_orientation
    }',user_signature='${req.body.user_signature}',user_birth='${
      req.body.user_birth
    }',user_hobby='${req.body.user_hobby}'
WHERE user_Id=${req.session.user.user_Id}`,
    function(error) {
      if (error) {
        console.log(error)
      } else {
        res.send('success')
      }
    }
  )
})

router.post('/changeconnect', function(req, res) {
  conMysql(
    `UPDATE w_user
SET user_Email='${req.body.user_Email}',user_QQ='${
      req.body.user_QQ
    }',user_phonenumber='${req.body.user_phonenumber}'
WHERE user_Id=${req.session.user.user_Id}`,
    function(error) {
      if (error) {
        console.log(error)
      } else {
        res.send('success')
      }
    }
  )
})

router.post('/changejob', function(req, res) {
  conMysql(
    `UPDATE w_user
SET user_profession='${req.body.user_profession}'
WHERE user_Id=${req.session.user.user_Id}`,
    function(error) {
      if (error) {
        console.log(error)
      } else {
        res.send('success')
      }
    }
  )
})

router.post('/changeeducation', function(req, res) {
  conMysql(
    `UPDATE w_user
SET user_education='${req.body.user_education}',user_school='${
      req.body.user_school
    }'
WHERE user_Id=${req.session.user.user_Id}`,
    function(error) {
      if (error) {
        console.log(error)
      } else {
        res.send('success')
      }
    }
  )
})

router.get('/ud', function(req, res) {
  conMysql(
    `SELECT * FROM w_user WHERE user_Id=${req.session.user.user_Id}`,
    function(error, results) {
      var data = {}
      data.user = results[0]
      data.user_Nickname = results[0].user_Nickname
      res.render('personalZone/userdata.html', data)
    }
  )
})

router.get('/quit', function(req, res) {
  req.session.destroy()
  res.redirect('/')
})

router.get('/mb', function(req, res) {
  if (!req.session.user) {
    res.redirect('/')
  } else {
    var p1 = new Promise(function(resolve) {
      conMysql(
        `SELECT * FROM w_notes WHERE user_Id=${
          req.session.user.user_Id
        } ORDER BY n_Id DESC`,
        function(error, results) {
          if (error) {
            res.end(error)
          } else {
            var data = {}
            var nowDate = new Date().getTime()
            for (index in results) {
              var noteDate = new Date(results[index].n_date).getTime()
              var dDateS = (nowDate - noteDate) / 1000
              switch (true) {
                case dDateS < 60:
                  results[index].n_date = '刚刚'
                  break
                case dDateS >= 60 && dDateS < 3600:
                  results[index].n_date = Math.floor(dDateS / 60) + '分钟前'
                  break
                case dDateS >= 3600 && dDateS < 86400:
                  results[index].n_date = Math.floor(dDateS / 3600) + '小时前'
                  break
                case dDateS >= 86400 && dDateS < 2592000:
                  results[index].n_date = Math.floor(dDateS / 86400) + '天前'
                  break
                case dDateS >= 2592000:
                  results[index].n_date = Math.floor(dDateS / 2592000) + '月前'
                  break
              }
            }
            data.notes = results
            resolve(data)
          }
        }
      )
    })
    p1.then(function(data) {
      conMysql(
        `SELECT * FROM w_user WHERE user_Id=${req.session.user.user_Id}`,
        function(error, results) {
          if (error) {
            res.end(error)
          } else {
            data.user = results[0]
            data.user_Nickname = results[0].user_Nickname
            res.render('personalZone/myblog.html', data)
          }
        }
      )
    })
  }
})

router.get('/editor', function(req, res) {
  //文章编辑界面
  if (!req.session.user) {
    res.redirect('/')
  } else {
    conMysql(`SELECT * FROM w_user`, function(error, results) {
      if (error) {
        res.end(error)
      } else {
        res.render('personalZone/editor.html', results[0])
      }
    })
  }
})

router.post('/Seditor', function(req, res) {
  //提交文章
  var date = new Date().toString()
  conMysql(
    `INSERT INTO w_notes(user_Id,n_Title,n_Content,n_date) VALUES (${
      req.session.user.user_Id
    },'${req.body.n_Title}','${req.body.n_Content}','${date}')`,
    function(error) {
      if (error) {
        res.end(error)
      } else {
        res.send('success')
      }
    }
  )
})

router.get('/', function(req, res) {
  //主页
  if (req.session.user) {
    conMysql(
      `SELECT w_user.*,COUNT(*)AS'n_sum' FROM w_user,w_notes WHERE w_user.user_Id=${
        req.session.user.user_Id
      } AND w_notes.user_Id=w_user.user_Id`,
      function(error, results) {
        if (error) {
          res.end(error)
        } else {
          var data = results[0]
          conMysql(
            `SELECT COUNT(*)AS'n_sum' FROM w_focus WHERE f_userId=${
              req.session.user.user_Id
            }`,
            function(error, results) {
              data.f_sum = results[0].n_sum
              res.render('personalZone/index.html', data)
            }
          )
        }
      }
    )
  } else {
    fs.readFile(__dirname + '/views/index.html', function(error, data) {
      if (error) {
        res.end(error)
      } else {
        res.end(data)
      }
    })
  }
  /*res.redirect('/views/index.html')和app.use有关*/
})

router.get('/getOutNodes', function(req, res) {
  //详细node
  conMysql(
    `SELECT * FROM w_user,w_notes WHERE n_Id='${
      req.query.index
    }'AND w_user.user_Id=w_notes.user_Id`,
    function(error, results) {
      if (error) {
        res.end(error)
      } else {
        res.json(results)
      }
    }
  )
})

router.get('/register', function(req, res) {
  res.render('register.html')
})

router.get('/getNode', function(req, res) {
  conMysql(
    `SELECT * FROM w_notes,w_user WHERE w_user.user_Id=w_notes.user_Id`,
    function(error, results) {
      if (error) {
        res.end(error)
      } else {
        res.send(results)
      }
    }
  )
})

router.post('/login', function(req, res) {
  //登陆
  conMysql(
    `SELECT * FROM w_user WHERE user_Name='${req.body.username}'`,
    function(error, results) {
      if (results.toString() === '') {
        res.send('false username')
      } else {
        if (results[0].user_Pwd === req.body.password) {
          conMysql(
            `SELECT user_Id,user_Nickname,user_Pwd FROM w_user WHERE user_Name='${
              req.body.username
            }'`,
            function(error, results) {
              if (error) {
                res.end(error)
              } else {
                req.session.user = {
                  user_Name: req.body.username,
                  user_Nickname: results[0].user_Nickname,
                  user_Id: results[0].user_Id,
                  user_Pwd: results[0].user_Pwd
                }
                res.send('success')
              }
            }
          )
        } else {
          res.send('false password')
        }
      }
    }
  )
})

router.post('/signin', function(req, res) {
  //注册
  var nowDate = new Date().toString()
  conMysql(
    `SELECT user_Name FROM w_user WHERE user_Name='${req.body.susername}'`,
    function(error, results) {
      if (error) {
        res.end(error)
      } else if (results.toString() === '') {
        conMysql(
          `INSERT INTO w_user(user_Name,user_Pwd,user_Nickname,user_signtime) VALUES ('${
            req.body.susername
          }','${req.body.spassword}','${req.body.sname}','${nowDate}')`,
          function(error) {
            if (error) {
              res.end(error)
            } else {
              conMysql(
                `SELECT user_Id,user_Pwd FROM w_user WHERE user_Name='${
                  req.body.susername
                }'`,
                function(error, results) {
                  if (error) {
                    res.end(error)
                  } else {
                    req.session.user = {
                      user_Name: req.body.susername,
                      user_Nickname: req.body.sname,
                      user_Id: results[0].user_Id,
                      user_Pwd: results[0].user_Pwd
                    }
                    res.send('success')
                  }
                }
              )
            }
          }
        )
      } else {
        res.send('false susername')
      }
    }
  )
})
/*router.get('/setin',function (req,res) {
	var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'wyh603225315',
	database: 'waht'
	})
	connection.connect()
	connection.query('INSERT INTO w_notes VALUES('+req.query.id+',1,"阿萨大大大苏打的安端阿瑟东阿瑟东阿瑟东阿瑟东阿瑟东按时打算发顺丰的安端嗷呜发放哇达萨达阿瑟东","1","1","1","1","'+req.query.p+'")')
	connection.end()
	res.send('1')
})*/
/*router.post('/test',function (req, res) {
	var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'wyh603225315',
	database: 'waht'
	})
	connection.connect()
	connection.query(`UPDATE w_notes SET n_Content='${req.body.text}'`,function(error, results) {
		connection.query(`SELECT n_Content FROM w_notes`,function (error, result) {
			res.send(result[0].n_Content.split('\n'))
			connection.end()
		})
		
	})
})*/
/*router.get('/txt',function (req, res) {
	fs.readFile(__dirname + '/public/txt/test.txt',{encoding:'utf-8'},function (error,data) {
		console.log(data)
		res.type('txt')
		if (error) {
			res.send(error)
		}else {
			res.send(data)
		}
	})
})*/
module.exports = router
