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
const {createRandomStr} = require ('../../helpers/utility');
const {verify} = require ('./tokenRoutes.js');
//user Handler object - Module scaffolding
const checkRoutes = {};
//data.create()
// user Routes Handler Function
checkRoutes.checkRoutesHandler = (requestPropertes,callback)=> {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestPropertes.method) > -1){
        
        checkRoutes._check[requestPropertes.method](requestPropertes,callback)
    }else{
        callback(405)
    }
}

checkRoutes._check = {};

checkRoutes._check.get = (requestPropertes, callback) =>{
    const id = typeof(requestPropertes.quaryObj.id) === 'string' &&
                    requestPropertes.quaryObj.id.trim().length === 20 ?
                    requestPropertes.quaryObj.id : false;
                    
    if(id){
        data.read('checks',id,(err,cData)=>{
            if(!err && cData){
                const checkData  = {... parseJson(cData)};
               const token = typeof(requestPropertes.headerObj.token) === 'string' &&
                    requestPropertes.headerObj.token.trim().length === 20 ?
                    requestPropertes.headerObj.token : false;
                verify(checkData.userPhone,token,(isToken)=>{
                    if(isToken){
                        callback(200,checkData)
                    }else{
                        callback(403,{
                         err: 'there is a problem to Authentication token'
                        })
                    }
                })
            }else{
                callback(500,{
                    err: 'there is a problem in server to reade check file'
                })
            }
        })
    }else{
        callback(404,{
            err: 'page not found '
        });
    }
                    

  // callback(200,requestPropertes.body)
}

checkRoutes._check.post = (requestPropertes, callback) =>{
// hash(requestPropertes.body.password);
    const protocol  = typeof(requestPropertes.body.protocol) === 'string' &&
                   ['http','https'].indexOf(requestPropertes.body.protocol) > -1 ?
                    requestPropertes.body.protocol : false;

    const url = typeof(requestPropertes.body.url) === 'string' &&
                    requestPropertes.body.url.length > 0 ?
                    requestPropertes.body.url : false;
                    
    const successCode = typeof(requestPropertes.body.successCode) === 'object' &&
                    requestPropertes.body.successCode instanceof Array  ?
                    requestPropertes.body.successCode : false;
    const  method = typeof(requestPropertes.body.method) === 'string' &&
                    ['get', 'post', 'put', 'delete'].indexOf(requestPropertes.body.method) > -1 ?
                    requestPropertes.body.method : false;
    const timeOutSec = typeof(requestPropertes.body.timeOutSec) === 'number' 
                    && requestPropertes.body.timeOutSec % 1 === 0 
                    && requestPropertes.body.timeOutSec >=1 
                    && requestPropertes.body.timeOutSec <= 5
                    ? requestPropertes.body.timeOutSec : false;
 
    if(protocol && url && method && successCode && timeOutSec ){
        const token = typeof(requestPropertes.headerObj.token) === 'string' 
                        && requestPropertes.headerObj.token.length === 20 
                        ? requestPropertes.headerObj.token : false;
        //lookup the token file
        data.read('token',token,(err,tData)=>{
            if(!err && tData){
                const tokenData = parseJson(tData);
                const userPhone = tokenData.phone
               // lookup the user file
                data.read('user',userPhone,(err,uData)=>{
                    if(!err && uData){
                        verify(userPhone,token,(isTiken)=>{
                            if(isTiken){
                                const userData = parseJson(uData);
                                const checkId = createRandomStr(20);
                                const checksUser = typeof(userData.checks) === 'object' 
                                                 && userData.checks instanceof Array  ? userData.checks : [];
                                if(checksUser.length < 5){
                                    userData.checks = checksUser;
                                    userData.checks.push(checkId);
                                    // update user 
                                    data.update('user',userPhone,userData,(err)=>{
                                        if(!err){
                                             const checkObj = {
                                                 id:checkId,
                                                 userPhone,
                                                 protocol,
                                                 url,
                                                 method,
                                                 successCode,
                                                 timeOutSec
                                             }
                                            data.create('checks',checkId,checkObj,(err)=>{
                                                if (!err){
                                                    callback(200,checkObj)
                                                }else{
                                                    callback(500, {
                                                        message : `there is a problem in server`,
                                                    });
                                                }
                                            })
                                        }else{
                                            callback(500, {
                                                message : `there is a problem in server`,
                                            });
                                        }
                                    })
                                }else{
                                    callback(403, {
                                        message : `your checks is cross limit 'Authontation problem'`,
                                    });
                                }
                               
                            }else{
                                callback(403, {
                                    message : `Authontation problem`,
                                });
                            }
                        })
                    }else{
                        callback(500, {
                            message : `there is problem in reading user file`,
                        });
                    }
                })
            }else{
                callback(500, {
                    message : `there is problem in reading token file`,
                });
            }
        })
    } else {
        callback(400,{
            protocol,url,method,successCode,timeOutSec,
            message: `your given information is wrong`
        })
    }

}

