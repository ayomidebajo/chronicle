import obdio
import obd
import argparse
import asyncio


def start_obd_socket_io_server(obd_port: str = None) -> None:
    io = obdio.OBDio()
    io.connect_obd(obd_port)
    sio = io.create_server(json=obdio)

    @sio.event
    async def watch(sid, commands):
        """OBDio watch."""
        data = {}
        io.connection.stop()
        for cmd in commands:
            io.connection.watch(obd.commands[cmd])
        io.connection.start()
        
        while True:
            for cmd in commands:
                response = io.connection.query(obd.commands[cmd])
                data[cmd] = response
            await sio.emit("watch", data, room=sid)
            await asyncio.sleep(1)

    io.run_server()


def get_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--port", type=str, default=None, help="OBD port")
    args = parser.parse_args()
    return args


def main() -> None:
    args = get_args()
    obd_port = args.port

    start_obd_socket_io_server(obd_port=obd_port)


if __name__ == "__main__":
    main()