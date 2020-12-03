
var db = require("../config/connection")
var collection = require("../config/collection")
var bcrypt = require("bcrypt")
const { ResumeToken } = require("mongodb")
var ObjId = require("mongodb").ObjectID


module.exports = {
    registerHelper :("setChecked", function (value, currentValue) {
        if ( value == currentValue ) {
           return "checked";
        } else {
           return "";
        }
     }),
     
    studentLogin: (studentdata) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let student = await db.get().collection(collection.STUDENT_COLLECTION).
            findOne({ $or: [{ first_name: studentdata.first_name },{regno:studentdata.first_name}] })                    
            if (student) {
                 bcrypt.compare(studentdata.password, student.password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.student = student;
                        response.status = true;
                        resolve(response)
                    }
                    else {
                        console.log("login failed");
                        resolve({ status: false })
                    }
                })
              
            } else {
                console.log("login failed")
                resolve({ status: false })
            }
        })
    }
}