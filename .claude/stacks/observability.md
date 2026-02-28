# Stack: Observability & Monitoring

> Extracted from `wshobson/agents` plugin `observability-monitoring` (v1.2.1) — 2026-02-28

## Three Pillars

| Pillar | Tool | Purpose |
| --- | --- | --- |
| Metrics | Prometheus + Grafana | Numeric time-series (request rate, latency, CPU) |
| Logs | ELK / Loki + Fluentd | Event-level detail (errors, audit trail) |
| Traces | Jaeger / Tempo + OpenTelemetry | Request flow across services |

## Golden Signals (PromQL)

```promql
# Request Rate
sum(rate(http_requests_total{service="$service"}[5m])) by (method)

# Error Rate
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))

# Latency (p95)
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# Saturation (memory usage)
container_memory_working_set_bytes / container_spec_memory_limit_bytes
```

## Dashboard Design

### Hierarchy

1. **Top row** — Big numbers (stat panels): current error rate, request rate, p99 latency
2. **Middle** — Time series: trends over time, anomaly detection
3. **Bottom** — Tables/heatmaps: per-endpoint breakdown, detailed drill-down

### Methods

| Method | For | Metrics |
| --- | --- | --- |
| RED | Services | **R**ate, **E**rrors, **D**uration |
| USE | Resources | **U**tilization, **S**aturation, **E**rrors |

## SLI / SLO / SLA

### Definitions

- **SLI** (Service Level Indicator) — measurable metric (e.g., % of requests < 200ms)
- **SLO** (Service Level Objective) — target for SLI (e.g., 99.9% of requests < 200ms)
- **SLA** (Service Level Agreement) — contractual SLO with consequences

### Service Tiers

| Tier | SLO Target | Error Budget/month | Examples |
| --- | --- | --- | --- |
| Critical | 99.95% | 21.6 min | Payment, auth |
| Essential | 99.9% | 43.2 min | Core API, main UI |
| Standard | 99.5% | 3.6 hours | Internal tools, reports |
| Best Effort | 99.0% | 7.3 hours | Dev tools, batch jobs |

### Error Budget Formula

```
Error Budget = 1 - SLO Target
99.9% SLO → 0.1% error budget → 43.2 min/month downtime allowed
```

### Error Budget Policy

| Budget Remaining | Action |
| --- | --- |
| > 50% | Normal velocity — ship features |
| 25-50% | Postpone risky changes |
| 10-25% | Feature freeze for non-critical work |
| < 10% | Full reliability focus |
| Exhausted | No deploys until budget recovers |

### Multi-Window Burn Rate Alerts

| Alert | Burn Rate | Window | Budget Consumed | Severity |
| --- | --- | --- | --- | --- |
| Fast burn | 14.4x | 1h | 2% | Critical (page) |
| Slow burn | 6x | 6h | 5% | Warning (ticket) |
| Sustained | 3x | 1d | 10% | Warning (review) |
| Gradual | 1x | 3d | 10% | Info (dashboard) |

### Release Decision Matrix

| Budget Status | Low Risk | Medium Risk | High Risk |
| --- | --- | --- | --- |
| Healthy (>50%) | Approve | Approve | Review |
| Attention (25-50%) | Approve | Review | Defer |
| Warning (10-25%) | Review | Defer | Block |
| Critical (<10%) | Defer | Block | Block |
| Exhausted (0%) | Block | Block | Block |

## OpenTelemetry Instrumentation

### Python (Flask)

```python
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
trace.set_tracer_provider(provider)

FlaskInstrumentor().instrument_app(app)
```

### Node.js (Express)

```javascript
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new BatchSpanProcessor(new OTLPTraceExporter()));
provider.register();

registerInstrumentations({
  instrumentations: [new ExpressInstrumentation()],
});
```

### Sampling Strategies

| Strategy | When | Config |
| --- | --- | --- |
| Probabilistic (1%) | High-traffic prod | `sampler: TraceIdRatioBased(0.01)` |
| Rate limiting (100/s) | Consistent baseline | Custom sampler with token bucket |
| Always-on | Debug/staging | `sampler: AlwaysOnSampler()` |

## Structured Logging

```python
import structlog

logger = structlog.get_logger()

# Every log entry includes:
# - timestamp (ISO 8601)
# - level
# - service name + version
# - trace_id / span_id (correlation with traces)
# - message
# - structured context

logger.info("order.created", order_id=order.id, amount=order.total, customer_id=order.customer_id)
```

## Custom Metrics Middleware (TypeScript)

```typescript
import { Histogram, Counter, register } from 'prom-client';

const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

const httpRequests = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    const labels = { method: req.method, route: req.route?.path || req.path, status_code: res.statusCode };
    end(labels);
    httpRequests.inc(labels);
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

## SLO Review Cadence

### Weekly (30 min)

- Performance review: SLO achievement, burn rate trends (10 min)
- Incident review: impact on error budget (10 min)
- Decision making: release go/no-go based on budget (10 min)

### Monthly

- SLO achievement summary
- Error budget usage trend
- Incident postmortems
- SLO target adjustments if needed

### Quarterly

- SLO relevance assessment
- Target adjustment proposals
- Process improvements

## Reference

- **Prometheus**: https://prometheus.io/docs/
- **Grafana**: https://grafana.com/docs/
- **OpenTelemetry**: https://opentelemetry.io/docs/
- **Google SRE Book (SLOs)**: https://sre.google/sre-book/service-level-objectives/
- **structlog**: https://www.structlog.org/
- **prom-client**: https://github.com/siimon/prom-client
