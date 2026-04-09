const { Aedes } = require('aedes'); // 👉 NOTA LAS LLAVES AQUÍ
const aedes = new Aedes();
const server = require('net').createServer(aedes.handle);
const mqttService = require('./services/mqttService');
const blockchainService = require('./services/blockChainService');

// 1. Levantamos el Broker MQTT en el puerto 1883
server.listen(1883, function () {
  console.log('🚀 Broker MQTT interno levantado en el puerto 1883');

  // 2. Una vez que el broker está listo, conectamos nuestro cliente local
  mqttService.connect();
  mqttService.subscribe('mining/solution');

  // 3. Manejamos los mensajes que llegan con la solución
  mqttService.onMessage((topic, message) => {
    if (topic === 'mining/solution') {
      console.log('\n✅ ¡BINGO! Solución recibida del ESP32');
      console.log('Mensaje:', message);
      blockchainService.addBlock(message);
    }
  });

  // 4. El Loop de Prueba (Cada 15 segundos manda un trabajo)
  setInterval(() => {
    const miningJob = JSON.stringify({
      data: "bloque_test_" + Date.now(),
      diff: 4
    });

    mqttService.publish('mining/work', miningJob);
    console.log('📡 Emitiendo bloque de prueba...', miningJob);
  }, 15000);
});