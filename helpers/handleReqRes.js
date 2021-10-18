/*
* Title: Handle request and response
* Description: Handle request and response 
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

//Dependency
const url = require ('url');
const {StringDecoder} = require ('string_decoder')

const routes = require ('../routes');
const {notFoundRoutesHandler} = require ('../handlers/routesHandler/notFoundRoutesHandler');
//const {parseJson} = require('./utility.js');
const {parseJson} = require('./utility.js');
// handeler object - Modele scaffholding
const handler = {};

//handle request response
handler.handleReqRes = (req,res) =>{
    //request handling
    //getting the url and parse it
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimPath = path.replace(/^\/+|\/+$/g,'');
    const method = req.method.toLowerCase()
   const quaryObj = parseUrl.query;
   const headerObj = req.headers;
   const requestPropertes = {
       parseUrl,
       path,
       trimPath,
       method,
       quaryObj,
       headerObj
   }
   
   const decoder = new StringDecoder('utf-8');
   let realData = '';
   
   const chosenHandler = routes[trimPath] ? routes[trimPath] : notFoundRoutesHandler;
   
   req.on('data', (buffer)=>{
       realData += decoder.write(buffer);
   });
   
   req.on('end', ()=>{
       realData += decoder.end();
       
        requestPropertes.body = parseJson(realData);
        chosenHandler( requestPropertes, (statusCode, payload)=>{
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = typeof(payload) === 'object' ? payload : {};
       
            const payloadString = JSON.stringify(payload);
       
            // return the final response
            res.setHeader('content-type','application/jso')
            res.writeHead(statusCode);
            res.end(payloadString);
        })
     })
   
}

module.exports = handler;