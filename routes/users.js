var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')

const getUsers = require('../data_managers/getUsers')
const getUser = require('../data_managers/getUser')
const getUserByEmail = require('../data_managers/getUserByEmail')
const registerUser = require('../data_managers/registerUser')
const setPasswordByEmail = require('../data_managers/setPasswordByEmail')

const jwtSecretWord = "some-secret-key"
const user_tokenLifetime = "1d"
const resetLinkLifetime = "30m"
const clientUrl = "http://localhost:3000" //to send clear session cookie request

router.use(express.json())

function createUser_token(userObject) {
  const userOfSession = {//adding necessary user data, to put in token
    id: userObject.id,
    name: userObject.name,
    email: userObject.email,
    is_admin: userObject.is_admin
  }
  const token = jwt.sign(
    { userOfSession },
    jwtSecretWord,
    { expiresIn: user_tokenLifetime })
    console.log(userOfSession, token)
  return token
}

const verifyUser_token = (req, res, next) => {
  const token = req.cookies.user_token
  if (!token) {
    return res.json({ failure: "You are guest" })
  } else {
    jwt.verify(token, jwtSecretWord, (err, decoded) => {
      if (err) {
        return { failure: "Token is not OK" }
      } else {
        //Assign the decodedUser to the request object to pass it through next()
        //Сan make a request to database here and create more detailed user if needed
        req.decodedUser = decoded.userOfSession

        //refresh token lifetime
        const token = jwt.sign(
          { userOfSession: { ...req.decodedUser }, },
          jwtSecretWord,
          { expiresIn: user_tokenLifetime })
        res.cookie('user_token', token)
        next()
      }
    })
  }
}

router.get('/currentUser', verifyUser_token, (req, res) => {
  return res.json({ currentUser: req.decodedUser });
})

router.post('/login', async function (req, res, next) {
  try {
    const loginAttempt = req.body //format {email, password}
    const userFromDB = await getUserByEmail(loginAttempt.email)
    let answer = ''
    if (!userFromDB) {
      answer = { failure: "no such user" }
    } else {
      if (userFromDB.password === loginAttempt.password) {
        const token = createUser_token(userFromDB)
        res.clearCookie('connect.sid')
        res.cookie('user_token', token)
        answer = { success: `user ${userFromDB.email} identified` } //FOR DEBUGGING - will be replaced with res.(status).json(...)
      } else {
        answer = { failure: "wrong password" } //FOR DEBUGGING - will be replaced with res.(status).json(...)
      }
    }
    res.status(201).json(answer)
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

router.post('/register', async function (req, res, next) {
  try {
    const registerAttempt = req.body
    const newUserFromDB = await registerUser(registerAttempt.email, registerAttempt.password, registerAttempt.name, registerAttempt.telephone) //can I do {...registerAttempt}?
    console.log(newUserFromDB)
    let answer = ''
    if (!newUserFromDB) {
      answer = { failure: "User already exists" }
    } else {
      res.clearCookie('connect.sid')
      res.cookie('user_token', createUser_token(newUserFromDB))
      answer = { success: `user ${newUserFromDB.email} created` }
    }
    res.status(201).json(answer)
  } catch (error) {
    res.status(500).json({ error: "an error happened" })
  }
})

router.get('/logout', (req, res) => { 
  req.session.destroy((err) => {    // Important to destroy sessions, not only delete tokens
    if(err) return res.status(500).json({failure: "Can't logout right now"})
    
    res.clearCookie('user_token')
    return res.json({ success: "Yes" })
  })
})

router.post('/forgot-password', async function (req, res, next) {
  try {
    const { emailToReset } = req.body
    const userFromDB = await getUserByEmail(emailToReset)
    if (!userFromDB) {
      return res.json({ failure: "No such user to reset" })
    } else {
      const uniqueSecretWord = jwtSecretWord + userFromDB.password + userFromDB.email //generate keyphrase which wont match with other users, having same password or this user, resetting other password
      const payload = { id: userFromDB.id, email: userFromDB.email }
      const token = jwt.sign(
        payload,
        uniqueSecretWord,
        { expiresIn: resetLinkLifetime })

      const link = `${clientUrl}/reset-password/${userFromDB.email}/${token}`
      return res.status(201).json({ success: link }) //here would be message by email
    }
  } catch (error) {
    res.status(500).json({ error: "an error happened" })
  }
})

router.post('/reset-password', async function (req, res, next) {
  //const { email } = req.params  /we may pass data here either in params or in POST request body
  const email = req.body.requestingEmail
  const token = req.body.uniqueToken
  const newPassword = req.body.newPassword

  try {
    const userFromDB = await getUserByEmail(email)
    if (!userFromDB) {
      return res.json({ failure: "No such user in database" })
    } else {
      const uniqueSecretWord = jwtSecretWord + userFromDB.password + userFromDB.email //need to create same keyphrase with which token was encrypted
      jwt.verify(token, uniqueSecretWord, (err, decoded) => {
        if (err) {
          return res.json({ failure: "Token is not OK" })
        } else {
          const payload = decoded
          setPasswordByEmail(payload.email, newPassword)
            .then(() => {
              return res.status(201).json({ success: `Password changed: - ${payload.email}, ${newPassword}` })
            })
            .catch(error => {
              return res.status(500).json({ error: "Failed to update password in database" })
            })
        }
      })
    }
  } catch (error) {
    res.status(500).json({ error: "an error happened" })
  }
})

//FOR DEBUGGING ONLY
router.get('/all', async function (req, res, next) {
  try {
    const users = await getUsers()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: "an error happened" })
  }
  //res.send('Here would be users');
});

//FOR DEBUGGING ONLY
router.get('/:id', async function (req, res, next) {
  const id = req.params.id
  const user = await getUser(id)
  res.json(user)
})

//FOR DEBUGGING ONLY
router.post('/', async function (req, res, next) {
  try {
    // Assuming you have a data_manager function to add a new user
    const newUser = req.body; // You need to implement this
    console.log(newUser)
    res.status(201).send("Ananas"); // Respond with the newly created user
  } catch (error) {
    res.status(500).json({ error: "an error happened" })
  }
});

module.exports = router;
