import socket
from fastapi import FastAPI
import json
app = FastAPI()

##pour lancer le serveur : uvicorn backend:app --reload

def parse(data):
    # Load the JSON string
    # json_string = '{"id_gare": ["2", "2"], "planetedepart": ["2", "2"], "nb_voie": ["nom2", "nom2"], "id_voyage": ["2", "4"]}'
    data = json.loads(data)

    # Create a new list to store the parsed data
    parsed_data = []
    # Iterate over each element in the "id_gare" list
    for i in range(len(data["id_gare"])):
        obj = {}
        # Create a new JSON object with the current values
        for key in data.keys():
            obj[key] = [data[key][i]]
        # Add the object to the parsed data list
        parsed_data.append(obj)

    # Print the parsed data
    print(parsed_data)
    return parsed_data

@app.get("/")
def get_data():

    HOST = "127.0.0.1"  # The server's hostname or IP address
    PORT = 65432  # The port used by the server
    results = b''
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall("SELECT id_gare name nb_voie id_voyage FROM gare.db JOIN voyage.db train.db ON id_gare=gare_depart id_voyage=voyage WHERE id_train=1 AND nb_voie>1".encode('UTF-8'))
        data = s2.recv(1024)
        print(f"server Received from DB {results!r}")
        return parse(data)

#     string = "SELECT infos1 infos2 infos3 FROM voyage.db JOIN train.db gare.db ON depart=id_train id_train=id_gare                WHERE condi1=1 OR condi2=1 OR condi3=1"
#     string2 = "INSERT id_voyage=5 nom_voyage=lol type=1 depart=1 arrive=1 voie=9 id_train=2 TO voyage.db"
#     string3 = "UPDATE voyage.db SET column1=value1 column2=value2 WHERE id=1"
#     string4 = "DELETE FROM voyage.db WHERE column3=1"
#     send(string)
#     send(string2)
#     send(string3)
#     send(string4)