# gql-home-maintenance — Claude Context

## What This Service Is

A NestJS Apollo Federation 2 subgraph for home and vehicle maintenance tracking. Part of the personal-enterprise federated GraphQL layer.

Created from `gql-subgraph-template`. All patterns, structure, and tooling are inherited from that template — refer to its CLAUDE.md for the full reference on patterns, conventions, and setup.

---

## Domains

### `vehicle`
| Detail | Value |
|---|---|
| ID prefix | `VHL-` |
| Collection env var | `VEHICLES_COLLECTION` |
| Collection default | `vehicles` |

Fields: `id`, `userId`, `year`, `make`, `model`, `mileage`, `color?`, `trim?`, `plate?`, `vin?`, `insuranceId?`

### `service_record`
| Detail | Value |
|---|---|
| ID prefix | `SVC-` |
| Collection env var | `SERVICE_RECORDS_COLLECTION` |
| Collection default | `service_records` |

Fields: `id`, `vehicleId`, `type` (enum), `date`, `mileage`, `cost?`, `name?`, `description?`

`ServiceRecordType`: `OIL_CHANGE` | `TIRE_ROTATION` | `SERVICE_ITEM`

`type` is set on create and never updated — `UpdateServiceRecordArgs` does not include it.

### `home`
| Detail | Value |
|---|---|
| ID prefix | `HOM-` |
| Collection env var | `HOME_RECORDS_COLLECTION` |
| Collection default | `home_records` |

Fields: `id`, `userId`, `address`, `isPrimary: boolean`, `customData?: string`, `yearBuilt?`, `sqFootage?`, `lotSize?`, `purchasePrice?`, `purchaseDate?`, `notes?`

- `isPrimary` — auto-set `true` for the first home created per user. `setPrimaryHome(id)` mutation: `updateMany` clears all user's primaries, then `findOneAndUpdate` sets the new one.
- `customData` — stored as a plain object in MongoDB but exposed as a `String` in the GraphQL schema (serialized with `JSON.stringify` on create/update). Avoids graphql-scalars dependency. Frontend parses/serializes at the boundary.

### `home_task`
| Detail | Value |
|---|---|
| ID prefix | `TSK-` |
| Collection env var | `HOME_TASKS_COLLECTION` |
| Collection default | `home_tasks` |

Fields: `id`, `homeId`, `name`, `frequency` (enum), `description?`, `lastCompletionDate?: string`

`HomeTaskFrequency`: `MONTHLY` | `SEASONAL` | `BI_ANNUAL` | `ANNUAL` | `AS_NEEDED`

`lastCompletionDate` — denormalized from `home_completion`. Kept in sync by `HomeCompletionService`:
- On **create**: if `args.date > task.lastCompletionDate`, update the task
- On **delete**: fetch the completion first (to get `taskId`), delete it, then call `findMostRecentByTask` and update the task with the result (or `null` if no completions remain)

### `home_completion`
| Detail | Value |
|---|---|
| ID prefix | `CMP-` |
| Collection env var | `HOME_COMPLETIONS_COLLECTION` |
| Collection default | `home_completions` |

Fields: `id`, `homeId`, `taskId`, `date`, `cost?`, `notes?`

`HomeCompletionRepository` has `findMostRecentByTask(taskId)` — sorts by `date` descending, limit 1. Used by delete sync logic.

---

## Current State

- All five domains fully implemented and integration tests passing
- `example/` domain removed
- `DeleteResult` lives in `src/common/models/common.model.ts` — shared across all domains
- Deployed to dev. Schema changes (`isPrimary`, `customData`, `lastCompletionDate`) added after initial deploy — requires supergraph recomposition via rover in CI before `gql-router` picks them up
