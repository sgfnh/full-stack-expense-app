const uuid = require('uuid')
const User = require('../model/signM');
const bcrypt = require("bcrypt");
const Forgotpassword = require('../model/forgetpassword');
const Sib = require("sib-api-v3-sdk");
const defaultClient = Sib.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
const forgotPassword = async (req, res) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ where: { email: email } });
  
      if (user) {
        const id = uuid.v4();
        Forgotpassword.create({ id, active: true,signUpId:user.dataValues.id})
        .catch((err) => {
          throw new Error(err);
        });
  
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
  
        const sender = {
          email: "poojapatel22200@gmail.com",
          name: "Expense Tracker - Admin",
        };
  
        const recievers = [
          {
            email: email,
          },
        ];
        const transactionalEmailApi = new Sib.TransactionalEmailsApi();
        transactionalEmailApi
          .sendTransacEmail({
            subject: "Reset Password Mail",
            sender,
            to: recievers,
            htmlContent: `
                          <h1>Kindly reset the password through below link...</h1>
                          <a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>
                      `,
          })
          .then((result) => {
            console.log(result);
            return res.status(200).json({
              success: true,
              message: "reset password link has been sent to your email",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        throw new Error("User doesnt exist");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error, sucess: false });
    }
  };
  

const resetpassword = async (req, res) => {
  try{
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
          if (forgotpasswordrequest.active === true) {
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
          } else {
            throw new Error("request has expired");
          }
        } else {
          throw new Error("request not found");
        }
    })
  } catch (error) {
    console.log(error);
  }
}

const updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const {resetpasswordid } = req.params;
    Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
        User.findOne({where: { id : resetpasswordrequest.signUpId}})
        
        .then(signUp => {
            
            if(signUp) {
                //encrypt the password
                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, function(err, salt) {
                  if(err){
                       console.log(err);
                       throw new Error(err);
                  }
                bcrypt.hash(newpassword, salt, function(err, hash) {
                //Store hash in your password DB.
                if(err){
                  console.log(err);
                    throw new Error(err);
                   }
                        signUp.update({ password: hash }).then(() => {
                            res.status(201).json({message: 'Successfuly update the new password'})
                        })
                      })
                    })
        } else{
            return res.status(404).json({ error: 'No user Exists', success: false})
        }
        })
      })
    
} catch(error){
    return res.status(403).json({ error, success: false } )
}
}
module.exports = {
    updatepassword,
    resetpassword,
    forgotPassword
}
