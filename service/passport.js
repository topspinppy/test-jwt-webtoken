const passport = require('passport');
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt

const config = require('../config')

const LocalOptions = {
    passReqToCallback: true
}
const LocalLogin = new LocalStrategy(LocalOptions, (req, username, password, done) => {
  req.getConnection((err, connection) => {
    if (err) return next(err)
    connection.query("select * from user where username=?", [username], (err, row) => {
      if (err) return done(err)
      if(!row.length) return done(null,false)
      if(row[0].password !== password)
      {
        return done(null,false)
      }
      else
      {
        return done(null,row[0])
      }
    })
  })
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
  passReqToCallback: true
}

const jwtRoute = new JwtStrategy(jwtOptions, (req,payload,done) => {
  req.getConnection ((err,connection) => {
    if (err) return next(err)
    connection.query("select * from user where id = ?", [payload.sub], (err,row) => {
      if (err) return done(err)
      if (!row.length) return done(null,false);

      return done(null, row[0]) 
    })
  })
})

passport.use(LocalLogin)
passport.use(jwtRoute)