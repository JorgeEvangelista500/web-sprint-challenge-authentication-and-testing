const Users = require('../auth/auth-model')

const usernameExist = async (req, res, next) => {
    const [user] = await Users.findBy({ username: req.body.username})
    if(user){
        req.user = user
        next()
    } else {
        next({ status:401, message: 'invalid credentials'})
    }
}

const usernameFree = async (req, res, next) => {
    const [user] = await Users.findBy({ username: req.body.username})
    if(!user){
        next()
    } else {
        next ({ status:422, message: 'username taken' })
    }
}

const checkUserData = (req, res, next) => {
    if(!req.body.username){
        next({ status:401, message: "username and password required"})
    } else if (!req.body.password) {
        next({ status:401, message: "username and password required"})
    } else {
        next()
    }
}
module.exports ={
    usernameExist,
    usernameFree,
    checkUserData
}