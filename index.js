/*
* Title: URL status checker
* Description: user can check their given url status is up or down it check per minute 
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependencies 
const http = require ('http');

const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environment');
const data = require('./lib/data');
// App object - Module scaffolding
const  app = {};

//creat server
app.creatServer = () =>{
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, (err)=>{
        if(!err){
            console.log(environment.envName)
            console.log(`server is running on port:${environment.port}`)
        }else{
            console.log(err)
        }
    })
};

// handle the request and response 
app.handleReqRes = handleReqRes;
app.creatServer();