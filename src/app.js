const mqttService = require('./services/mqttService');
const blockchainService = require('./services/blockchainService');

// conectar
mqttService.connect();

// manejar mensajes entrantes
mqttService.onMessage((topic, message) => {
  if (topic === 'esp/response') {
    console.log('Bloque recibido:', message);

    // 👉 guardar en blockchain
    blockchainService.addBlock(message);
  }
});

// suscribirse
mqttService.subscribe('esp/response');

// mandar transacción
setTimeout(() => {
  mqttService.publish('transactions/new', 'tx1');
  console.log('Transacción enviada');
}, 1000);