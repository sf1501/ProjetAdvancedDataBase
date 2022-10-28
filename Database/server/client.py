import socket

HOST = "127.0.0.1"  # The server's hostname or IP address
PORT = 65432  # The port used by the server

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    query = ("Query").encode('UTF-8')
    print("client send : ",query.decode('UTF-8'))
    s.sendall(query)
    data = s.recv(1024)
    print("client received : ",data.decode('UTF-8'))
