var express = require('express')
var session = require('express-session')
var path = require('path')
var bodyParser = require('body-parser')

var router = require('./router')

var app = express()

app.engine('html', require('express-art-template'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.use('/views/', express.static(path.join(__dirname, './views/')))

app.use(session({
    secret: 'itcast',
    resave: false,
    saveUninitialized: true
}))

app.use(router)

app.use(function (req, res) {
    res.render('404.html')
})

app.use(function (err, req, res, next) {
    return res.status(500).json({
        err_code: 500
    })
})

app.listen(3000, function () {
    console.log('app is running')
})