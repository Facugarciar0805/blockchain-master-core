const blockchainDb = require('../db/blockchainDb');

let currentIndex = 1;

async function addBlock(rawBlock) {
    console.log('Agregando bloque a la blockchain:', rawBlock);

    // 👉 crear bloque "fake" pero válido
    const block = {
        index: currentIndex++,
        hash: `hash_${Date.now()}`,
        previousHash: `prev_${Date.now() - 1}`,
    };

    await blockchainDb.saveBlock(block);
}

module.exports = {
    addBlock,
};