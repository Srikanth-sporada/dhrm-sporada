::@echo off
::title Angular Auto-Starter

:: 1. Navigate to your project folder
:: REPLACE the path below with your actual project location
::cd /d "E:\rane-group\rane v2\rane-group\dhrm-sporada\dhrm_sporada_V1.0"

::echo Starting Angular  Server...

:: 2. Run the npm start command in a new window
:: This keeps the server running even if this script closes
::tart cmd /k "bun dev"

::echo.
::echo Angular is warming up! You can close this window.
::imeout /t 5
::exit

@echo off
title launching VS Code Project

:: 1. Set your project path
set PROJECT_PATH="E:\rane-group\rane v2\rane-group\dhrm-sporada\dhrm_sporada_V1.0"

:: 2. Open VS Code in that folder
:: The 'code' command must be in your System PATH (usually is by default)
call code %PROJECT_PATH%

:: 3. Give VS Code a few seconds to load before sending commands
timeout /t 5

:: 4. Re-open the folder and execute a command in the terminal
:: This uses the --command flag to run the 'workbench.action.terminal.sendSequence'
code --command "workbench.action.terminal.sendSequence" --args "{\"text\": \"bun dev\u000d\"}" %PROJECT_PATH%

exit