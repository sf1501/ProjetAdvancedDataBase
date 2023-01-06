import socket
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
app = FastAPI()

# pour lancer le serveur : uvicorn back:app --reload
HOST = "127.0.0.1"  # The server's hostname or IP address
PORT = 65432  # The port used by the server


def parse(data):
    # Load the JSON string
    # json_string = '{"id_gare": ["2", "2"], "planetedepart": ["2", "2"], "nb_voie": ["nom2", "nom2"], "id_voyage": ["2", "4"]}'
    data = json.loads(data)

    # Create a new list to store the parsed data
    parsed_data = []
    # Iterate over each element in the "id_gare" list
    for i in range(len(data[next(iter(data))])):
        obj = {}
        # Create a new JSON object with the current values
        for key in data.keys():
            obj[key] = data[key][i]
        # Add the object to the parsed data list
        parsed_data.append(obj)

    # Print the parsed data
    print(f"\n data parsed : {parsed_data!r}")
    return parsed_data


origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def get_data():
    # Construct the SELECT statement
    statement = f"SELECT id_train name_train capacite voyage FROM train.db"
    # Encode the statement as a UTF-8 byte string
    statement_bytes = statement.encode('UTF-8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return parse(data)


@app.get("/train/")
def get_train():
    # Construct the SELECT statement
    statement = f"SELECT id_train name_train capacite voyage FROM train.db"
    # Encode the statement as a UTF-8 byte string
    statement_bytes = statement.encode('UTF-8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return parse(data)


@app.get("/train/{idTrain}/")
def get_train(idTrain: int):
    id_train_str = str(idTrain)  # Convert the value of id_train to a string
    # Construct the SELECT statement
    statement = f"SELECT id_train name capacite id_voyage FROM train.db WHERE id_train={id_train_str}"
    # Encode the statement as a UTF-8 byte string
    statement_bytes = statement.encode('UTF-8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return parse(data)


@app.get("/gare/")
def get_gare():
    # Construct the SELECT statement
    statement = f"SELECT id_gare name nb_voie FROM gare.db"
    # Encode the statement as a UTF-8 byte string
    statement_bytes = statement.encode('UTF-8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(8192)
        print(f"server Received from DB {data!r}")
        return parse(data)


@app.get("/gare/{idGare}/")
def get_gare(idGare: int):
    id_gare_str = str(idGare)  # Convert the value of id_train to a string
    # Construct the SELECT statement
    statement = f"SELECT id_gare name nb_voie FROM gare.db WHERE id_gare={id_gare_str}"
    # Encode the statement as a UTF-8 byte string
    statement_bytes = statement.encode('UTF-8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return parse(data)


@app.get("/voyage")
def get_voyage():
    # Construct the SELECT statement
    statement = f"SELECT id_voyage nom_voyage type depart arrive voie id_train gare_depart gare_arrive delai FROM voyage.db"
    # Encode the statement as a UTF-8 byte string
    statement_bytes = statement.encode('UTF-8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(8192)
        print(f"server Received from DB {data!r}")
        return parse(data)


@app.get("/voyage/{idVoyage}")
def get_voyage(idVoyage: int):
    id_voyage_str = str(idVoyage)  # Convert the value of id_train to a string
    # Construct the SELECT statement
    statement = f"SELECT id_voyage nom_voyage type depart arrive voie id_train gare_depart gare_arrive delai FROM voyage.db WHERE id_voyage={id_voyage_str}"
    # Encode the statement as a UTF-8 byte string
    statement_bytes = statement.encode('UTF-8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return parse(data)


@app.get("/voyageByGareDepart/{idGare}")
def get_voyageByGareDepart(idGare: int):
    id_gare_str = str(idGare)
    statement = f"SELECT id_voyage nom_voyage type depart arrive voie id_train gare_depart gare_arrive delai FROM voyage.db WHERE gare_depart={id_gare_str}"
    statement_bytes = statement.encode('UTF_8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return parse(data)


@app.get("/voyageByGareArrive/{idGare}")
def voyageByGareArrive(idGare: int):
    id_gare_str = str(idGare)
    statement = f"SELECT id_voyage nom_voyage type depart arrive voie id_train gare_depart gare_arrive delai FROM voyage.db WHERE gare_arrive={id_gare_str}"
    statement_bytes = statement.encode('UTF_8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return parse(data)


@app.get("/voyageByHeureDepart/{depart}")
def voyageByHeureDepart(depart: str):
    depart_str = str(depart)
    statement = f"SELECT id_voyage nom_voyage type depart arrive voie id_train gare_depart gare_arrive delai FROM voyage.db WHERE depart={depart_str}"
    statement_bytes = statement.encode('UTF_8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return parse(data)


@app.get("/voyageByHeureArrivee/{arrive}")
def voyageByHeureArrivee(arrive: str):
    arrive_str = str(arrive)
    statement = f"SELECT id_voyage nom_voyage type depart arrive voie id_train gare_depart gare_arrive FROM voyage.db WHERE arrive={arrive_str}"

    statement_bytes = statement.encode('UTF_8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return parse(data)


class Voyage(BaseModel):
    id_voyage: str
    nom_voyage: str
    type: str
    depart: str
    arrive: str
    voie: str
    id_train: str
    gare_depart: str
    gare_arrive: str
    delai: str


@app.post("/addVoyage")
def create_voyage(voyage: Voyage):
    # Construct the SELECT statement
    statement = f"INSERT id_voyage={voyage.id_voyage} nom_voyage={voyage.nom_voyage} type={voyage.type} depart={voyage.depart} arrive={voyage.arrive} voie={voyage.voie} id_train={voyage.id_train} gare_depart={voyage.gare_depart} gare_arrive={voyage.gare_arrive} delai={voyage.delai} TO voyage.db"

    # Encode the statement as a UTF-8 byte string
    statement_bytes = statement.encode('UTF-8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")

    return f"{data!r}"


@app.delete("/voyage/{item_id}")
def delete_item(item_id: str):
    statement = f"DELETE FROM voyage.db WHERE id_voyage={item_id}"

    statement_bytes = statement.encode('UTF_8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")
        return "done"


@app.patch("/voyage")
def edit_voyage(voyage: Voyage):
    statement = f"UPDATE voyage.db SET nom_voyage={voyage.nom_voyage} type={voyage.type} depart={voyage.depart} arrive={voyage.arrive} voie={voyage.voie} id_train={voyage.id_train} gare_depart={voyage.gare_depart} gare_arrive={voyage.gare_arrive} delai={voyage.delai} WHERE id_voyage={voyage.id_voyage}"
    # Encode the statement as a UTF-8 byte string
    statement_bytes = statement.encode('UTF-8')

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes)  # Send the SELECT statement to the server

        # Receive data from the server
        data = s2.recv(1024)
        print(f"server Received from DB {data!r}")

    return f"{data!r}"
