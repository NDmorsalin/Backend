/*
* Title: send notification to user
* Description: send notification to user throw twilio
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependency
const https = require ('https');
const querystring = require('querystring');
const {
    twilio
} = require('./environment');

//notification objects - module scaffolding
const notification = {};
//send sms to user
notification.twilioSendSms = (phone, sms, callback)=> {
    const userphone = typeof(phone) === 'string' &&
    phone.trim().length === 11 ?
    phone.trim(): false;
    const msg = typeof(sms) === 'string' &&
    sms.trim().length <= 1600 ?
    sms.trim(): false;
    if (userphone && msg) {
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userphone}`,
            Body: msg,
        };
        //stringfy payload
        const payloadStr = querystring.stringify(payload);
        // configure request Details
        const requestDetails = {
            hostname: 'api.twilio.com',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            method: 'POST',
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencode',
            }
        }
        //instantiate the request
        const req = https.request(requestDetails, (res)=> {
            const statusCode = res.statusCode;
            if (statusCode === 200 || statusCode === 201) {
                callback(false)
            } else {
                callback(`the err status code is ${statusCode} ${res.statusMessage}`)
            }
        })
        req.on('error',(e)=>{
            callback(e)
        })
        req.write(payloadStr)
        req.end()
    } else {
        callback(`given value is missing or invaled`)
    }
}

//exports module
module.exports = notification;