const net = require('net');

const client = new net.Socket();
const port = process.env.PORT || 3001;
const host = 'localhost';

client.setTimeout(3000);

client.connect(port, host, () => {
  console.log('Healthcheck OK');
  client.destroy();
  process.exit(0); // success
});

client.on('error', () => {
  console.error('Healthcheck failed');
  process.exit(1); // unhealthy
});

client.on('timeout', () => {
  console.error('Healthcheck timeout');
  process.exit(1); // unhealthy
});
