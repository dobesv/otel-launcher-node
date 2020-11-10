const { lightstep, opentelemetry } = require('../build/src/index');

// set access token or use LS_ACCESS_TOKEN environment variable
const accessToken = 'YOUR ACCESS TOKEN';
const accessToken = 'WA1hHti46U7aknMCn42ar/mt4ExmJirNBdrhvKt7JOU1to1Ot6FrolCpD5AzHD4+5sODLtg2lT1p5/+2BPzaNbPNKg6AXVa6vUo+Y2eP';

const sdk = lightstep.configureOpenTelemetry({
  accessToken,
  serviceName: 'locl-ex',
  metricInterval: 3000,
});

sdk.start().then(() => {
  const tracer = opentelemetry.trace.getTracer('locl-node-example');
  let count = 0;
  setInterval(() => {
    count++;
    const span = tracer.startSpan('test-span');
    span.setAttribute('count', count);
    span.end();

    // force to export traces
    // tracer.getActiveSpanProcessor().forceFlush();
  }, 10000);
}, console.log);
