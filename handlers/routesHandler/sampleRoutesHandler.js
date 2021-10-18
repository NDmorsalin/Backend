/*
* Title: Sample routes Handler
* Description: Sample routes Handler
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependency 

//Sample Handler object - Module scaffolding
const sampleRoutes = {};

// sample Routes Handler Function
sampleRoutes.sampleRoutesHandler = (requestPropertes, callback)=>{
    console.log(requestPropertes)
    callback(202,{
        myName:'Nd Morsalin',
        age: 23
    })
}

module.exports = sampleRoutes;