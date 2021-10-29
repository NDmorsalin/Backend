/*
 * Title: worker file
 * Description: read checks files given url and check it up or down here
 * Device: MI A3
 * Author: Nd Morsalin
 * Date: 09/10/21
 */

// dependency
const url = require("url");
const http = require("http");
const https = require("https");

const data = require("./data");
const {
    parseJson
} = require("../helpers/utility");
const {
    twilioSendSms
} = require("../helpers/notification");

// worker object  - module scaffolding
const worker = {}
//todo test dirFileList

// validate individual check data
worker.validateCkeckData = (checkData) => {
    if (checkData && checkData.id) {
        checkData.state =
        typeof checkData.state === "string" &&
        ["up",
            "down"].indexOf(checkData.state) > -1
        ? checkData.state: "down"
        checkData.lastChecked =
        typeof checkData.lastChecked === "number" && checkData.lastChecked > 0
        ? checkData.lastChecked: false
        //pass to the next process
        worker.performCheck(checkData)
    } else {
        console.log(`Error : check data is not properly formatted `)
    }
}

// perform Check
worker.performCheck = (checkData) => {
    let checkOutcome = {
        error:false,
        responseCode: false
    }
    let isOutcomeSend = false;
    // parse the hostname and url from check data
    const parseUrl = url.parse(checkData.protocol + '://' + checkData.url, true)
    const path = parseUrl.path;
    const hostname = parseUrl.hostname;

    // construct the request
    const requestDelails = {
        protocol: `${checkData.protocol}:`,
        hostname: hostname,
        path: path,
        timeout: checkData.timeOutSec,
        method: checkData.method.toUpperCase(),
    }
    //check iser given pritocol
    const protocolToUse = checkData.protocol === 'http' ? http: https;
    const req = protocolToUse.request(requestDelails, (res)=> {
        //check the status code
        const status = res.statusCode;
        console.log(res.statusCode);
        checkOutcome.responseCode = status;
        //send response to next process
        if(!isOutcomeSend){
            worker.processCheckOutcom(checkData,checkOutcome);
            isOutcomeSend=true
        }
    })
    req.on('error',(e)=>{
        checkOutcome = {
        error:true,
        value : e
    }
    console.log(e)
        if(!isOutcomeSend){
            worker.processCheckOutcom(checkData,checkOutcome);
            isOutcomeSend=true
        }
    })
    req.on('timeout',()=>{
        checkOutcome = {
        error:true,
        value : 0
    }
    console.log(req.timeout)
        if(!isOutcomeSend){
            worker.processCheckOutcom(checkData,checkOutcome);
            isOutcomeSend=true
        }
    })
}
// 
worker.processCheckOutcom = (checkData,checkOutcome)=>{
    //check if outcome is up or down
    let state = !checkOutcome.error && checkOutcome.responseCode &&
    checkData.successCode.indexOf(checkOutcome.responseCode) >- 1 ? 'up':'down';
    
    //decide whether we should send alert or not
    let isAlertWant = checkData.lastChecked && checkData.state !== state ? true : false;
    // update the check data
    const newCheckData = checkData;
    newCheckData.state = state ;
    newCheckData.lastChecked = Date.now();
    //save new data into database
    data.update('checks',newCheckData.id,newCheckData,(err)=>{
        if(!err){
            if(isAlertWant){
                worker.alertUserToStatus (newCheckData)
            }else{
                console.log(`there is nothing to change to send alert`)
            }
        }else{
            console.log(`err when save new check data after sending request`)
        }
    })

}
//send notifications to user if state change
worker.alertUserToStatus=(newCheckData)=>{
    let msg = `Alert : you check for ${ newCheckData.method} ${newCheckData.pritocol}://${newCheckData.url} is currently ${newCheckData.state}`
    
    twilioSendSms(newCheckData.userPhone,msg,(err)=>{
        if(!err){
            console.log(`this message is send to user ${msg}`)
        }else{
            console.log(`there is an err to send notifications to one of user err is ${err}`)
        }
    });
}
worker.gatherAllChecks = () => {
    //lookup the check list folder
    data.dirFileList("checks", (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach((check) => {
                // read the check data
                data.read("checks", check, (err, cData) => {
                    if (!err && cData) {
                        const checkData = parseJson(cData)
                        // pass the check data to check validator
                        worker.validateCkeckData(checkData)
                    } else {
                        console.log(`err to read one of check file`)
                    }
                })
            })
        } else {
            console.log(`could not find any checks to process`)
        }
    })
}
//loop gatherAllChecks function per second
worker.loop = () => {
    setInterval(worker.gatherAllChecks,
        5000)
}
//stert the worker
worker.init = () => {
    // excute all checks
    worker.gatherAllChecks()

    //call the loop so that checks continue
    worker.loop()
}

// exports wirker module
module.exports = worker