var express = require('express');
var router = express.Router();
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken') //npm i jsonwebtoken

const getUsers = require('../data_managers/getUsers')
const getUser = require('../data_managers/getUser')
const loginUser = require('../data_managers/loginUser')
const registerUser = require('../data_managers/registerUser')

/* GET users listing. */

router.use(express.json())

const verifyUser = (req, res, next) => {
  const token = req.cookies.token
  if(!token){
    return res.json({failure: "You are guest"})
  } else {
    jwt.verify(token, "some-secret-key", (err, decoded) => {
      if (err){
        return {failure: "Token is not OK"}
      } else {
        req.dBanswer = decoded.dBanswer
        next()
      }
    })
  }
}

router.get('/currentUser', verifyUser, (req, res) => {
  res.json(req.dBanswer);
})

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({success: "Yes"})
})

router.get('/all', async function (req, res, next) {
  try {
    const users = await getUsers()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: "an error happened" })
  }
  //res.send('Here would be users');
});

router.get('/:id', async function (req, res, next) {
  const id = req.params.id
  const user = await getUser(id)
  res.json(user)
})

router.post('/', async function (req, res, next) { //just to test POST REQUEST
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
    const loginAttempt = req.body
    console.log(loginAttempt)
    const dBanswer = await loginUser(loginAttempt.email, loginAttempt.password)
    console.log(dBanswer)
    let answer = ''
    if (!dBanswer){
      answer = {failure: "no such user"}
    } else {
      //dBanswer.password == loginAttempt.password ? answer = dBanswer : answer = {failure: "wrong password"}
      if(dBanswer.password == loginAttempt.password){
        answer = {success: "Yes", name: dBanswer.name}//dBanswer
        const token = jwt.sign(/*dBanswer*/
          {dBanswer},
          "some-secret-key",
          {expiresIn: "1d"})
        res.cookie('token', token)
      } else {
        answer = {failure: "wrong password"}
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
    if (!dBanswer){
      answer = {failure: "User already exists"}
    } else {
      answer = dBanswer
    }
    res.status(201).json(answer)
  } catch (error) {
    res.status(500).json({ error: "an error happened" })
  }
})

module.exports = router;
