# gql-home-maintenance — Claude Context

## What This Service Is

A NestJS Apollo Federation 2 subgraph for home and vehicle maintenance tracking. Part of the personal-enterprise federated GraphQL layer.

Created from `gql-subgraph-template`. All patterns, structure, and tooling are inherited from that template — refer to its CLAUDE.md for the full reference on patterns, conventions, and setup.

---

## Domains

### `vehicles`
Vehicle maintenance records — service history, repairs, inspections, mileage logs, etc.

| Detail | Value |
|---|---|
| ID prefix | `VHL-` |
| Collection env var | `VEHICLES_COLLECTION` |
| Collection default | `vehicles` |

### `home`
Home maintenance records — repairs, inspections, appliance service, seasonal tasks, etc.

| Detail | Value |
|---|---|
| ID prefix | `HOM-` |
| Collection env var | `HOME_RECORDS_COLLECTION` |
| Collection default | `home_records` |

---

## Current State

- All five domains implemented: `vehicle`, `service_record`, `home`, `home_task`, `home_completion`
- `example/` domain removed
- `DeleteResult` lives in `src/common/models/common.model.ts` — shared across all domains
- Integration tests written for all five domains (`test/*.integration.spec.ts`)
- **Next**: deploy to dev, run migrations (none needed — MongoDB), verify live
