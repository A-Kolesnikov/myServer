var express = require('express');
var router = express.Router();
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken') //npm i jsonwebtoken

const getUsers = require('../data_managers/getUsers')
const getUser = require('../data_managers/getUser')
const getUserByEmail = require('../data_managers/getUserByEmail')
const loginUser = require('../data_managers/loginUser')
const registerUser = require('../data_managers/registerUser')
const setPasswordByEmail = require('../data_managers/setPasswordByEmail')

const jwtSecretWord = "some-secret-key"

router.use(express.json())

const verifyUser = (req, res, next) => {
  const token = req.cookies.user_token
  if (!token) {
    return res.json({ failure: "You are guest" })
  } else {
    jwt.verify(token, jwtSecretWord, (err, decoded) => {
      if (err) {
        return { failure: "Token is not OK" }
      } else {
        req.decodedUser = decoded.userOfSession  //Assign the decodedUser to the request object to pass it through next(). Сan make a request to database here and create more detailed user if needed
        next()
      }
    })
  }
}

router.get('/currentUser', verifyUser, (req, res) => {
  return res.json(req.decodedUser);
})

router.get('/logout', (req, res) => {
  res.clearCookie('user_token')
  return res.json({ success: "Yes" })
})

router.post('/forgot-password', async function (req, res, next) {
  try {
    const { emailToReset } = req.body
    const usersFromDB = await getUserByEmail(emailToReset)
    if (usersFromDB.length === 0) {
      return res.json({ failure: "No such user to reset" })
    } else {
      const uniqueSecretWord = jwtSecretWord + usersFromDB[0].password + usersFromDB[0].email //generate keyphrase which wont match with other users, having same password or this user, resetting other password
      const payload = { id: usersFromDB[0].id, email: usersFromDB[0].email }
      const token = jwt.sign(
        payload,
        uniqueSecretWord,
        { expiresIn: "2m" })

      const link = `http://localhost:3000/reset-password/${usersFromDB[0].email}/${token}`
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
    const usersFromDB = await getUserByEmail(email)
    if (usersFromDB.length === 0) {
      return res.json({ failure: "No such user in database" })
    } else {
      const uniqueSecretWord = jwtSecretWord + usersFromDB[0].password + usersFromDB[0].email //need to create same keyphrase with which token was encrypted
      jwt.verify(token, uniqueSecretWord, (err, decoded) => {
        if (err) {
          return res.json({ failure: "Token is not OK" })
        } else {
          const payload = decoded
          setPasswordByEmail(payload.email, newPassword)
          return res.status(201).json({ success: `Password changed: - ${payload.email}, ${newPassword}` })
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

router.post('/login', async function (req, res, next) {
  try {
    const loginAttempt = req.body //format {email, password}
    const userFromDB = await loginUser(loginAttempt.email, loginAttempt.password)
    let answer = ''
    if (!userFromDB) {
      answer = { failure: "no such user" }
    } else {
      if (userFromDB.password == loginAttempt.password) {
        const userOfSession = {
          id: userFromDB.id,
          name: userFromDB.name,
          email: userFromDB.email,
          is_admin: userFromDB.is_admin
        }
        answer = { success: `user ${userOfSession.email} identified`} //FOR DEBUGGING - will be replaced with plain status
        console.log(userOfSession)
        const token = jwt.sign(
          {userOfSession},
          jwtSecretWord,
          {expiresIn: "1d"})
        res.cookie('user_token', token)
      } else {
        answer = { failure: "wrong password" }
      }
    }
    return res.status(201).json(answer)
  } catch (error) {
    res.status(500).json({ error: "an error happened" })
  }
})

router.post('/register', async function (req, res, next) {
  try {
    const registerAttempt = req.body
    const dBanswer = await registerUser(registerAttempt.email, registerAttempt.password, registerAttempt.name, registerAttempt.telephone) //can I do {...registerAttempt}?
    console.log(dBanswer)
    let answer = ''
    if (!dBanswer) {
      answer = { failure: "User already exists" }
    } else {
      answer = dBanswer
    }
    res.status(201).json(answer)
  } catch (error) {
    res.status(500).json({ error: "an error happened" })
  }
})

module.exports = router;
