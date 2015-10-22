import SimpleHTTPServer
import SocketServer
import os

PORT = 8083


def serve():
    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    httpd = SocketServer.TCPServer(("", PORT), Handler)
    print "serving at port", PORT
    httpd.serve_forever()


def serve_subdirectory(directory, port=PORT):
    os.chdir(directory)
    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    httpd = SocketServer.TCPServer(("", port), Handler)
    print "serving at port", port, ", directory: ", directory
    httpd.serve_forever()

serve()
#serve()