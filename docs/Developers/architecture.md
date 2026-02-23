---
sidebar_position: 4
---

# System Architecture

The high level software architecture of the EMS4DC is depicted on the following figure:

![](/img/high-level-soft-architecture.jpg)

## Core Components

**PostgreSQL Database Cluster**

The database cluster runs continuously in the background, serving as the central data repository for real-time measurement data from connected devices, optimizer engine input parameters, and optimizer engine output results.

**Python Stack**

A Python stack consists of four continous scripts running in parallel:
- Data Acquisition Process `measure.py`: Executes every 10 seconds to collect real-time measurements from energy assets
- Optimizer Trigger `optimizer.py`: Runs every 15 minutes to perform energy optimization calculations
- Metrics Calculation Process `metrics.py`: Runs every hour to calculate metrics and KPIs for the passed hour
- Forecasting Module `forecast.py`: Runs a forecast generation, handles model retraining.

**Backend Server (Express.js)**

Provides RESTful API endpoints that process and serve data to the frontend application, handling requests for all application features and tabs.

**Frontend Server (Vite)**

Delivers the SCADA (Supervisory Control and Data Acquisition) interface, providing users with real-time visualization and control capabilities through a modern web application.

---