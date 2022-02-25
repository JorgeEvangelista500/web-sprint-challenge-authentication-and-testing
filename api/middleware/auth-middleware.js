const Users = require('../auth/auth-model')

const usernameExist = async (req, res, next) => {
    const [user] = await Users.findBy({ username: req.body.username})
    if(user){
        req.user =user
        next()
    } else {
        next({ status:401, message: 'invalid credentials'})
    }
}

module.exports ={
    usernameExist
}