const mqtt = require('mqtt');

let client;
let messageHandler = null;

function connect() {
  client = mqtt.connect('mqtt://localhost:1883');

  client.on('connect', () => {
    console.log('MQTT conectado');
  });

  client.on('message', (topic, message) => {
    if (messageHandler) {
      messageHandler(topic, message.toString());
    }
  });
}

function publish(topic, message) {
  client.publish(topic, message);
}

function subscribe(topic) {
  client.subscribe(topic);
}

function onMessage(handler) {
  messageHandler = handler;
}

module.exports = {
  connect,
  publish,
  subscribe,
  onMessage,
};