
var db = require("../config/connection")
var collection = require("../config/collection")
var bcrypt = require("bcrypt")
const { ResumeToken } = require("mongodb")
var ObjId = require("mongodb").ObjectID


module.exports = {
    Login: (tutordata) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let tutor = await db.get().collection('tutor').
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
    UpdatetutorDetsils:(tutorId,tutorDetails)=>{
        return new Promise((resolve,reject)=>{
        db.get().collection(collection.TUTOR_COLLECTIONS)
        .updateOne({_id:ObjId(tutorId)},{
            $set:{
                name:tutorDetails.name,
               address:tutorDetails.address,
               job:tutorDetails.job,
               class:tutorDetails.class,
                email:tutorDetails.email,
                mob:tutorDetails.mob
            }                              
        }) .then((resp)=>{
            resolve()
        })
    })
}
}