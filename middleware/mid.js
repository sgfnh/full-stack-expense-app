const jwt = require('jsonwebtoken');
const User = require('../model/signM');

const authenticate = (req, res, next) => {

    try {
        const token = req.header('Authorization');
        console.log(token);
        const signUp = jwt.verify(token, 'secretkey');
        console.log('signUpID >>>> ', signUp.signUpId)
        User.findByPk(signUp.signUpId).then(signUp => {

            req.signUp = signUp; ///ver
            next();
        })

      } catch(err) {
        console.log(err);
        return res.status(409).json({success: false})
        
      }

}

module.exports = {
    authenticate
}