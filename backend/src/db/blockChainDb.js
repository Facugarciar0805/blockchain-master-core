const axios = require('axios');

const API_URL = 'http://34.235.151.43:5000/blocks';

async function saveBlock(block) {
    try {
        const payload = {
            block_number: block.index,
            hash: block.hash,
            previous_hash: block.previousHash,
        };

        const response = await axios.post(API_URL, payload);

        console.log('Bloque guardado en DB remota:', response.data);
    } catch (error) {
        console.error('Error guardando bloque:', error.message);
    }
}

module.exports = {
    saveBlock,
};