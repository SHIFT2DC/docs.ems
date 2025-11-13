---
sidebar_position: 4
---

# System Architecture

The EMS4DC system comprises four core components that work together to provide energy management and monitoring capabilities.

## Core Components

**PostgreSQL Database Cluster**

The database cluster runs continuously in the background, serving as the central data repository for real-time measurement data from connected devices, optimizer engine input parameters, and optimizer engine output results.

**Python Coordinator**

A continuous Python script that orchestrates two critical daemonized processes:
- Data Acquisition Process: Executes every 10 seconds to collect real-time measurements from energy assets
- Optimizer Trigger: Runs every 15 minutes to perform energy optimization calculations

**Backend Server (Express.js)**

Provides RESTful API endpoints that process and serve data to the frontend application, handling requests for all application features and tabs.

**Frontend Server (Vite)**

Delivers the SCADA (Supervisory Control and Data Acquisition) interface, providing users with real-time visualization and control capabilities through a modern web application.

---

## Application Interface

The EMS4DC web application features eight specialized tabs, each designed for specific monitoring and configuration tasks.

**Home**

Displays a high-level system overview with real-time power flow visualization, providing operators with an at-a-glance understanding of the system's current state.

**Charts**

Enables users to query and visualize historical power data for all connected energy assets. Users can select specific date ranges to analyze trends and performance over time.

**EMS**

Presents comprehensive charts showing both optimizer inputs and outputs, allowing users to understand the optimization process and verify system behavior.

**Devices**

Provides dedicated pages for each connected device, displaying detailed measurements and operational parameters for individual energy assets.

**Droop**

Visualizes generated droop curves for applicable assets. The droop curve midpoint is automatically adjusted every 15 minutes based on optimizer output, ensuring optimal power distribution.

**Server Info**

Displays diagnostic information about the host machine running the EMS4DC application, including system resources and performance metrics.

**Site Config**

Allows administrators to configure operational parameters for energy assets, including constraint definitions (e.g., maximum voltage thresholds), asset-specific operating limits, and performance parameters.

**Modbus Config**

Provides tools to configure Modbus communication settings for connected devices, ensuring reliable data exchange between the EMS and energy assets.