---
sidebar_position: 3
---

# Power Forecasting

A comprehensive forecasting that generates 12-hour power forecasts for various assets including PV, BESS, loads, EV chargers, and wind generators.

## Features

- **Automated Forecast Generation**: Generate 12-hour power forecasts every 1-2 hours
- **Hourly Forecasts**: Generates forecasts at rounded hours (10:00, 11:00, 12:00, etc.)
- **Data Validation**: Automatically check which devices have sufficient historical data
- **Multiple Model Types**: Support for Prophet, Moving Average, and Persistence models
- **Intelligent Retraining**: Periodic model retraining as more data becomes available
- **Database-Centric**: Store latest forecasts in PostgreSQL
- **Asset Type Aware**: Tailored forecasting approaches for different asset types

## Asset Types and Requirements

### Minimum Data Requirements

Different asset types have different minimum data requirements before forecast can be generated:

| Asset Type | Minimum Samples (Hourly) | Days | Notes |
|-----------|--------------------------|------|-------|
| PV | 168 | 7 days | Strong daily seasonality |
| WIND | 168 | 7 days | Weather-dependent patterns |
| BESS | 168 | 7 days | Charge/discharge cycles |
| AFE | 168 | 7 days | Grid interaction patterns |
| LOAD | 336 | 14 days | Variable usage patterns |
| CRITICAL_LOAD | 336 | 14 days | More stable than regular load |
| UNI_EV | 336 | 14 days | Charging patterns vary by day |
| BI_EV (V2G) | 336 | 14 days | Complex V2G patterns |

### Model Selection

The system automatically selects the best model type for each asset:

- **PV, WIND**: Prophet (strong seasonal patterns) or Moving Average fallback
- **BESS, LOAD, EV**: Moving Average (pattern-based)
- **Others**: Moving Average

## Model Retraining Strategy

### Automatic Retraining Triggers

Models are retrained when:

1. **High Priority** (immediate):
   - More than 7 days since last training
   - More than 1,000 new data points

2. **Medium Priority** (soon):
   - More than 3 days since last training
   - More than 500 new data points

3. **Low Priority** (when convenient):
   - More than 1 day since last training
   - More than 100 new data points

### Minimum Retraining Interval

- Models are not retrained more frequently than once per 24 hours
- This prevents excessive computation and allows data to accumulate
