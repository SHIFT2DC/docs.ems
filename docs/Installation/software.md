---
sidebar_position: 2
---

# Software Installation

Follow these steps to install and set up EMS locally.

## Prerequisites

### Software

Before you begin, ensure you have the following installed:

- Node.js v22.12.0 LTS (Versions higher than v22 also can be installed, however the EMS was tested on this specific release of Node.js)
- PostgreSQL v16 (During the installation make sure that PSQL terminal is installed)
- Python v3.12
- Git

### Hardware

EMS can run on any modern computer with at least 8GB of RAM. For long-term use, consider a server with higher specifications. The EMS must be deployed on the machine with Windows 11.

:::info
High amount of RAM is recommended, since the current version of EMS requires Windows 11 on the machine.
:::

## Clone the Repository

Select a folder which will contain all the resources for the EMS. As an example a `1_SHIFT2DC` folder can be created in the following directory: `C:\Users\YOUR_USER\Documents\1_SHIFT2DC`

Open the created folder and right click in the File Explorer to reveal the menu. In the opened menu select `Open in Terminal`

In the opened terminal proceed with the following commands:

```powershell
# Create a "1_EMS" folder
mkdir "1_EMS"
# Create a "1_1_EMS Data" folder
mkdir "1_1_EMS Data"
cd "1_EMS"
git clone https://github.com/SHIFT2DC/EMS4DC.git
cd "EMS4DC"
```

## Install Dependencies

### Web-application dependencies

With the terminal opened in `C:\Users\YOUR_USER\Documents\1_SHIFT2DC\1_EMS\EMS4DC` install needed packages for web-application:

```powershell
# Using npm
cd web-app/frontend/
npm install --verbose
```

:::warning
There is a probability that running scripts on your system is disabled. If such error is encountered then run the following command in the terminal and then enter `Y` to confirm the change:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```
:::

After the packages have been installed it is needed to install additional UI components:

```powershell
npx shadcn@latest add accordion alert badge button calendar card dialog dropdown-menu input label popover progress select separator sheet sidebar skeleton slider table tabs textarea toast tooltip @react-bits/FloatingLines-JS-TW
```

## Configure other dependencies
### Initialize database cluster

Locate where PostgreSQL was installed on the machine. Usually the installation directory is the following: `C:\Program Files\PostgreSQL\16` and copy the path to the `initdb.exe` executable. For example, `C:\Program Files\PostgreSQL\16\bin`

Open a new terminal and proceed with initialization:

```powershell
# Run the initialization of the cluster with your path to initdb.exe
&"<YOUR\PATH\TO\POSTGRE>\initdb.exe" -D "C:\Users\YOUR_USER\Documents\1_SHIFT2DC\1_1_EMS Data" -W
```

The `-W` option will prompt for a password in the terminal. This password must be remembered.

:::info
Make sure to check the installation directory of the PostgreSQL and the path to the `1_1_EMS Data` folder, so that the initialization is done correctly.
:::

Now it is needed to start the PostgreSQL server to create tables for the system. For that, locate the `postgresql.conf` file which should be generated at the cluster initialization and can be found in the `1_1_EMS Data` folder. Open this file with any text editor and locate the line which says `#port = 5432`. Remove the hashtag and adjust the port to the needs. 

Now, start the server with the following command:

```powershell
&"<YOUR\PATH\TO\POSTGRE>\pg_ctl.exe" start -D "<YOUR\PATH\TO\EMS Data>\1_1_EMS Data"
```

#### Creating tables in the database

It is required to create tables in the initialized database cluster.

Open the PSQL terminal, which was installed together with the PostgreSQL. This terminal may be located by default in `C:\Program Files\PostgreSQL\16\scripts\runpsql.bat`

In this terminal connect to the initialized cluster with the correct credentials.

When successfully connected proceed with the following commands in the terminal:

