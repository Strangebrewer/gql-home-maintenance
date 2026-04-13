# gql-home-maintenance

A NestJS Apollo Federation 2 subgraph for home and vehicle maintenance tracking. Part of the [personal-enterprise](https://github.com/Strangebrewer/personal-enterprise) federated GraphQL layer.

---

## Domains

**vehicles** — Vehicle maintenance records: service history, repairs, inspections, mileage logs, and anything else tied to a specific vehicle.

**home** — Home maintenance records: repairs, inspections, appliance service, seasonal tasks, and general upkeep logs.

Both domains store flexible, event-style records in MongoDB — document structure varies by record type, which is why this service uses MongoDB rather than a relational DB.

---

## Setup & Patterns

This service was created from [gql-subgraph-template](https://github.com/Strangebrewer/gql-subgraph-template). Refer to that repo for:

- Project structure and six-file domain pattern
- Local dev setup and environment variables
- JWT auth and MongoDB connection patterns
- Running and testing instructions
