
const fs = require('fs');
const TOKEN_DIR = require('./global').JWT_SECRET;

let Config = require('./singleton-models/Config');
async function retrieveOrInit(clearCache, variable) {
    if (clearCache || variable.data == undefined) {
        await variable.init();
    }
    return variable;
}

module.exports = {

    initAll: async () => {
        let clearCache = true;
        await retrieveOrInit(clearCache, Config);
    },
    getConfig: async (clearCache) => {
        let resp = await retrieveOrInit(clearCache, Config);
        return resp.data;
    }
}
