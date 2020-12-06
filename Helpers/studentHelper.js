
var db = require("../config/connection")
var collection = require("../config/collection")
var bcrypt = require("bcrypt")
const { ResumeToken } = require("mongodb")
const { reject } = require("lodash")
var ObjId = require("mongodb").ObjectID
var request = require('request')
var unirest = require('unirest');
var https = require('follow-redirects').https;
var fs = require('fs');
require('dotenv').config()


module.exports = {
 

    studentLogin: (studentdata) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let student = await db.get().collection(collection.STUDENT_COLLECTION).
                findOne({ first_name: studentdata.first_name })
            console.log(student)
            // findOne({ $or: [{ first_name: studentdata.first_name },{regno:studentdata.first_name}] })                    
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
    },

    SendOTP: (mob) => {    
               

                nexmo.verify.request({
                    number: '919847814534',
                    brand: 'Vonage',
                    code_length: '4'
                },(err, result) => {
                    console.log(err ? err : result)
                });

    },

    verifyOTP: (REQUEST_ID) => {
   

        nexmo.verify.check({
            request_id: REQUEST_ID,
            code: 'CODE'
        }, (err, result) => {
            console.log(err ? err : result)
        });
    },
 

}