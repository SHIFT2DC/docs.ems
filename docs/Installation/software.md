---
sidebar_position: 2
---

# Software Installation

Follow these steps to install and set up EMS locally.

## Install EMS on Windows 11

### Hardware

EMS can run on any modern computer with at least 8GB of RAM. For long-term use, consider a server with higher specifications. The EMS4DC can be deployed on the machine with Windows 11.

### Software

Before you begin, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 
- [Windows Subsystem Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
- [Git](https://git-scm.com/install/)
- [Visual Studio Code integrated development environment (IDE)](https://code.visualstudio.com/) 
- [Node.js](https://nodejs.org/en/download)

### Clone the Repository

The repository can be cloned either by downloading the source code from the [EMS4DC Github Page](https://github.com/SHIFT2DC/EMS4DC.git) or by terminal cloning by following the following instructions:

Select a folder which will contain all the resources for the EMS. As an example a `1_SHIFT2DC` folder can be created in the following directory: `C:\Users\YOUR_USER\Documents\1_SHIFT2DC`

Open the created folder and right click in the File Explorer to reveal the menu. In the opened menu select `Open in Terminal`

In the opened terminal proceed with the following commands:

```powershell
# Create a "1_EMS" folder
mkdir "1_EMS"
cd "1_EMS"
git clone https://github.com/SHIFT2DC/EMS4DC.git
cd "EMS4DC"
```

### `.env` environment variables configuration

:::warning
Make sure to copy the environment variables from `.env.example` to `.env` before building and running the EMS.
:::

The `.env.example` file can be found in `EMS4DC/conf/.env.example`.

#### Individual variables configuration

Variables `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT` define variables for PostgreSQL database connection. Since, the PostgreSQL database is also containerized, the `DB_HOST` must be left specified as `"postgres"`.

The `SESSION_SECRET` must be some very long string consisting of different symbols, letters and numbers. 

The `VITE_BASE_URL` variable defines where the backend server is hosted. If the backend server is hosted locally then the variable should be set to `http://localhost:3001`

The `FRONTEND_IP` defines the frontend address. In case of local hosting leave it as `http://localhost:5173`

The `MODBUS_API_URL` declares the API URL for modbus API. The port `5050` must be specified according to the exposed port declared in `docker-compose.yml` (More about this file in the next section).

The `TIMEZONE` is needed to be defined according to the place of installation of the EMS4DC.

### Docker Compose Configuration

Before building and launching the EMS4DC multiple variables need to be configured in the `EMS4DC/docker-compose.yml` file. 

Provide own and strong password for database and the corresponding user at:

```docker
services:
    postgres:
        environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: your_secure_password
        ports:
            - "5432:5432"
```

Moreover, the exposed port for `postgres` service can be changed, but it is needed to make sure that the `DB_PORT` variable in `EMS4DC/conf/.env` receives the same value.

Frontend and backend services require proxy configuration to properly pull and install dependencies. It can be done via:

```docker
backend:
    build:
        context: ./web-app/backend
        dockerfile: Dockerfile
        args:
            HTTP_PROXY: "http://proxy.your-company.com:8080"
            HTTPS_PROXY: "http://proxy.your-company.com:8080"

frontend:
    build:
        context: ./web-app/frontend
        dockerfile: Dockerfile
        args:
            HTTP_PROXY: "http://proxy.your-company.com:8080"
            HTTPS_PROXY: "http://proxy.your-company.com:8080"
```
However, if the hosting machine is not connected to protected network the proxy arguments can be commented out.

Finally, the port for Modbus API must be configured and it needs to be ensured that the port specified in the `docker-compose.yml` is the same as in `MODBUS_API_URL` at `EMS4DC/conf/.env`.

After all the configurations are done the EMS4DC it is needed to open terminal in the core directory of the repository, i.e. `/EMS4DC/` and perform the following commands:

```powershell
# install remaining dependencies
cd web-app/frontend
npx shadcn@latest add accordion alert badge button calendar card dialog dropdown-menu input label popover progress select separator sheet sidebar skeleton slider table tabs textarea toast tooltip
```

```powershell
# go back to /EMS4DC/ 
cd ../..

# Build the application:
docker compose build

# Launch the containers
docker compose up -d
```

When the build and launch are successfull the EMS4DC can be accessed via browser at the `FRONTEND_IP` address.
Then it is needed to follow steps from [First Steps](https://shift2dc.github.io/docs.ems/Usage/first_steps) to continue setting up EMS4DC. 

## Install EMS on Linux

### Software

In order to be able to run Docker containers of EMS4DC it is needed to install 64-bit OS on the host machine.

It will be needed to install Docker Engine on the host machine. The documentation installation for Debian is [here](https://docs.docker.com/engine/install/debian/).

Then it is needed to copy the EMS4DC repository to the machine:

```bash
git clone https://github.com/SHIFT2DC/EMS4DC.git
cd "EMS4DC"
```

Addittionaly, it is needed to install [Node.js](https://nodejs.org/en/download).

### `.env` environment variables configuration

:::warning
Make sure to copy the environment variables from `.env.example` to `.env` before building and running the EMS.
:::

The `.env.example` file can be found in `EMS4DC/conf/.env.example`.

#### Individual variables configuration

Variables `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT` define variables for PostgreSQL database connection. Since, the PostgreSQL database is also containerized, the `DB_HOST` must be left specified as `"postgres"`.

The `SESSION_SECRET` must be some very long string consisting of different symbols, letters and numbers. 

The `VITE_BASE_URL` variable defines where the backend server is hosted. If the backend server is hosted locally then the variable should be set to `http://localhost:3001`

The `FRONTEND_IP` defines the frontend address. In case of local hosting leave it as `http://localhost:5173`

The `MODBUS_API_URL` declares the API URL for modbus API. The port `5050` must be specified according to the exposed port declared in `docker-compose.yml` (More about this file in the next section).

The `TIMEZONE` is needed to be defined according to the place of installation of the EMS4DC.

### Docker Compose Configuration

Before building and launching the EMS4DC multiple variables need to be configured in the `EMS4DC/docker-compose.yml` file. 

Provide own and strong password for database and the corresponding user at:

```docker
services:
    postgres:
        environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: your_secure_password
        ports:
            - "5432:5432"
```

Moreover, the exposed port for `postgres` service can be changed, but it is needed to make sure that the `DB_PORT` variable in `EMS4DC/conf/.env` receives the same value.

Frontend and backend services require proxy configuration to properly pull and install dependencies. It can be done via:

```docker
backend:
    build:
        context: ./web-app/backend
        dockerfile: Dockerfile
        args:
            HTTP_PROXY: "http://proxy.your-company.com:8080"
            HTTPS_PROXY: "http://proxy.your-company.com:8080"

frontend:
    build:
        context: ./web-app/frontend
        dockerfile: Dockerfile
        args:
            HTTP_PROXY: "http://proxy.your-company.com:8080"
            HTTPS_PROXY: "http://proxy.your-company.com:8080"
```
However, if the hosting machine is not connected to protected network the proxy arguments can be commented out.

Finally, the port for Modbus API must be configured and it needs to be ensured that the port specified in the `docker-compose.yml` is the same as in `MODBUS_API_URL` at `EMS4DC/conf/.env`.

After all the configurations are done the EMS4DC it is needed to open terminal in the core directory of the repository, i.e. `/EMS4DC/` and perform the following commands:

```bash
# install remaining dependencies
cd web-app/frontend
npx shadcn@latest add accordion alert badge button calendar card dialog dropdown-menu input label popover progress select separator sheet sidebar skeleton slider table tabs textarea toast tooltip
```

```bash
# go back to /EMS4DC/ 
cd ../..

# Build the application:
sudo docker compose build

# Launch the containers
sudo docker compose up -d
```

When the build and launch are successfull the EMS4DC can be accessed via browser at the `FRONTEND_IP` address.
Then it is needed to follow steps from [First Steps](https://shift2dc.github.io/docs.ems/Usage/first_steps) to continue setting up EMS4DC. 