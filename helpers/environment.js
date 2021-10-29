/*
* Title: Environment variable
* Description: All environment variable is here
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependency

// environment object - Module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'ajsjshshsaja',
    twilio:{
        fromPhone: '+15005550006',
        accountSid:'ACe78d9783d02f1fcf63b8bc268fc3de50',
        authToken:'5f9e90e56cd05e6b8764db85fac0bc1a',
    }
}
environments.production = {
    port: 3000,
    envName: 'production',
    secretKey: 'sgfgddgfscvhh'
}
// determine which environment was passed
const currentEnvironment = typeof(process.env.NODE_ENV)=== 'string' ? process.env.NODE_ENV : 'staging';

// Exports the corresponding environment object
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging
module.exports = environmentToExport;