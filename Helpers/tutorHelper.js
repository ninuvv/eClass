
var db = require("../config/connection")
var collection = require("../config/collection")
var bcrypt = require("bcrypt")
const { ResumeToken } = require("mongodb")
const { response } = require("express")
var ObjId = require("mongodb").ObjectID


module.exports = {
    Login: (tutordata) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let tutor = await db.get().collection(collection.TUTOR_COLLECTIONS).
                findOne({ $and: [{ username: tutordata.username }, { password: tutordata.password }] })
            if (tutor) {
                response.tutor = tutor;
                response.status = true;

                resolve(response)

            } else {
                console.log("login failed")
                resolve({ status: false })
            }
        })
    },
    addAnnoucements: (details) => {
        // return new Promise((resolve, reject) => {
        //     db.get().collection(collection.ANNOUCEMENTS_COLLECTION).insertOne(details).then((data) => {
        //         console.log(data)
        //         resolve(data.ops[0]._id)
        //     })
        // })

    },

    addEvent: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.EVENT_COLLECTION).insertOne(details).then((data) => {
                console.log(data)
                resolve(data.ops[0]._id)
            })
        })

    },
    tutorDetails:(tutorId)=>{
        return  new Promise((resolve,reject)=>{
            db.get().collection(collection.TUTOR_COLLECTIONS).findOne({ _id: ObjId(tutorId) }).then((tutor)=>{
                resolve(tutor)
            })
        })
       
           
    },
    UpdatetutorDetsils: (tutorId, tutorDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.TUTOR_COLLECTIONS)
                .updateOne({ _id: ObjId(tutorId) }, {
                    $set: {
                        name: tutorDetails.name,
                        address: tutorDetails.address,
                        job: tutorDetails.job,
                        class: tutorDetails.class,
                        email: tutorDetails.email,
                        mob: tutorDetails.mob
                    }
                }).then((resp) => {
                    resolve()
                })
        })
    },
    addStudent: (student) => {

        return new Promise(async (resolve, reject) => {
            student.del_status=false
        student.password = await bcrypt.hash(student.password, 10)
            db.get().collection(collection.STUDENT_COLECTION).insertOne(student).then((data) => {
                resolve(data.ops[0]._id)
            })

        })

      
    },
    getallStudents: () => {
        return new Promise(async (resolve, reject) => {
            let students = await db.get().collection(collection.STUDENT_COLECTION).find({'del_status':false}).toArray();
            console.log("details"+students)
            resolve(students)
        })
    },

    deleteStudent:(studId)=>{
        return new Promise( (resolve, reject) => {
            db.get().collection(collection.STUDENT_COLECTION)
            .updateOne({_id:ObjId(studId)},{
                $set:{
                   del_status:true
                }                              
            }) .then((resp)=>{
                resolve(resp)
            })
            
        })
    },
    editStudentDetails:(studId)=>{
        return new Promise(async(resolve,reject)=>{
            let student = await db.get().collection(collection.STUDENT_COLECTION).findOne({_id:ObjId(studId)})
            resolve(student)
        })
    },
    UpdateStudent:(studId,studDetails)=>{
        return new Promise(async(resolve,reject)=>{
            studDetails.password = await bcrypt.hash(studDetails.password, 10)
        db.get().collection(collection.STUDENT_COLECTION)
        .updateOne({_id:ObjId(studId)},{
            $set:{
                first_name:studDetails.first_name,
                last_name:studDetails.last_name,
                address:studDetails.address,
                mob:studDetails.mob,
                email:studDetails.email,
                password:studDetails.password
            }                              
        }) .then((resp)=>{
            resolve()
        })
    })
}


}