---
sidebar_position: 3
---

# Starting the application

After all dependencies are installed and configured there are several small steps left to make the EMS running.

## Configure EMS launcher

The launcher (`EMS4DC/ems-launcher.bat`) needs to be updated with the proper directories

Open `ems-launcher.bat` with Notepad or any other text editor. Locate the following lines:

```batch
:: Start PostgreSQL
echo %BOLD%%BLUE%[1/4] Starting PostgreSQL server...%RESET%
start "PostgreSQL Server" cmd /k "echo %MAGENTA%PostgreSQL Server%RESET% && pg_ctl.exe start -D "C:\Users\YOUR_USER\Documents\1_SHIFT2DC\1_1_EMS Data" && echo %GREEN%PostgreSQL started successfully!%RESET%"
timeout /t 3 /nobreak >nul
```

Modify the `"C:\Users\YOUR_USER\Documents\1_SHIFT2DC\1_1_EMS Data"` directory to match your set up.


## Launching the EMS4DC

If everything was configured properly the EMS can be launched via the `ems-launcher.bat` by double-clicking the file.

The launcher should verify if all prerequisites were installed and then it will open 4 terminals:

- PostgreSQL Server
- Backend Server - node server
- Python Coordinator
- Frontend Server

When all 4 terminal are started, the EMS should be available in the browser at `http://localhost:5173`

:::warning
If the launcher gives the error that `ERROR: pg_ctl.exe not found in PATH`, then it is needed to add PostgreSQL installation path to the `Path` environment variable.
:::