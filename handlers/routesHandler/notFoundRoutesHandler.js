/*
* Title: not found routes Handler
* Description: not found routes Handler
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependency 

//Sample Handler object - Module scaffolding
const notFoundRoutes = {};

// sample Routes Handler Function
notFoundRoutes.notFoundRoutesHandler = (requestPropertes,callback)=>{
    console.log(requestPropertes)
   callback(404,{
       massage: 'your page not found',
   });
}

module.exports = notFoundRoutes;