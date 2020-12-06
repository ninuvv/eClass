var express = require('express');
var router = express.Router();
var studentHelper = require("../Helpers/studentHelper")
const app = require('express')()
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const Nexmo = require('nexmo');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
nunjucks.configure('views', { express: app })
var unirest = require('unirest');
var request = require('request')

require('dotenv').config()
// const TOKEN=process.env.token
const nexmo = new Nexmo({
  apiKey: '6de2e27f',
  apiSecret: 'zL1PccyARFVhLaDB',
});

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

router.get('/studentlogout', verifyLogin, (req, res) => {
  req.session.student.loggedin = false
  req.session.student = null
  res.redirect('/student')
})

router.get('/s_viewProfile', (req, res) => {
  console.log(req.session.student)
  res.render('student/s_viewProfile', { student: true, studentDetails: req.session.student })
})

router.get('/s_forgetPassword', (req, res) => {
  res.render('student/s_forgetPassword')
})

const TOKEN=process.env.token

// console.log(${TOKEN})

router.post('/s_verifyPassword', function (req, res) {
  
  var options = {
    'method': 'POST',
    'url': 'https://d7networks.com/api/verifier/send',
    'headers': {
      'Authorization': 'Token cnJubjMxOTA6eGFidFpCS08'
    },
    formData: {
      'mobile': '966'+req.body.mob,
      'sender_id': 'SMSINFO',
      'message': 'Your otp code is {code}',
      'expiry': '900'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });

})

router.post('/s_checkOTP', function (req, res) {

})




// var request = require('request');
// var VERSION = "0.1";

// // https://github.com/TwilioDevEd/account-security-quickstart-node/blob/master/server/lib/phone_verification.js
// //https://www.twilio.com/docs/verify/api/v1/quickstart/nodejs?code-sample=code-send-a-phone-verification-via-sms-or-voice-2&code-language=Node.js&code-sdk-version=default
// module.exports = function (apiKey, apiUrl) {
//   return new PhoneVerification(apiKey, apiUrl);
// };

// function PhoneVerification(apiKey, apiUrl) {
//   this.apiKey = AC8646e238d2918c23b7696f4d33fa8625;
//   this.apiURL = apiUrl || "https://api.authy.com";
//   this.user_agent = "PhoneVerificationRegNode/" + VERSION + " (node " + process.version + ")";
//   this.headers = {};

//   this.init();
// }

// PhoneVerification.prototype.init = function () {
//   this.headers = {
//       "User-Agent": this.user_agent
//   };
// };

// router.post('/s_verifyPassword', function (req, res) {
//   phone_number=req.body.mob,
//   country_code=req.body.code
//   // country_code='+966',
//   via="SMS"
//   PhoneVerification.prototype.requestPhoneVerification = function (phone_number, country_code, via, callback) {
// console.log("verify")
//     this._request("post", "/protected/json/phones/verification/start", {
//             "api_key": this.apiKey,
//             "phone_number": phone_number,
//             "via": via,
//             "country_code": country_code,
//             "code_length": 4
//         },
//         callback
//     );
// };
// })

// router.post('/s_checkOTP', function (req, res) {
//   PhoneVerification.prototype.verifyPhoneToken = function (phone_number, country_code, token, callback) {

//     console.log('in verify phone');
//     this._request("get", "/protected/json/phones/verification/check", {
//             "api_key": this.apiKey,
//             "verification_code": token,
//             "phone_number": phone_number,
//             "country_code": country_code
//         },
//         callback
//     );
// };

  



// router.post('/s_verifyPassword', function (req, res) {

//   nexmo.verify.request({
//     number: req.body.mob,
//     brand: 'Vonage',
//     code_length: '4'
//   }, (err, result) => {
//     console.log(err ? err : result)
//     // if(result.status!=0){
//     //   res.redirect('/student/s_verifyPassword',{ message: result.error_text })
//     //   // res.render('index.html', { message: result.error_text })
//     // } else {
//     //   res.render('student/s_checkOTP', { requestId: result.request_id })
//     //   // res.render('check.html', { requestId: result.request_id })
//     // }
//   });



// })
// router.post('/s_checkOTP', function (req, res) {
 

//   nexmo.verify.check({
//     request_id: req.body.requestId,
//     code: req.body.code
//   }, (err, result) => {
//     // console.log(err ? err : result)
//     if(result.status != 0) {
//       res.redirect('/student/s_verifyPassword',{ message: result.error_text })
//       // res.render('index.html, { message: result.error_?ext })
//     } else {
//       res.render('student/studentHome')
//       // res.render('success.html')
//     }


//   });

// })

module.exports = router;
