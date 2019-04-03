var mysql = require('mysql')
function conMysql (sql,back){
	var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'wyh603225315',
	database: 'waht'
	})
	connection.connect()
	connection.query(sql,function(error, results) {
		if(back){
			back(error, results)
		}
		connection.end()
	})
}
module.exports = conMysql