const passport = require('passport')
const passportService = require('./service/passport')

const requireSignin = passport.authenticate('local',{ session: false })
const users = require('./controllers/Users')



module.exports = (app) => {
    app.get('/', (req,res) => {
        res.send({ message: 'Student'})
    })

    app.post('/signin', requireSignin, users.signin)
    app.get('/users', users.findAll)
    app.post('/users', users.create)
    app.get('/users/:id', users.findById)
    app.put('/users/:id', users.update)
    app.delete('/users/:id', users.delete)
}