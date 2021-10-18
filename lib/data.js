/*
* Title: Library for database
* Description: data menupulation factory
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependency
const fs = require ('fs');
const path = require ('path');

// Library object - module scaffolding
const lib = {};

lib.base = path.join(__dirname,`../.data/`)
//console.info(JSON.stringify({a:5,b:'g'}))
//creating file
lib.create = (dir,file,data,callback)=>{
    // convert data to json
    const jsonData = JSON.stringify(data)
    fs.open(`${lib.base+dir}/${file}.json`,'wx',(err, fileDescriptor)=>{
        if(!err && fileDescriptor){
            fs.writeFile(fileDescriptor,jsonData,(err)=>{
                if(!err){
                    fs.close(fileDescriptor,(err)=>{
                        if(!err){
                            callback(false);
                        }else{
                            callback(`error occur when closing file`)
                        }
                    })
                }else{
                    callback(`error occur when writeFile`)
                }
            });
        }else{
            callback(`error occur file may already exist`)
        }
    })
}
lib.read = (dir,file,callback) =>{
    fs.readFile(`${lib.base+dir}/${file}.json`,'utf-8',(err,data)=>{
        
            callback(err,data);

    })
}
lib.update = (dir,file,data,callback)=>{
    //convert data to JSON
const jsonData = JSON.stringify(data);
fs.open(`${lib.base+dir}/${file}.json`,'r+',(err,fileDescriptor)=>{
    if(!err && fileDescriptor){
       //remove file content
        fs.ftruncate(fileDescriptor,(err)=>{
            if(!err){
                fs.writeFile(fileDescriptor,jsonData,(err)=>{
            if(!err){
                fs.close(fileDescriptor,(err)=>{
                    if(!err){
                        callback(false);
                    } else {
                        callback(`error occur when close the file`);
                    }
                })
            }else{
                callback(`error occur when writing file`)
            }
        })
  
            }else{
                callback(`error occur when remove file content`)
            }
        })
          } else {
        callback(`err occur when opening file`)
    }
})
}
lib.delete =  (dir,file,callback)=>{
    fs.unlink(`${lib.base+dir}/${file}.json`,(err)=>{
        if(!err){
            callback(false);
        } else {
            callback(`err deleting file`)
        }
    })
}
module.exports = lib;