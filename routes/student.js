var express = require('express');
var router = express.Router();
var studentHelper = require("../Helpers/studentHelper")

/* GET users listing. */

router.get("/", function (req, res) {
    console.log("czxxzc"+req.session.student)
  if (req.session.student) {  
      res.redirect('student/studentHome')
  } else {
    console.log("errormsg"+ req.session.stLoginErr )
    res.render('student/studentLogin', { "stloginErr": req.session.stLoginErr });
    console.log("23214321")
    req.session.stloginErr = false;
  }

})

router.post('/studentLogin', (req, res) => {
  console.log("errormsggggggggg"+ req.session.stLoginErr )
  studentHelper.studentLogin(req.body).then((response) => {    
    if (response.status) {
      req.session.student = response.student;
      req.session.student.loggedin = true;
      res.render('student/studentHome', { student: true, studentDetails: req.session.student })
    } else {
      console.log("failessection")
      req.session.stLoginErr = "Invalid user name and password";
      res.redirect('/student')

    }
  })
})

router.get('/studentlogout', (req, res) => {
  console.log("student logout")
  // req.session.destroy();
  req.session.student.loggedin = false
  req.session.student = null
  res.redirect('/student')
})


module.exports = router;
