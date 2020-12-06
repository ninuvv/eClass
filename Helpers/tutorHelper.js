
var db = require("../config/connection")
var Getregno = require("../config/regno")
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

    registerHelper: ("setChecked", function (value, currentValue) {
        if (value == currentValue) {
            return "checked";
        } else {
            return "";
        }
    }),

    RegistrationNumber: () => {
        return new Promise(async (resolve, reject) => {
            let number = await db.get().collection(collection.STUDENT_COLLECTION).countDocuments()
            number = number + 1
            var result = ""
            for (var i = 4 - number.toString().length; i > 0; i--) {
                result += "0"
            }
            let regno = "STUD21" + result + number
            resolve(regno)
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
                console.log(data.ops[0]._id)
                resolve(data.ops[0]._id)
            })
        })

    },
    tutorDetails: (tutorId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.TUTOR_COLLECTIONS).findOne({ _id: ObjId(tutorId) }).then((tutor) => {
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



    addStudent: (student, regno) => {

        return new Promise(async (resolve, reject) => {
            student.del_status = false
            student.password = await bcrypt.hash(student.password, 10)
            student.regno = regno
            db.get().collection(collection.STUDENT_COLLECTION).insertOne(student).then((data) => {
                resolve(data.ops[0]._id)
            })

        })


    },



    getallStudents: () => {
        return new Promise(async (resolve, reject) => {
            let students = await db.get().collection(collection.STUDENT_COLLECTION).find({ 'del_status': false }).toArray();
            console.log("details" + students)
            resolve(students)
        })
    },

    deleteStudent: (studId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENT_COLLECTION)
                .updateOne({ _id: ObjId(studId) }, {
                    $set: {
                        del_status: true
                    }
                }).then((resp) => {
                    resolve(resp)
                })

        })
    },
    editStudentDetails: (studId) => {
        return new Promise(async (resolve, reject) => {
            let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({ _id: ObjId(studId) })
            resolve(student)
        })
    },
    UpdateStudent: (studId, studDetails) => {
        return new Promise(async (resolve, reject) => {
            studDetails.password = await bcrypt.hash(studDetails.password, 10)
            db.get().collection(collection.STUDENT_COLLECTION)
                .updateOne({ _id: ObjId(studId) }, {
                    $set: {
                        first_name: studDetails.first_name,
                        last_name: studDetails.last_name,
                        address: studDetails.address,
                        mob: studDetails.mob,
                        email: studDetails.email,
                        password: studDetails.password
                    }
                }).then((resp) => {
                    resolve()
                })
        })
    },

    addAssignment: (details,fileName) => {

        return new Promise(async (resolve, reject) => {
            details.date=new Date()
            details.fileName=fileName
                 db.get().collection(collection.ASSIGNMENT_COLLECTION).insertOne(details).then((data) => {
                resolve(data.ops[0]._id)
            })

        })

      
    },
    loadAssignment: () => {
        return new Promise(async (resolve, reject) => {
            let assignments = await db.get().collection(collection.ASSIGNMENT_COLLECTION).find().toArray();
              resolve(assignments)
        })
    },

    deleteAssignment:(assignId)=>{
        return new Promise( (resolve, reject) => {
            db.get().collection(collection.ASSIGNMENT_COLLECTION).removeOne({_id:ObjId(assignId)}).then((data)=>{
                resolve(data)
            })
            
        })
    },

}