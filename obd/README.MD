# HTTP AND SOCKETIO SERVERS TO READ DATA FROM OBD-II DEVICE
This project comprises two python scripts: 
- one creates an http server to read data from an OBD-II device,
- the other creates a SocketIO server to stream data from an OBD-II device.
You can use either of them as your lordship pleases.

## HTTP server to read data from OBD-II device (guide to run script)
### 1. Start Server
- Open `commands_to_watch.py` and edit the list to include the obd commands you'd like to watch. <i>I prefer this approach to specifying commands as http query parameters so I can asynchronously fetch the commands and serve your GET requests instantly.</i>
- Create a python virtual environment (optional) and run `python3 -m pip install -r requirements.txt` to install dependencies.
- You can run the server with an OBD-II device or an ELM-327 emulator.

#### Run with OBD-II Device
- Connect the OBD-II device to a serial port of the computer's and run `python3 http_server.py`.

#### Run with ELM-327 Emulator
- Run `elm`. Take note of the port the emulator is running on (e.g. `/dev/pts/2`).
- In a different terminal, run `python3 http_server.py -p {port}` where `port` is the port your emulator is running on (e.g. `python3 http_server.py -p /dev/pts/2`). Make sure your virtual environment is active in both terminals.

### 2. Request for OBD data
- Send a GET request to the server.


## SocketIO server to stream data from OBD-II device (guide to run script)

### 1. Start Server
- Create a python virtual environment (optional) and run `python3 -m pip install -r requirements.txt` to install dependencies.
- You can run the server with an OBD-II device or an ELM-327 emulator.

#### Run with OBD-II Device
- Connect the OBD-II device to a serial port of the computer's and run `python3 socketio_server.py`.

#### Run with ELM-327 Emulator
- Run `elm`. Take note of the port the emulator is running on (e.g. `/dev/pts/2`).
- In a different terminal, run `python3 socketio_server.py -p {port}` where `port` is the port your emulator is running on (e.g. `python3 socketio_server.py -p dev/pts/2`). Make sure your virtual environment is active in both terminals.

### 2. Watch OBD commands
- Connect to the server with a SocketIO client (e.g. `socketio-client`).
- Send a `watch` event with a list of OBD commands to watch. For example, `socket.emit("watch", ["RPM", "SPEED"])`.
- You can define event handlers for the `watch` event too to process data from the OBD-II device.

<b>Tested with Python 3.10.11.</b>