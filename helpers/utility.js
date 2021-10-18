
/*
* Title: utility
* Description: utility function
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependency 
const crypto = require ('crypto');
const env = require ('./environment');
//utility object - Module scaffolding
const utility = {};

// sample Routes Handler Function
utility.parseJson = (str)=>{
    let output;
    try{
       output = JSON.parse(str) 
    } catch {
       output = {} 
    }
    return output;
}

// create hash by given string
utility.hash = (str)=>{
  return crypto.createHmac("sha256", env.secretKey)
  .update(str)
  .digest("hex");
    
}
// create random string
utility.createRandomStr = (strLen)=>{
    const length = typeof(strLen) === 'number' && strLen > 0 ? strLen : false;
    const possibleChr = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890`;
    let output ='';
    for (let i = 1; i <= length; i++) {
        let randomChr = possibleChr.charAt(Math.floor(Math.random() * possibleChr.length))
        output += randomChr;
    }
    return output;
}

module.exports = utility;