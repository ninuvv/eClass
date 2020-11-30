const { response } = require('express');
var express = require('express');
var router = express.Router();
var tutorHelper = require("../Helpers/tutorHelper")
var _ = require('lodash');

/* GET home page. */
router.get("/", function (req, res) {
  console.log("login" + req.session.tutor)
  if (req.session.tutor) {
    console.log("sessio"+req.session.tutor)
    // res.render('tutor/tutorLogin')
    res.redirect('tutor/tutorHome')
  } else {

    res.render('tutor/tutorLogin', { "loginErr": req.session.userLoginErr });
    req.session.userLoginErr = false;
  }
  // res.render('tutor/tutorLogin')
})

router.post('/tutorLogin', (req, res) => {
  tutorHelper.Login(req.body).then((response) => {
    if (response.status) {
      req.session.tutor = response.tutor;
      req.session.tutor.loggedin = true;

      res.render('tutor/tutorHome', { tutor: true, tutorDetails: req.session.tutor })
    } else {
      req.session.userLoginErr = "Invalid user name and password";
      res.redirect('/tutor')

    }
  })
})


router.get("/tutorHome", function (req, res) {
  res.render('tutor/tutorHome', { tutor: true, tutorDetails: req.session.tutor })
})

router.get('/tutorlogout', (req, res) => {
  console.log("logout")
  // req.session.destroy();
  req.session.tutor.loggedin = false
  req.session.tutor = null
  res.redirect('/tutor')
})

router.get("/t_Annoucements", function (req, res) {
  res.render('tutor/t_Annoucements', { tutor: true, tutorDetails: req.session.tutor })
})

router.post("/t_Annoucements", (req, res) => {
  // console.log(req.body)
  // console.log(req.files.loadedFile)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploads = [];
  for (let k in req.files) {
      req.files[k].mv('./public/annoucements/' + req.files.loadedFile.name, function (err) {
      let promise = new Promise(function (resolve, reject) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
      uploads.push(promise);

    })
  } // end for loop
  Promise.all(uploads).then(function () {
    console.log("succe")
    // res.json({"status":"File uploaded!"});
  }).catch(function (err) {
    res.send(err);
  });



  // upload.mv('./public/annoucements/' + upload.name,(err,data)=>{

  // })
  //loop all files
  //  let filesDetails = []
  // _.forEach(_.keysIn( req.files.loadedFile), (key) => {

  //   let uploadedfile = req.files.loadedFile[key]    
  //   uploadedfile.mv('./public/annoucements/' + uploadedfile.name, (err, done) => {
  //     if (err) return console.log(err)
  //     else {
  //       //push file details
  //       console.log("file details")
  //       filesDetails.push({
  //         name: uploadedfile.name,
  //         mimetype: uploadedfile.mimetype,
  //         size: uploadedfile.size
  //       })

  //     }

  //   })

  // })

  // tutorHelper.addAnnoucements(req.body, filesloaded, (result) => {
  //   res.render('tutor/t_Annoucements', { tutor: true, tutorDetails: req.session.tutor })
  // })





  // let uploadedfile= req.files.loadedFile
  //   uploadedfile.mv('./public/annoucements/' + uploadedfileName, (err, done) => {
  //     if (!err) res.render('tutor/t_Annoucements', { tutor: true, tutorDetails: req.session.tutor })
  //     else console.log(err)
  //   })
  // tutorHelper.addAnnoucements(req.body, (result) => {


  // })
})

router.get("/tutorProfile", function (req, res) {
if (req.session.tutor){
   tutorHelper.tutorDetails( req.session.tutor._id).then((tutorDetails)=>{
    console.log(tutorDetails)
    res.render('tutor/tutorProfile', { tutor: true, tutorDetails })
  })
}else{
  res.render('tutor/tutorProfile', { tutor: true,  tutorDetails: req.session.tutor })
}
 
  
})

router.post("/tutorProfile/:tutorId", (req, res) => {
  tutorHelper.UpdatetutorDetsils(req.params.tutorId, req.body).then(() => {
    id=req.params.tutorId    
    if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/profile_photo/'+id+'.jpg')
      res.redirect("/tutor/tutorProfile")
    }
  })
})

router.get("/t_Event", function (req, res) {
  res.render('tutor/t_Event', { tutor: true, tutorDetails: req.session.tutor })
})


router.post("/t_Event", function (req, res) {
  tutorHelper.addEvent(req.body, (result) => {
    res.redirect("/tutor/t_Event")
   
  })
})


router.get("/t_viewstudents", function (req, res) {
  res.render('tutor/t_viewstudents', { tutor: true, tutorDetails: req.session.tutor })
})


router.get("/t_addstudent", function (req, res) {
  res.render('tutor/t_addstudent', { tutor: true, tutorDetails: req.session.tutor })
})
module.exports = router;
