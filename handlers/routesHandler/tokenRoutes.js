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
//user Handler object - Module scaffolding
const tokenRoutes = {};
//data.create()
// user Routes Handler Function
tokenRoutes.tokenRoutesHandler = (requestPropertes,callback)=> {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestPropertes.method) > -1){
        
        tokenRoutes._token[requestPropertes.method](requestPropertes,callback)
    }else{
        callback(405)
    }
}

tokenRoutes._token = {};

tokenRoutes._token.get = (requestPropertes, callback) =>{
   const tokenId = typeof(requestPropertes.quaryObj.tokenId) === 'string' &&
                    requestPropertes.quaryObj.tokenId.trim().length === 20 ?
                    requestPropertes.quaryObj.tokenId : false;
           
  if(tokenId){
        data.read('token',tokenId,(err,t)=>{
            if(!err){
                const tokenInfo = {... parseJson(t)};
               if(tokenInfo.expire > Date.now()){
                    callback(200,{
                        massage:'i am successful',
                        tokenInfo
                    });
               }else{
                    callback(500,tokenInfo);
               }
            }else{
                callback(404,{
            err: 'page not found '
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
tokenRoutes._token.post = (requestPropertes, callback) =>{
// hash(requestPropertes.body.password);
const phone = typeof(requestPropertes.body.phone) === 'string' &&
                    requestPropertes.body.phone.trim().length === 11 ?
                    requestPropertes.body.phone : false;
const password = typeof(requestPropertes.body.password) === 'string' &&
                    requestPropertes.body.password.length >= 8 ?
                    requestPropertes.body.password : false;
 if(phone && password ){
    data.read('user',phone,(err,uData)=>{
        if(!err && uData){
         const userData = parseJson(uData);
    // console.log(userData)
        const hashPassword = hash(password);
        if(hashPassword === userData.hashPassword){
            const tokenId = createRandomStr(20);
            const expire = Date.now() + ( 60 * 60 * 1000);
            
            const tokenObj = {
                phone,
                tokenId,
                expire
            }
            data.create('token',tokenId,tokenObj,(err)=>{
                if(!err){
                    callback(200,{
                        message: 'token is create successfully'
                    });
                }else{
                    callback(500, {
                        err: `there is a problem in server`
                     });
                }
            })
        }else{
            callback(400, {
             err: `password is not valid`
         });
        }
         }else{
            callback(500, {
                 message : `there is problem in reading file`,
         });
     }
 })
 } else {
   callback(400,{
       message: `your given information is wrong password or phone`
   })
 }

}

tokenRoutes._token.put = (requestPropertes, callback) =>{
    
 const tokenId = typeof(requestPropertes.body.tokenId) === 'string' &&
                    requestPropertes.body.tokenId.trim().length === 20 ?
                    requestPropertes.body.tokenId : false;
const extend = typeof(requestPropertes.body.extend) === 'boolean'?
                    requestPropertes.body.extend : false;
 if(tokenId && extend){
        data.read('token', tokenId, (err,tData)=>{
            if(!err && tData){
             const tokenData = {... parseJson(tData)};
            if(tokenData.expire > Date.now()){
                tokenData.expire = Date.now() + 60*60*1000;
                
                data.update('token', tokenId, tokenData,(err)=>{
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
            }else{
                callback(400,{
                    err: 'your token has expired'
                });
            }
            } else {
                callback(400,{
                    err: `you have a problem in your request`
                });
            }
        })
    } else {
        callback(400,{
            err: `you have a problem in your request`
        });
    }
}

tokenRoutes._token.delete = (requestPropertes, callback) =>{
    const tokenId = typeof(requestPropertes.quaryObj.tokenId) === 'string' &&
                    requestPropertes.quaryObj.tokenId.trim().length === 20 ?
                    requestPropertes.quaryObj.tokenId : false;
      
    
  if(tokenId){
      data.read('token', tokenId,(err, tData)=>{
          if(!err && tData){
              data.delete('token',tokenId,(err)=>{
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
          err: 'there is a problem in your request'
      })
  }
}

tokenRoutes.verify = (phone,tokenId,callback)=>{
    data.read('token',tokenId,(err,tData)=>{
        if(!err && tData){
            const tokenData = {...parseJson(tData)};
            if(tokenData.phone === phone && tokenData.expire > Date.now()){
                callback(true)
            }else{
                callback(false)
            }
        }else{
            callback(false)
        }
    });
}
module.exports = tokenRoutes;