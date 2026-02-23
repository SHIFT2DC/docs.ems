---
sidebar_position: 2
---

# Optimization

The optimization module implements a mixed-integer linear programming (MILP) formulation for energy system optimization using Pyomo as the mathematical modeling framework. The energy management problem is expressed through linear objective functions and constraints representing system operation, energy balances, and logical decisions, with both continuous and integer decision variables. The resulting MILP model is solved using the HiGHS optimization solver via its Python interface Highspy, providing efficient and reliable solutions for large-scale and time-coupled optimization problems. This architecture enables flexible model extension, solver interchangeability, and repeated execution for real-time or near-real-time energy optimization applications. At regular intervals, the optimization module provides power setpoints for energy assets based on the measured data.

---

## Features

- **7 Built-in Optimization Objectives**
  - Maximize Self-Consumption
  - Maximize EV Satisfaction
  - Minimize Fossil Emissions
  - Maximize Reliability
  - BESS Lifetime Extension
  - Peak Shaving / Grid Support
  - Maximize Weighted Power Flow

- **Multi-Asset Support**
  - Multiple devices of the same type
  - Automatic asset aggregation

- **Comprehensive Validation**
  - Automatic configuration validation
  - Asset requirement checking
  - Warning system for edge cases

## Supported Assets

| Supported Type            | Description                                                                                                   |
| -------------             | -------------                                                                                                 |
| **Solar PV**                  | Electrical plant with photovoltaic panels                                                                     |
| **Battery Storage**           | Battery Energy Storage System (BESS)                                                                          |
| **Load**                      | Any load which can be curtailed/shedded during the optimization process. For example, lighting during the day |
| **Critical Load**             | The load which must not be curtailed during the optimization process. For example, server's power supply.     |
| **Unidirectional EV charger** | EV chargers which support only one way of energy flow (from grid to car)                                      |
| **Bidirectional EV charger**  | EV charger that support bidirectional power flow, i.e. Vehicle to Grid (V2G) chargers                         |
| **Wind Generator**            | Wind generator                                                                                                |
| **Active Front End**          | Indicates the asset which connects the site to the main electrical grid.                                      |


## Supported Objectives

| Objective | Code | Best For |
|-----------|------|----------|
| Maximize Self-Consumption | `maxSelfConsumption` | Solar/wind sites wanting to minimize grid import |
| Maximize EV Satisfaction | `maxEVSatisfaction` | EV charging stations, fleet operations |
| Minimize Fossil Emissions | `minFossilEmissions` | Sustainability goals, carbon reduction |
| Maximize Reliability | `maxReliability` | Critical infrastructure, hospitals, data centers |
| BESS Lifetime Extension | `lifeExtentBESS` | Expensive batteries, long-term cost optimization |
| Peak Shaving | `peakShaving` | Demand charge reduction, grid services |
| Maximize Weighted Power Flow | `maxWeightPowerFlow` | Maximize weighted power flows, prioritizing: PV -> Loads -> EVs -> GridService -> BESS -> Grid Import -> V2G |

### Maximize Self-Consumption (`maxSelfConsumption`)
**Goal:** Maximize the use of locally generated renewable energy

**Strategy:**
- Prioritize PV and wind power usage
- Store excess renewable energy in BESS
- Minimize grid import
- Prefer local consumption over export

**Required Assets:**
- At least one AFE (Active Front End)
- At least one renewable source (PV or WIND)

**Optimal For:**
- Sites with significant renewable generation
- Reducing grid dependency
- Lowering energy costs

---

### Maximize EV Satisfaction (`maxEVSatisfaction`)
**Goal:** Maximize EV charging to meet departure requirements

**Strategy:**
- Prioritize EV charging above other loads
- Ensure vehicles reach target SoC
- Minimize V2G discharge
- Use all available energy sources

**Required Assets:**
- At least one AFE
- At least one EV charger (UNI_EV or BI_EV)

**Optimal For:**
- Fleet charging operations
- EV charging stations
- Sites where EV charging is critical

---

### Minimize Fossil Emissions (`minFossilEmissions`)
**Goal:** Minimize carbon footprint by reducing fossil fuel usage

**Strategy:**
- Maximize renewable energy usage
- Minimize grid import (assumed fossil-based)
- Store renewables in BESS
- Allow controlled load shedding if necessary

**Required Assets:**
- At least one AFE
- At least one renewable source (PV or WIND)

**Optimal For:**
- Sustainability-focused operations
- Carbon-neutral goals
- Green energy initiatives

---

### Maximize Reliability (`maxReliability`)
**Goal:** Ensure continuous power supply to critical loads

**Strategy:**
- Maintain high BESS charge for backup
- Prioritize critical loads
- Keep reserve capacity
- Minimize grid dependence

**Required Assets:**
- At least one AFE
- At least one BESS (for backup power)

**Optimal For:**
- Data centers
- Hospitals
- Critical infrastructure
- Sites requiring high uptime

---

### BESS Lifetime Extension (`lifeExtentBESS`)
**Goal:** Extend battery life by minimizing cycling and stress

**Strategy:**
- Minimize charge/discharge cycles
- Keep SoC in optimal range (40-70%)
- Avoid deep discharge
- Reduce power throughput
- Use grid and V2G instead of BESS when possible

**Required Assets:**
- At least one AFE
- At least one BESS

**Optimal For:**
- Expensive battery systems
- Long-term cost optimization
- Systems with limited battery replacement budget

---

### Peak Shaving / Grid Support (`peakShaving`)
**Goal:** Reduce peak demand and provide grid services

**Strategy:**
- Reduce peak grid import
- Provide grid services when requested
- Use BESS to flatten load profile
- Export excess renewable energy

**Required Assets:**
- At least one AFE
- At least one BESS

**Optimal For:**
- Demand charge reduction
- Grid service revenue
- Utility partnerships
- Load balancing applications

---

## Choosing the Right Objective

**For renewable energy sites:**
- Use `maxSelfConsumption` to maximize on-site renewable usage
- Use `minFossilEmissions` to minimize carbon footprint

**For EV charging:**
- Use `maxEVSatisfaction` to prioritize vehicle charging

**For critical infrastructure:**
- Use `maxReliability` to ensure backup power
- Use `peakShaving` to reduce demand charges

**For battery health:**
- Use `lifeExtentBESS` to minimize battery degradation
- Best for expensive or hard-to-replace batteries

### Maximize Weighted Power Flow  (`maxWeightPowerFlow`)
Maximize weighted power flows, prioritizing: PV -> Loads -> EVs -> GridService -> BESS -> Grid Import -> V2G