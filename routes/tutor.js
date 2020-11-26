const { response } = require('express');
var express = require('express');
var router = express.Router();
var tutorHelper = require("../Helpers/tutorHelper")

/* GET home page. */
router.get("/", function (req, res) {
console.log("login"+req.session.tutor)
  if (req.session.tutor) {
    // res.render('tutor/tutorLogin')
     res.redirect('tutor/tutorHome')
  } else {
   
    res.render('tutor/tutorLogin', { "loginErr": req.session.userLoginErr });
    req.session.userLoginErr = false;
  }
    // res.render('tutor/tutorLogin')
  })
  
  router.post('/tutorLogin', (req, res) => {
    console.log("hello")
    tutorHelper.doLogin(req.body).then((response) => {
      console.log("tutordetails:"+ response.status)
     if (response.status) {
        req.session.tutor = response.tutor;
        req.session.tutor.loggedin = true;
      
       res.render('tutor/tutorHome',{tutor:true,tutorDetails:req.session.tutor})
      } else {
        req.session.userLoginErr = "Invalid user name and password";
        res.redirect('/tutor')
  
      }
    })
  })


  router.get("/tutorHome", function (req, res) {
    res.render('tutor/tutorHome', {tutor:true,tutorDetails:req.session.tutor})
  })

  router.get('/tutorlogout', (req, res) => {
    console.log("logout")
    // req.session.destroy();
     req.session.tutor.loggedin=false
    req.session.tutor=null
    res.redirect('/tutor')
  })
  

module.exports = router;