checkRoutes._check.put = (requestPropertes, callback) =>{
      const id = typeof(requestPropertes.body.id) === 'string' &&
                    requestPropertes.body.id.trim().length === 20 ?
                    requestPropertes.body.id : false;
    const protocol  = typeof(requestPropertes.body.protocol) === 'string' &&
                   ['http','https'].indexOf(requestPropertes.body.protocol) > -1 ?
                    requestPropertes.body.protocol : false;

    const url = typeof(requestPropertes.body.url) === 'string' &&
                    requestPropertes.body.url.length > 0 ?
                    requestPropertes.body.url : false;
                    
    const successCode = typeof(requestPropertes.body.successCode) === 'object' &&
                    requestPropertes.body.successCode instanceof Array  ?
                    requestPropertes.body.successCode : false;
    const  method = typeof(requestPropertes.body.method) === 'string' &&
                    ['get', 'post', 'put', 'delete'].indexOf(requestPropertes.body.method) > -1 ?
                    requestPropertes.body.method : false;
    const timeOutSec = typeof(requestPropertes.body.timeOutSec) === 'number' 
                    && requestPropertes.body.timeOutSec % 1 === 0 
                    && requestPropertes.body.timeOutSec >=1 
                    && requestPropertes.body.timeOutSec <= 5
                    ? requestPropertes.body.timeOutSec : false;
    if(id){
        if(protocol || url || method || successCode || timeOutSec ){
          data.read('checks',id,(err,cData)=>{
              if(!err && cData){
                    const checkData = parseJson(cData);
                    const token = typeof(requestPropertes.headerObj.token) === 'string' 
                        && requestPropertes.headerObj.token.length === 20 
                        ? requestPropertes.headerObj.token : false;
                     verify(checkData.userPhone,token,(isToken)=>{
                         if(isToken){
                             if(protocol){
                                 checkData.protocol = protocol
                             }
                             
                             if(url){
                                 checkData.url = url
                             }
                             
                             if(method){
                                 checkData.method = method
                             }
                             
                             if(successCode){
                                 checkData.successCode = successCode
                             }
                             
                             if(timeOutSec){
                                 checkData.timeOutSec = timeOutSec
                             }
                             data.update('checks',id,checkData,(err)=>{
                                 if(!err){
                                     callback(200,{
                                         message: 'your check data update successfully  '
                                     })
                                 }else{
                                     callback(500,{
                                         err:'there is a problem in server to updated checks'
                                     })
                                 }
                             })
                         }else{
                            callback(403,{
                                err: 'Authentication problem'    
                            })
                        }
                     })     
                
              }else{
                  callback(500,{
                    err: 'there is a problem in server to read check file '    
                })
              }
          })  
        }else{
            callback(400,{
                 err: 'there is a problem in your request, you need to give at list 1 filled to change '    
            })
        }
    }else{
        callback(400,{
            err: 'there is a problem in your request '    
        })
    }
    
}

checkRoutes._check.delete = (requestPropertes, callback) =>{
    const id = typeof(requestPropertes.quaryObj.id) === 'string' &&
                    requestPropertes.quaryObj.id.trim().length === 20 ?
                    requestPropertes.quaryObj.id : false;
                    
    if(id){
        data.read('checks',id,(err,cData)=>{
            if(!err && cData){
                const checkData  = {... parseJson(cData)};
               const token = typeof(requestPropertes.headerObj.token) === 'string' &&
                    requestPropertes.headerObj.token.trim().length === 20 ?
                    requestPropertes.headerObj.token : false;
                verify(checkData.userPhone,token,(isToken)=>{
                    if(isToken){
                        data.delete('checks',id,(err)=>{
                            if(!err){
                                data.read('user',checkData.userPhone,(err,uData)=>{
                                    if(!err && uData){
                                        const userData = parseJson(uData);
                                        const checksUser = typeof(userData.checks) === 'object' 
                                                 && userData.checks instanceof Array  ? userData.checks : [];
                                        const checkPosision = checksUser.indexOf(id);
                                        if(checkPosision > -1){
                                            userData.checks.splice(checkPosision,1);
                                            data.update('user',checkData.userPhone,userData,(err)=>{
                                                if(!err){
                                                    callback(200,{
                                                        message: 'checks delet successfully '
                                                    })
                                                }else{
                                                    callback(500,{
                                                        err:'there is a program in server to delet checks in user file'
                                                    })
                                                }
                                            })
                                        }else{
                                            callback(500,{
                                                err: 'there is a problem in server.in your user file there is no checksnid'
                                            })
                                        }
                                    }else{
                                         callback(500,{
                                            err: 'there is a problem in server to reade check file'
                                        })
                                    }
                                })
                            }else{
                                callback(500,{
                                     err: 'there is a problem in server to reade check file'
                                })
                            }
                        })
                    }else{
                        callback(403,{
                            err: 'there is a problem to Authentication token'
                        })
                    }
                })
            }else{
                callback(500,{
                    err: 'there is a problem in server to reade check file'
                })
            }
        })
    }else{
        callback(404,{
            err: 'page not found '
        });
    }
                    

}

module.exports = checkRoutes;