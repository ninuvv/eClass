const { response } = require('express');
var express = require('express');
var router = express.Router();
var tutorHelper = require("../Helpers/tutorHelper")
var _ = require('lodash');


const verifyLogin = (req, res, next) => {
  console.log("verify"+req.session.tutor)
  if (req.session.tutor) { next() }
  else { res.redirect("/tutor") }
}


/* GET home page. */
router.get("/", function (req, res) { 
  if (req.session.tutor) { 
    // res.render('tutor/tutorLogin')
    res.redirect('tutor/tutorHome')
  } else {
console.log("ver3")
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


router.get("/tutorHome", verifyLogin, function (req, res) {
  res.render('tutor/tutorHome', { tutor: true, tutorDetails: req.session.tutor })
})

router.get('/tutorlogout',verifyLogin, (req, res) => {
  console.log("logout")
  // req.session.destroy();
  req.session.tutor.loggedin = false
  req.session.tutor = null
  res.redirect('/tutor')
})

router.get("/t_Annoucements", verifyLogin, function (req, res) {
  res.render('tutor/t_Annoucements', { tutor: true, tutorDetails: req.session.tutor })
})

router.post("/t_Annoucements", verifyLogin, (req, res) => {
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

router.get("/tutorProfile", verifyLogin, function (req, res) {
  // if (req.session.tutor) {
  //   tutorHelper.tutorDetails(req.session.tutor._id).then((tutorDetails) => {
  //     console.log(tutorDetails)
  //     res.render('tutor/tutorProfile', { tutor: true, tutorDetails })
  //   })
  // } else {
    res.render('tutor/tutorProfile', { tutor: true, tutorDetails: req.session.tutor })
  // }


})

router.post("/tutorProfile/:tutorId",  (req, res) => {
  tutorHelper.UpdatetutorDetsils(req.params.tutorId, req.body).then(() => {
    id = req.params.tutorId
    if (req.files) {
      let image = req.files.Image
      image.mv('./public/profile_photo/' + id + '.jpg')
      // res.render('tutor/tutorhome', { tutor: true,  tutorDetails: req.session.tutor })

      // res.redirect("/tutor/tutorProfile")
    }
    res.redirect("/tutor/tutorhome")
  })
})

router.get("/t_Event", verifyLogin, function (req, res) {
  res.render('tutor/t_Event', { tutor: true, tutorDetails: req.session.tutor })
})


router.post("/t_Event",  function (req, res) {
  tutorHelper.addEvent(req.body, (result) => {
    res.redirect("/tutor/t_Event")

  })
})


router.get("/t_viewStudents", verifyLogin, function (req, res) {
  tutorHelper.getallStudents().then((students) => {
      res.render('tutor/t_viewStudents', {students, tutor: true, tutorDetails: req.session.tutor })

  })

})


router.get("/t_addStudent", verifyLogin, function (req, res) {
  res.render('tutor/t_addStudent', { tutor: true, tutorDetails: req.session.tutor })
})

router.post("/t_addStudent", function (req, res) {

  tutorHelper.addStudent(req.body).then((result) => {
    let image = req.files.Image   
  //   let q=req.files.Image.toString()
    
  //  let exttype= q.split('.')[0]
 
  //  console.log("wwww"+exttype)
    image.mv('./public/profile_photo/' + result + '.'+ 'jpg', (err, done) => {
      if (!err) res.redirect('/tutor/t_addStudent')
      else console.log(err)
    })

  })
})


router.get("/t_editStudent/:studId", verifyLogin, async (req, res) => {
  let student = await tutorHelper.editStudentDetails(req.params.studId);
  res.render('tutor/t_editStudent', { student , tutor: true, tutorDetails: req.session.tutor})
})

router.post("/t_editStudent/:studId", (req, res) => {
  tutorHelper.UpdateStudent(req.params.studId, req.body).then(() => {
    id=req.params.studId
    if (req.files) {
      let image = req.files.Image
      image.mv('./public/profile_photo/'+id+'.jpg')
    }
 res.redirect('/tutor/t_viewStudents')
  })
})

router.get("/t_deletestudent/:studId",verifyLogin, function (req, res) {
  let studId = req.params.studId
  console.log(studId)
  tutorHelper.deleteStudent(studId).then((data) => {
    console.log(data)
    res.redirect("/tutor/t_viewStudents")
  })
})


module.exports = router;
