const mempool = [];
function addToMempool(userOp) { mempool.push(userOp); }
function getMempool() { return [...mempool]; }
function clearMempool() { mempool.length = 0; }
module.exports = { addToMempool, getMempool, clearMempool };
