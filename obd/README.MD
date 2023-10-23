# SocketIO server that exposes an OBD-II device's API.

## How to Run
- Create a python virtual environment (optional) and run `python3 -m pip install -r requirements.txt` to install dependencies.

### Run with OBD-II Device
- Connect the OBD-II device to a serial port of the computer's and run `python3 server.py`.

### Run with ELM-327 Emulator
- Run `elm`. Take note of the port the emulator is running on (e.g. `/dev/pts/2`).
- In a different terminal, run `python3 server.py -p {port}` where `port` is the port your emulator is running on (e.g. `python3 server.py -p dev/pts/2`). Make sure your virtual environment is active in both terminals.


Tested with Python 3.10.11.