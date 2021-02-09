# Launcher, a Lightstep Distro for OpenTelemetry 🚀

_NOTE: This is in beta and is expected to GA in Fall 2020._

### What is Launcher?

Launcher is a configuration layer that chooses default values for configuration options that many OpenTelemetry users want. It provides a single function in each language to simplify discovery of the options and components available to users. The goal of Launcher is to help users that aren't familiar with OpenTelemetry quickly ramp up on what they need to get going and instrument.

### Getting started

```bash
npm i lightstep-opentelemetry-launcher-node
```

### Configure

Minimal setup

```javascript
const {
  lightstep,
  opentelemetry,
} = require('lightstep-opentelemetry-launcher-node');

const sdk = lightstep.configureOpenTelemetry({
  accessToken: 'YOUR ACCESS TOKEN',
  serviceName: 'locl-ex',
});

sdk.start().then(() => {
  // Make sure to load any modules you use after otel is started so that it
  // has its module loading hooks in place
  require('./server-main.js').startServer();
});
```

To add some of your own custom instrumentation where the built-in automatic instrumentation of libraries isn't getting enough detail:

```javascript
// At the top level
import { trace } from '@opentelemetry/api';

const tracer = tracer.getTracer('myapp');

// Around some code you want to trace the time taken
function doSomethingOfInterest() {
  const span = tracer.startSpan('test-span');
  try {
    tracer.withSpan(span, () => {
      // ... magic happens here ...
      // because this is inside withSpan, spans created in here will
      // have `span` as their ancestor in the trace by default
    });
  } finally {
    span.end();
  }
}
```

You might want to make a higher-order function to just add instrumentation to a function without changing it:

```typescript
import { SpanOptions, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('app');

export default function withSpan<T extends (...args: any[]) => any>(
  fn: T,
  options?: SpanOptions,
  name: string = fn.name,
): T {
  return (async (...args: Parameters<T>) => {
    const span = tracer.startSpan(name, options);
    try {
      return await tracer.withSpan(span, () => fn(...args));
    } finally {
      span.end();
    }
  }) as any;
}
```

### Configuration Options

| Config Option      | Env Variable                       | Required | Default                                        |
| ------------------ | ---------------------------------- | -------- | ---------------------------------------------- |
| serviceName        | LS_SERVICE_NAME                    | y        | -                                              |
| serviceVersion     | LS_SERVICE_VERSION                 | n        | unknown                                        |
| spanEndpoint       | OTEL_EXPORTER_OTLP_SPAN_ENDPOINT   | n        | https://ingest.lightstep.com/traces/otlp/v0.6  |
| metricEndpoint     | OTEL_EXPORTER_OTLP_METRIC_ENDPOINT | n        | https://ingest.lightstep.com/metrics/otlp/v0.6 |
| accessToken        | LS_ACCESS_TOKEN                    | n        | -                                              |
| logLevel           | OTEL_LOG_LEVEL                     | n        | info                                           |
| propagators        | OTEL_PROPAGATORS                   | n        | b3                                             |
| resource           | OTEL_RESOURCE_ATTRIBUTES           | n        | -                                              |
| metricsHostEnabled | LS_METRICS_HOST_ENABLED            | n        | true                                           |

#### Additional Options

In addition the options below, the `configureOpenTelemetry` function will take any configuration
options supported by the OpenTelemetry Node SDK package and its return value is a NodeSDK instance.
See the [OpenTelemetry Node SDK documentation](https://github.com/open-telemetry/opentelemetry-js/tree/master/packages/opentelemetry-sdk-node) for more details.

### Principles behind Launcher

##### 100% interoperability with OpenTelemetry

One of the key principles behind putting together Launcher is to make lives of OpenTelemetry users easier, this means that there is no special configuration that **requires** users to install Launcher in order to use OpenTelemetry. It also means that any users of Launcher can leverage the flexibility of configuring OpenTelemetry as they need.

##### Validation

Another decision we made with launcher is to provide end users with a layer of validation of their configuration. This provides us the ability to give feedback to our users faster, so they can start collecting telemetry sooner.

Start using it today in [Go](https://github.com/lightstep/otel-launcher-go), [Java](https://github.com/lightstep/otel-launcher-java), [Javascript](https://github.com/lightstep/otel-launcher-node) and [Python](https://github.com/lightstep/otel-launcher-python) and let us know what you think!

---

_Made with_ ![:heart:](https://a.slack-edge.com/production-standard-emoji-assets/10.2/apple-medium/2764-fe0f.png) _@ [Lightstep](http://lightstep.com/)_
