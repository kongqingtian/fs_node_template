const qp = require('@flexsolver/flexqp-pooling');
const localDb = require('../../dbconfig-local.json');


function Model() {
    this.query = `select * from configs where isAvailable`;
    this.data = null;
    this.init = async () => {
        this.data = await qp.executeAndFetchFirstPromise(this.query, [], localDb);
    };
}

module.exports = new Model();