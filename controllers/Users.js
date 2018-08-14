const jwt = require('jwt-simple')
const config = require('../config')

tokenForUser = (user) => {
    return jwt.encode(
        {
            sub: user.id,
            user_type: user.user_type,
            name: user.name,
            username: user.username
        },
        config.secret
    )
}

exports.signin = (req,res,next) => {
    res.send({ token: tokenForUser(req.user) })
}
exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "select * from user";
        var params = "%" + req.query.term + "%"
        connection.query(sql, [params, params], (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}

exports.findById = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("select * from user where id=?", [id], (err, row) => {
            if (err) return next(err)
            res.send(row[0])
        })
    })
}

exports.create = (req, res, next) => {
    var { body } = req
    var post = {
        user_type: body.user_type,
        name: body.name,
        username: body.username,
        password: body.password
    }

    req.getConnection(function (err, connection) {
        connection.query("select username from user where username=?", [post.username], function (err, results) {
            if (err) return next(err)

            if (results.length > 0) {
                res.send({ status: 201, message: 'Username is Duplicate' })
            } else {
                connection.query("insert into user set ? ", post, (err, results) => {
                    if (err) return next(err)
                    res.send(results)
                })
            }
        });
    });
}

exports.update = (req, res, next) => {
    var id = parseInt(req.params.id)
    var { body } = req

    var post = {
        user_type: body.user_type,
        name: body.name,
        username: body.username,
        password: body.password
    }

    req.getConnection(function (err, connection) {
        connection.query("select * from user where username=?", [post.username], function (err, results) {
            if (err) return next(err)

            var isUpdate = false;
            if (results.length > 0) {
                if (results[0].id !== id) {
                    res.send({ status: 201, message: 'Username is Duplicate' })
                } else {
                    isUpdate = true
                }
            } else {
                isUpdate = true
            }

            if (isUpdate) {
                connection.query("update user set ? where id=?", [post, id], function (err, results) {
                    if (err) return next(err)
                    res.send(results)
                });
            }
        });
    });
}

exports.delete = (req, res, next) => {
    var id = parseInt(req.params.id)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        connection.query("delete from user where id=?", [id], (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}