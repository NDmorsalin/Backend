/*
* Title: server file
* Description: all server related functions here
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependencies
const http = require ('http');

const {
    handleReqRes
} = require('../helpers/handleReqRes');
const environment = require('../helpers/environment');

// App object - Module scaffolding
const  server = {};

//creat server
server.creatServer = () => {
    const serverFun = http.createServer(server.handleReqRes);
    serverFun.listen(environment.port, (err)=> {
        if (!err) {
            console.log(environment.envName)
            console.log(`server is running on port:${environment.port}`)
        } else {
            console.log(err)
        }
    })
};

// handle the request and response
server.handleReqRes = handleReqRes;
server.init = ()=> {
    server.creatServer();
}
module.exports = server;