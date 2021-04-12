var express = require('express')
var md5 = require('blueimp-md5')
var User = require('./models/user')

var router = express.Router()

router.get('/', function (req, res) {
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', function (req, res,next) {
    res.render('login.html')
})

router.post('/login', function (req, res,next) {
    var body = req.body
    User.findOne({ email: body.email, password: md5(md5(body.password)) }, function (err, ret) {
        if (err) {
            // return res.status(500).json({
            //     err_code: 500
            // })
        return next(err)
        }
        if (!ret) {
            return res.status(200).json({
                err_code: 1
            })
        }
        req.session.user = ret
        return res.status(200).json({
            err_code: 0
        })
    })
})

router.get('/register', function (req, res,next) {
    res.render('register.html')
})

router.post('/register', async function (req, res,next) {
    var body = req.body
    try {
        if (await User.findOne({ email: body.email })) {
            return res.status(200).json({
                err_code: 1
            })
        }
        if (await User.findOne({ nickname: body.nickname })) {
            return res.status(200).json({
                err_code: 2
            })
        }
        // 对密码进行二次加密  md5()
        body.password = md5(md5(body.password))
        await new User(body).save(function (err, data) {
            req.session.user = data
            res.status(200).json({
                err_code: 0
            })
        })
    } catch (err) {
        // res.status(500).json({
        //     err_code: 500
        // })
        return next(err)
    }
})

router.get('/logout', function (req, res) {
    req.session.user = null
    res.redirect('/')
})
module.exports = router