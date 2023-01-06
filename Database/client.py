import socket

HOST = "127.0.0.1"  # The server's hostname or IP address
PORT = 65432  # The port used by the server

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    query = ("SELECT id_gare name nb_voie id_voyage FROM gare.db JOIN voyage.db train.db ON id_gare=gare_depart id_voyage=voyage WHERE id_train=1 AND nb_voie>1").encode('UTF-8')
    print("client send : ",query.decode('UTF-8'))
    s.sendall(query)
    data = s.recv(1024)
    print("client received : ",data.decode('UTF-8'))
