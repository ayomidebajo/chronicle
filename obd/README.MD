# SocketIO server to stream data from OBD-II device

## 1. Start Server
- Create a python virtual environment (optional) and run `python3 -m pip install -r requirements.txt` to install dependencies.
- You can run the server with an OBD-II device or an ELM-327 emulator.

### Run with OBD-II Device
- Connect the OBD-II device to a serial port of the computer's and run `python3 server.py`.

### Run with ELM-327 Emulator
- Run `elm`. Take note of the port the emulator is running on (e.g. `/dev/pts/2`).
- In a different terminal, run `python3 server.py -p {port}` where `port` is the port your emulator is running on (e.g. `python3 server.py -p dev/pts/2`). Make sure your virtual environment is active in both terminals.

## 2. Watch OBD commands
- Connect to the server with a SocketIO client (e.g. `socketio-client`).
- Send a `watch` event with a list of OBD commands to watch. For example, `socket.emit("watch", ["RPM", "SPEED"])`.
- You can define event handlers for the `watch` event too to process data from the OBD-II device.

Tested with Python 3.10.11.