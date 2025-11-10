---
sidebar_position: 2
---

# Installation

Follow these steps to install and set up EMS locally.

## Prerequisites

### Software

Before you begin, ensure you have the following installed:

- Node.js v22.12.0 LTS (Versions higher than v22 also can be installed, however the EMS was tested on this specific release of Node.js)
- PostgreSQL v16 (During the installation make sure that PSQL terminal is installed)
- Python v3.12 (This exact release of Python is needed because of the availability of CPLEX Python package for optimization)
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

```bash
# Create a "1_EMS" folder
mkdir "1_EMS"
# Create a "1_1_EMS Data" folder
mkdir "1_1_EMS Data"
cd "1_EMS"
git clone https://github.com/SHIFT2DC/EMS.git
cd "EMS4DC"
```

## Install Dependencies

### Web-application dependencies

With the terminal opened in `C:\Users\YOUR_USER\Documents\1_SHIFT2DC\1_EMS\EMS4DC` install needed packages for web-application:

```bash
# Using npm
cd web-app/frontend/
npm install --verbose
```

:::warning
There is a probability that running scripts on your system is disabled. If such error is encountered then run the following command in the terminal and then enter `Y` to confirm the change:

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```
:::

## Configure other dependencies

### `.env` environment variables configuration

:::warning
Make sure to copy the environment variables from `.env.example` to `.env` before running the application.
:::

Those `.env` files can be found in `EMS4DC/web-app/frontend/.env` and `EMS4DC/web-app/backend/.env`

#### How to configure `VITE_BASE_URL` in `EMS4DC/web-app/frontend/.env`

The `VITE_BASE_URL` variable defines where the backend server is hosted. If the backend server is hosted locally then the variable should be set to `http://localhost:3001`

### Python virtual environment set up

With terminal navigate to the `EMS4DC/system-coordination` folder

Validate what version of Python are installed on the machine and create a Python virtual environment:

```bash
# List available Python Versions
py -0

# Create virtual environment with 3.12 version
py -3.12 -m venv sys-coord

# Install needed packages:
py -m pip install -r requirements.txt
```

You can validate whether the virtual environment set up was Initialized correctly:

```bash
# Activate
sys-coord\Scripts\activate

# Verify 3.12 version is active
python --version
```

### Initialize database cluster

Locate where PostgreSQL was installed on the machine. Usually the installation directory is the following: `C:\Program Files\PostgreSQL\16`

Open a new terminal and proceed with initialization:

```bash
# Run the initialization of the cluster
&"C:\Program Files\PostgreSQL\16\bin\initdb.exe" -D "C:\Users\YOUR_USER\Documents\1_SHIFT2DC\1_1_EMS Data"
```

:::info
Make sure to check the installation directory of the PostgreSQL and the path to the `1_1_EMS Data` folder, so that the initialization is done correctly.
:::

:::warning
Make sure to create a password for the database and then pass this password into the `EMS4DC/web-app/backend/.env`
:::

#### Creating tables in the database

It is required to create tables in the initialized database cluster.

Open the PSQL terminal, which was installed together with the PostgreSQL. This terminal may be located by default in `C:\Program Files\PostgreSQL\17\scripts\runpsql.bat`

In this terminal connect to the initialized cluster with the correct credentials.

When successfully connected proceed with the following commands in the terminal:

```sql
# Create a new database:
CREATE DATABASE "ems-db";

# Connect to the newly created database:
\c "ems-db"

# Create table for measurements:
CREATE TABLE measurements (
    id BIGSERIAL PRIMARY KEY,
    measurement_id INT NOT NULL,
    time TIMESTAMP NOT NULL DEFAULT now(),
    parameter TEXT NOT NULL,       
    value DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,            
    quality TEXT
);

# Create table for optimization inputs and outputs:
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

# Exit when done:
\q
```