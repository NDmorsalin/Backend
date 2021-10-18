/*
* Title: user routes Handler
* Description: user routes Handler
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependency 
const data = require ('../../lib/data');
const {hash} = require ('../../helpers/utility');
const {parseJson} = require ('../../helpers/utility');
const {verify} = require ('./tokenRoutes.js');
//user Handler object - Module scaffolding
const userRoutes = {};
//data.create()
// user Routes Handler Function
userRoutes.userRoutesHandler = (requestPropertes,callback)=> {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestPropertes.method) > -1){
        userRoutes._user[requestPropertes.method](requestPropertes,callback)
    }else{
        callback(405)
    }
}

userRoutes._user = {};
userRoutes._user.get = (requestPropertes, callback) =>{
   const phone = typeof(requestPropertes.quaryObj.phone) === 'string' &&
                    requestPropertes.quaryObj.phone.trim().length === 11 ?
                    requestPropertes.quaryObj.phone : false;
    const token =  typeof(requestPropertes.headerObj.token) === 'string' &&
                    requestPropertes.headerObj.token.trim().length === 20 ?
                    requestPropertes.headerObj.token : false;               
  if(phone){
         verify(phone,token,(isToken)=>{
             if(isToken){
                data.read('user',phone,(err,u)=>{
                    if(!err){
                        const userInfo = {... parseJson(u)};
                        delete userInfo.hashPassword;
                        callback(200,userInfo);
                    }else{
                        callback(404,{
                        err: 'page not found '
                        })
                   }
                })
            }else{
                 callback(400,{
                    err: 'your token life may expire'
                });
            }
         })
    }else{
       callback(404,{
            err: 'page not found '
        });
    }
                    

  // callback(200,requestPropertes.body)
}
userRoutes._user.post = (requestPropertes, callback) =>{
// hash(requestPropertes.body.password);

const firstName = typeof(requestPropertes.body.firstName) === 'string' &&
                    requestPropertes.body.firstName.trim().length > 0 ?
                    requestPropertes.body.firstName : false;
const lastName = typeof(requestPropertes.body.lastName) === 'string' &&
                    requestPropertes.body.lastName.trim().length > 0 ?
                    requestPropertes.body.lastName : false;
const phone = typeof(requestPropertes.body.phone) === 'string' &&
                    requestPropertes.body.phone.trim().length === 11 ?
                    requestPropertes.body.phone : false;
const password = typeof(requestPropertes.body.password) === 'string' &&
                    requestPropertes.body.password.length >= 8 ?
                    requestPropertes.body.password : false;
const tosAgreement = typeof(requestPropertes.body.tosAgreement) === 'boolean' ?
                    requestPropertes.body.tosAgreement : false;
                    
  // callback(200,userInfo)
 if(firstName && lastName && phone && password && tosAgreement){
 const userInfo = {
    firstName, 
    lastName,
    phone,
    hashPassword: hash(password),
    tosAgreement
 }
 data.read('user',phone,(err,userData)=>{
     if(err){
        data.create('user', phone, userInfo,(err)=>{
            if(!err){
                callback(200, {
                    message: `file is created successfully`
                })
            }
        })
     }else{
         callback(500, {
             message : `file may already exist`,
             userData
         });
     }
 })
 } else {
   callback(400,{
       message: `your given information is wrong`
   })
 }
//data.read()
}
userRoutes._user.put = (requestPropertes, callback) =>{
    
const firstName = typeof(requestPropertes.body.firstName) === 'string' &&
                    requestPropertes.body.firstName.trim().length > 0 ?
                    requestPropertes.body.firstName : false;
const lastName = typeof(requestPropertes.body.lastName) === 'string' &&
                    requestPropertes.body.lastName.trim().length > 0 ?
                    requestPropertes.body.lastName : false;
const phone = typeof(requestPropertes.body.phone) === 'string' &&
                    requestPropertes.body.phone.trim().length === 11 ?
                    requestPropertes.body.phone : false;
const password = typeof(requestPropertes.body.password) === 'string' &&
                    requestPropertes.body.password.length >= 8 ?
                    requestPropertes.body.password : false;
 const token =  typeof(requestPropertes.headerObj.token) === 'string' &&
                    requestPropertes.headerObj.token.trim().length === 20 ?
                    requestPropertes.headerObj.token : false;  
   
    if(phone && (firstName || lastName || password)){
        verify(phone,token,(isToken)=>{
             if(isToken){
        data.read('user', phone, (err,uData)=>{
            const userData = {... parseJson(uData)};
            if(!err && userData){
                if(firstName){
                    userData.firstName = firstName
                }
                if(lastName){
                    userData.lastName = lastName
                }
                if(password){
                    userData.hashPassword = hash(password)
                }
                data.update('user', phone, userData,(err)=>{
                    if(!err){
                        callback(200,{
                             massage: `your data update successfully`
                         });
                    }else{
                        callback(500,{
                            err: `Something is wrong in server`
                         });
                    }
                })
            } else {
                callback(400,{
                    err: `you have a problem in your request`
                });
            }
        })
            }else{
                 callback(400,{
                    err: 'your token life may expire'
                });
            }
         })
    } else {
        callback(400,{
            err: `you have a problem in your request`
        });
    }
}
userRoutes._user.delete = (requestPropertes, callback) =>{
    const phone = typeof(requestPropertes.quaryObj.phone) === 'string' &&
                    requestPropertes.quaryObj.phone.trim().length === 11 ?
                    requestPropertes.quaryObj.phone : false;
           
    const token =  typeof(requestPropertes.headerObj.token) === 'string' &&
                    requestPropertes.headerObj.token.trim().length === 20 ?
                    requestPropertes.headerObj.token : false;  
  if(phone){
      verify(phone,token,(isToken)=>{
             if(isToken){
      data.read('user', phone,(err, uData)=>{
          if(!err && uData){
              data.delete('user',phone,(err)=>{
                  if(!err){
                      callback(200,{
                          message:`file is deleted successfully`
                      });
                  } else {
                      callback(500, {
                           err: 'there is a problem in server side'
                        });
                  }
              })
          }else{
              callback(500, {
                  err: 'there is a problem in server side'
              });
          }
      })
            }else{
                 callback(400,{
                    err: 'your token life may expire'
                });
            }
         })
  }else{
      callback(400,{
          err: 'there is a problem in your request'
      })
  }
}
module.exports = userRoutes;