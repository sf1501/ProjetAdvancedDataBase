import socket


def send(string): #initialisation
    HOST = "127.0.0.1"  # The server's hostname or IP address
    PORT = 65432  # The port used by the server

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(string.encode('UTF-8'))
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return data

def main():

    HOST = "127.0.0.2"  # Standard loopback interface address (localhost)
    PORT = 65433  # Port to listen on (non-privileged ports are > 1023)

    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind((HOST, PORT))
            s.listen()
            conn, addr = s.accept()
            with conn:
                print(f"Connected by {addr}")
                while True:
                    data = conn.recv(1024)
                    if not data:
                        break
                    print("Server received from front : ",data.decode('UTF-8'))
                    answer = send(data.decode('UTF-8'))
                    print("Server send to front : ",answer)
                    conn.sendall(answer)
            conn.close()

if __name__ == "__main__":
    main()

# if __name__ == "__main__":
#     string = "SELECT infos1 infos2 infos3 FROM voyage.db JOIN train.db gare.db ON depart=id_train id_train=id_gare                WHERE condi1=1 OR condi2=1 OR condi3=1"
#     string2 = "INSERT id_voyage=5 nom_voyage=lol type=1 depart=1 arrive=1 voie=9 id_train=2 TO voyage.db"
#     string3 = "UPDATE voyage.db SET column1=value1 column2=value2 WHERE id=1"
#     string4 = "DELETE FROM voyage.db WHERE column3=1"
#     send(string)
#     send(string2)
#     send(string3)
#     send(string4)