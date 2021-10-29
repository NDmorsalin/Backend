/*
* Title: project initial file
* Description: user can check their given url status is up or down it check per minute 
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependencies 
const server = require('./lib/server');
const worker = require('./lib/worker');
// App object - Module scaffolding
const  app = {};

//creat server
app.init = () =>{
    // init server
    server.init()
    
    //init worker 
    worker.init()
};

// handle the request and response 
app.init()
//export app module
module.exports = app;
