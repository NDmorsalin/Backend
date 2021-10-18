/*
* Title: Routets
* Description: Application All routets is here
* Device: MI A3
* Author: Nd Morsalin
* Date: 09/10/21
*/

// Dependency
const {sampleRoutesHandler} = require ('./handlers/routesHandler/sampleRoutesHandler')
const {userRoutesHandler} = require ('./handlers/routesHandler/userRoutesHandler')
const {tokenRoutesHandler} = require ('./handlers/routesHandler/tokenRoutes')
const {checkRoutesHandler} = require ('./handlers/routesHandler/checkRoutesHandler')
const routes = {
    sample: sampleRoutesHandler,
    user: userRoutesHandler,
    token: tokenRoutesHandler,
    check: checkRoutesHandler,
}

module.exports = routes;