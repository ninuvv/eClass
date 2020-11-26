
var db = require("../config/connection")
var collection = require("../config/collection")
var bcrypt = require("bcrypt")
const { ResumeToken } = require("mongodb")
var ObjId = require("mongodb").ObjectID


module.exports = {
    doLogin: (tutordata) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let tutor = await db.get().collection('tutor').
            findOne( {$and: [{ username: tutordata.username },{ password: tutordata.password } ]})
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
}