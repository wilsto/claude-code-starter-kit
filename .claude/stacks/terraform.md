# Stack: Terraform & Cloud Infrastructure

> Extracted from `wshobson/agents` plugin `cloud-infrastructure` (v1.2.2) — 2026-02-28

## Module Architecture

### Hierarchy

```text
infrastructure/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── production/
├── modules/
│   ├── networking/        # VPC, subnets, security groups
│   ├── compute/           # EC2, ECS, Lambda
│   ├── database/          # RDS, DynamoDB
│   └── monitoring/        # CloudWatch, alerts
└── shared/
    ├── backend.tf         # S3 + DynamoDB state backend
    └── providers.tf
```

### Module Design Principles

- **Single responsibility**: one module = one concern (networking, compute, database)
- **Semantic versioning**: tag modules with `vMAJOR.MINOR.PATCH`
- **Composition over inheritance**: combine small modules, don't build mega-modules
- **No hardcoded values**: everything through variables with sensible defaults

## State Management

```hcl
# backend.tf — S3 + DynamoDB state locking
terraform {
  backend "s3" {
    bucket         = "myproject-terraform-state"
    key            = "env/production/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

### Rules

- **Never** edit state manually — use `terraform state mv/rm` commands
- **Always** enable state locking (DynamoDB for S3 backend)
- **Separate** state per environment (dev/staging/prod)
- **Encrypt** state at rest (contains secrets)

## Deployment Strategies

### GitOps with CI/CD

```yaml
# .github/workflows/terraform.yml
jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init
      - run: terraform plan -out=tfplan
      - uses: actions/upload-artifact@v4
        with:
          name: tfplan
          path: tfplan

  apply:
    needs: plan
    runs-on: ubuntu-latest
    environment: production    # manual approval gate
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - uses: actions/download-artifact@v4
        with:
          name: tfplan
      - run: terraform init
      - run: terraform apply tfplan
```

### Drift Detection

```bash
# Run weekly via cron job or scheduled CI
terraform plan -detailed-exitcode
# Exit code 0 = no changes, 1 = error, 2 = drift detected
```

## Cost Optimization Framework

### 4 Levels (progressive)

| Level | Focus | Example |
| --- | --- | --- |
| 1. Visibility | Tag everything, enable cost reports | `default_tags { Environment = "prod" }` |
| 2. Right-sizing | Match instance size to actual usage | CloudWatch metrics → resize |
| 3. Pricing models | Reserved instances, savings plans, spot | 1yr RI = ~40% savings |
| 4. Architecture | Serverless, auto-scaling, lifecycle policies | S3 lifecycle to Glacier after 90d |

### Tagging Strategy

```hcl
provider "aws" {
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "terraform"
      CostCenter  = var.cost_center
    }
  }
}
```

## Service Mesh (when needed)

### Istio vs Linkerd

| Aspect | Istio | Linkerd |
| --- | --- | --- |
| Complexity | High (Envoy-based) | Low (Rust proxy) |
| mTLS | Manual config | Auto-enabled |
| Features | Full (traffic mgmt, observability, security) | Core (mTLS, load balancing, metrics) |
| Resource usage | Higher | Lower |
| Best for | Complex microservices, multi-cluster | Simple service mesh needs |

### mTLS Migration Path

1. Install mesh in **permissive** mode (accepts both plaintext and mTLS)
2. Migrate namespace-by-namespace
3. Verify all traffic is encrypted via mesh dashboard
4. Switch to **strict** mode (reject plaintext)

## Networking Patterns

### Hub-and-Spoke (multi-VPC)

```text
┌─────────────┐
│  Hub VPC     │ ← shared services (DNS, VPN, monitoring)
│  10.0.0.0/16│
└──────┬──────┘
       │ peering
  ┌────┴────┐
  │         │
┌─┴──┐  ┌──┴─┐
│Prod│  │ Dev│  ← spoke VPCs
│VPC │  │ VPC│
└────┘  └────┘
```

### Zero-Trust Principles

- Never trust network location — verify every request
- Least-privilege security groups (deny all, allow specific)
- mTLS between all services
- Identity-based access (not IP-based)

## Testing

### Terratest (Go)

```go
func TestVpcModule(t *testing.T) {
    terraformOptions := &terraform.Options{
        TerraformDir: "../modules/networking",
        Vars: map[string]interface{}{
            "cidr_block": "10.0.0.0/16",
            "environment": "test",
        },
    }
    defer terraform.Destroy(t, terraformOptions)
    terraform.InitAndApply(t, terraformOptions)

    vpcId := terraform.Output(t, terraformOptions, "vpc_id")
    assert.NotEmpty(t, vpcId)
}
```

### Validation Rules (built-in)

```hcl
variable "environment" {
  type = string
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production."
  }
}
```

## Reference

- **Terraform docs**: https://developer.hashicorp.com/terraform
- **OpenTofu** (open-source fork): https://opentofu.org/
- **Terratest**: https://terratest.gruntwork.io/
- **Istio**: https://istio.io/latest/docs/
- **Linkerd**: https://linkerd.io/docs/
