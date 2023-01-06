import socket


def send(string): #initialisation
    HOST = "127.0.0.2"  # The server's hostname or IP address
    PORT = 65433  # The port used by the server

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall(string.encode('UTF-8'))
        data = s.recv(1024)
        print(f"Received {data!r}")

if __name__ == "__main__":
    string = "SELECT id_gare name nb_voie id_voyage FROM gare.db JOIN voyage.db train.db ON id_gare=gare_depart id_voyage=voyage WHERE id_train=1 AND nb_voie>1"
    string2 = "INSERT id_voyage=5 nom_voyage=lol type=1 depart=1 arrive=1 voie=9 id_train=2 TO voyage.db"
    string3 = "UPDATE voyage.db SET column1=value1 column2=value2 WHERE id=1"
    string4 = "DELETE FROM voyage.db WHERE column3=1"
    string5 = "SELECT infos1 infos2 infos3 FROM voyage.db JOIN train.db gare.db ON depart=id_train id_train=id_gare WHERE condi1=1 OR condi2=1 OR condi3=1"
    send(string)
    # send(string2)
    # send(string3)
    # send(string4)
    # send(string5)
    #seul la première requète fonctionne sur la dernière version