```sql
-- Create a new database:
CREATE DATABASE "ems-db";

-- Connect to the newly created database:
\c "ems-db"

-- Create table for asset_events
CREATE TABLE IF NOT EXISTS asset_events (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,         -- 'created', 'updated', 'deleted'
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE asset_events IS 'Audit trail for all asset-related events (create, update, delete)';

-- Create table for assets
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    asset_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE assets IS 'Stores basic information for all site assets';

-- Create table for measurements:
CREATE TABLE measurements (
    id BIGSERIAL PRIMARY KEY,
    measurement_id INT NOT NULL,
    time TIMESTAMP NOT NULL DEFAULT now(),
    parameter TEXT NOT NULL,       
    value DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,            
    quality TEXT,
    asset_key VARCHAR(50) UNIQUE NOT NULL
);

-- Create table for optimization inputs and outputs:
CREATE TABLE "ems-inputs" (
    id BIGSERIAL PRIMARY KEY,
    input_id INT NOT NULL,
    time TIMESTAMP NOT NULL DEFAULT now(),
    parameter TEXT NOT NULL,       
    value DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,            
    quality TEXT
);

CREATE TABLE "ems-outputs" (
    id BIGSERIAL PRIMARY KEY,
    output_id INT NOT NULL,
    time TIMESTAMP NOT NULL DEFAULT now(),
    parameter TEXT NOT NULL,       
    value DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,            
    quality TEXT
);

CREATE TABLE IF NOT EXISTS forecasts (
    id SERIAL PRIMARY KEY,
    asset_key VARCHAR(50) NOT NULL,
    forecast_timestamp TIMESTAMP NOT NULL,  -- When the forecast was generated
    horizon_timestamp TIMESTAMP NOT NULL,   -- The time point being forecasted
    predicted_power FLOAT NOT NULL,         -- Forecasted power in Watts
    confidence_lower FLOAT,                 -- Lower bound of confidence interval
    confidence_upper FLOAT,                 -- Upper bound of confidence interval
    model_version VARCHAR(50),              -- Model version used for tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_asset FOREIGN KEY (asset_key) 
        REFERENCES assets(asset_key) ON DELETE CASCADE,
    CONSTRAINT unique_forecast UNIQUE (asset_key, forecast_timestamp, horizon_timestamp)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_forecasts_asset_horizon 
    ON forecasts(asset_key, horizon_timestamp);

CREATE INDEX IF NOT EXISTS idx_forecasts_timestamp 
    ON forecasts(forecast_timestamp);

-- Table to track model metadata and training history
CREATE TABLE IF NOT EXISTS model_metadata (
    id SERIAL PRIMARY KEY,
    asset_key VARCHAR(50) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    training_start_date TIMESTAMP NOT NULL,
    training_end_date TIMESTAMP NOT NULL,
    samples_count INTEGER NOT NULL,
    model_type VARCHAR(50) NOT NULL,       -- e.g., 'ARIMA', 'Prophet', 'LSTM'
    model_params JSONB,                     -- Store hyperparameters
    performance_metrics JSONB,              -- MAE, RMSE, etc.
    is_active BOOLEAN DEFAULT TRUE,
    trained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_model_asset FOREIGN KEY (asset_key) 
        REFERENCES assets(asset_key) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_model_metadata_asset 
    ON model_metadata(asset_key, is_active);

-- Table to track data quality and readiness for forecasting
CREATE TABLE IF NOT EXISTS forecast_readiness (
    id SERIAL PRIMARY KEY,
    asset_key VARCHAR(50) UNIQUE NOT NULL,
    total_samples INTEGER DEFAULT 0,
    first_measurement TIMESTAMP,
    last_measurement TIMESTAMP,
    data_coverage_pct FLOAT,               -- Percentage of expected data points present
    min_samples_required INTEGER DEFAULT 672,
    is_ready_for_forecast BOOLEAN DEFAULT FALSE,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_readiness_asset FOREIGN KEY (asset_key) 
        REFERENCES assets(asset_key) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_readiness_ready 
    ON forecast_readiness(is_ready_for_forecast);

COMMENT ON TABLE forecasts IS 'Stores the latest 12-hour power forecasts for all active assets';
COMMENT ON TABLE model_metadata IS 'Tracks trained models and their performance metrics';
COMMENT ON TABLE forecast_readiness IS 'Monitors whether assets have sufficient data for forecasting';

-- Main metrics summary table
CREATE TABLE IF NOT EXISTS metrics_summary (
        id SERIAL PRIMARY KEY,
        period_start TIMESTAMP NOT NULL,
        period_end TIMESTAMP NOT NULL,
        calculation_time TIMESTAMP NOT NULL,
        metric_category VARCHAR(50) NOT NULL,
        metrics_json JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(period_start, period_end, metric_category)
    );
    
    CREATE INDEX IF NOT EXISTS idx_metrics_summary_period 
    ON metrics_summary(period_start, period_end);
    
    CREATE INDEX IF NOT EXISTS idx_metrics_summary_category 
    ON metrics_summary(metric_category);

-- Asset-specific metrics table
CREATE TABLE IF NOT EXISTS asset_metrics (
        id SERIAL PRIMARY KEY,
        period_start TIMESTAMP NOT NULL,
        period_end TIMESTAMP NOT NULL,
        asset_key VARCHAR(50) NOT NULL,
        asset_type VARCHAR(50) NOT NULL,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DOUBLE PRECISION,
        metric_unit VARCHAR(20),
        calculation_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(period_start, period_end, asset_key, metric_name)
    );
    
    CREATE INDEX IF NOT EXISTS idx_asset_metrics_period 
    ON asset_metrics(period_start, period_end);
    
    CREATE INDEX IF NOT EXISTS idx_asset_metrics_asset 
    ON asset_metrics(asset_key);

-- Time-series aggregated metrics
CREATE TABLE IF NOT EXISTS metrics_timeseries (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP NOT NULL,
        asset_key VARCHAR(50),
        parameter VARCHAR(100) NOT NULL,
        aggregated_value DOUBLE PRECISION,
        aggregation_type VARCHAR(20) NOT NULL,
        aggregation_interval VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(timestamp, asset_key, parameter, aggregation_type, aggregation_interval)
    );
    
    CREATE INDEX IF NOT EXISTS idx_metrics_timeseries_timestamp 
    ON metrics_timeseries(timestamp);
    
    CREATE INDEX IF NOT EXISTS idx_metrics_timeseries_asset_param 
    ON metrics_timeseries(asset_key, parameter);

-- Users table
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(100) UNIQUE NOT NULL,
  password    TEXT NOT NULL,               -- bcrypt hash
  role        VARCHAR(20) NOT NULL DEFAULT 'guest'
                CHECK (role IN ('maintainer', 'guest')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Session store (used by connect-pg-simple)
CREATE TABLE session (
  sid    VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
  sess   JSON    NOT NULL,
  expire TIMESTAMPTZ NOT NULL
);
CREATE INDEX ON session (expire);

-- Seed a first maintainer account
INSERT INTO users (username, password, role)
VALUES ('admin', '$2b$12$KyMHN3/33VrD1hiieGV7juJUiG5XBi1.d354cK4Lw2mitpVEvK/t.', 'maintainer');

# Exit when done:
\q
```

After this, the terminal can be closed.

### `.env` environment variables configuration

:::warning
Make sure to copy the environment variables from `.env.example` to `.env` before running the application.
:::

Those `.env` files can be found in `EMS4DC/web-app/frontend/.env.example` and `EMS4DC/web-app/backend/.env.example`

#### How to configure `VITE_BASE_URL` in `EMS4DC/web-app/frontend/.env`

The `VITE_BASE_URL` variable defines where the backend server is hosted. If the backend server is hosted locally then the variable should be set to `http://localhost:3001`

### Python virtual environment set up

With terminal navigate to the `EMS4DC/core` folder

Validate what versions of Python are installed on the machine and create a Python virtual environment:

```powershell
# List available Python Versions
py -0

# Create virtual environment with 3.12 version
py -3.12 -m venv core-venv

# Activate the virtual environment
core-venv\Scripts\activate

# Install needed packages:
py -m pip install -r requirements.txt

# Deactivate virtual environment
deactivate
```