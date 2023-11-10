import obd
from encoders import CustomOBDEncoder
import argparse
import json
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

from commands_to_watch import COMMANDS_TO_WATCH


def start_obd_http_server(obd_port: str = None, commands=COMMANDS_TO_WATCH) -> None:
    connection = obd.Async(obd_port)
    for cmd in commands:
        connection.watch(obd.commands[cmd])
    connection.start()

    class OBDHTTPRequestHandler(BaseHTTPRequestHandler):

        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', '*')
            self.send_header('Access-Control-Allow-Headers', '*')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            return super().end_headers()

        def do_OPTIONS(self):
            self.send_response(200)
            self.end_headers()

        def do_GET(self):
            data = {}
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            for cmd in commands:
                data[cmd] = connection.query(obd.commands[cmd])
            self.wfile.write(json.dumps(data, cls=CustomOBDEncoder).encode())

    httpd = ThreadingHTTPServer(("", 8000), OBDHTTPRequestHandler)
    print("HTTP Server started at http://127.0.0.1:8000/")
    httpd.serve_forever()


def get_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--port", type=str, default=None, help="OBD port")
    args = parser.parse_args()
    return args


def main() -> None:
    args = get_args()
    obd_port = args.port

    start_obd_http_server(obd_port=obd_port)


if __name__ == "__main__":
    main()
