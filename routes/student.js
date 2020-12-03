var express = require('express');
var router = express.Router();
var studentHelper = require("../Helpers/studentHelper")

/* GET users listing. */

const verifyLogin = (req, res, next) => {
   if (req.session.student) { next() }
  else { res.redirect("/student") }
}


router.get("/", function (req, res) {
      if (req.session.student) {  
        console.log("session is there ")
      res.redirect('student/studentHome')
  } else {
       res.render('student/studentLogin', { "loginErr": req.session.stdLoginErr });
       req.session.stdloginErr = false;
  }

})



router.post('/studentLogin', (req, res) => {
   studentHelper.studentLogin(req.body).then((response) => {    
    if (response.status) {
      req.session.student = response.student;
      req.session.student.loggedin = true;
      res.render('student/studentHome', { student: true, studentDetails: req.session.student })
    } else {
       req.session.stdLoginErr = "Invalid user name and password";
      res.redirect('/student')

    }
  })
})

router.get('/studentlogout', verifyLogin,(req, res) => {
  req.session.student.loggedin = false
  req.session.student = null
  res.redirect('/student')
})

router.get('/s_viewProfile',(req,res)=>{
 res.render('student/s_viewProfile', { student: true, student: req.session.student })
})


module.exports = router;
