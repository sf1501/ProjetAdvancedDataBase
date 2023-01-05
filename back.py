import socket
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import json
app = FastAPI()

##pour lancer le serveur : uvicorn back:app --reload

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

    HOST = "127.0.0.1"  # The server's hostname or IP address
    PORT = 65432  # The port used by the server
    results = b''
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall("SELECT id_gare name nb_voie id_voyage FROM gare.db JOIN voyage.db train.db ON id_gare=gare_depart id_voyage=voyage WHERE id_train=1 AND nb_voie>1".encode('UTF-8'))
        data = s2.recv(1024)
        print(f"server Received from DB {results!r}")
        return parse(data)

@app.get("/train/")
def get_data():

    HOST = "127.0.0.1"  # The server's hostname or IP address
    PORT = 65432  # The port used by the server
    results = b''
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall("SELECT id_train name capacite id_voyage FROM train.db WHERE capacite>0".encode('UTF-8'))
        data = s2.recv(1024)
        print(f"server Received from DB {results!r}")
        return parse(data)

@app.get("/train/")
def get_train():

    HOST = "127.0.0.1"  # The server's hostname or IP address
    PORT = 65432  # The port used by the server
    results = b''
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall("SELECT id_train name capacite id_voyage FROM train.db WHERE capacite>0".encode('UTF-8'))
        data = s2.recv(1024)
        print(f"server Received from DB {results!r}")
        return parse(data)

@app.get("/train/{idTrain}")
def get_train(id_train: int):
    HOST = "127.0.0.1"  # The server's hostname or IP address
    PORT = 65432  # The port used by the server
    id_train_str = str(id_train)  # Convert the value of id_train to a string
    statement = f"SELECT id_train name capacite id_voyage FROM train.db WHERE id_train={id_train_str}"  # Construct the SELECT statement
    statement_bytes = statement.encode('UTF-8')  # Encode the statement as a UTF-8 byte string

    # Create a socket and connect to the server
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
        s2.connect((HOST, PORT))
        s2.sendall(statement_bytes) # Send the SELECT statement to the server

        # Receive data from the server
        # Use a buffer to avoid creating a new string for each chunk of data
        buffer = bytearray(1024)
        results = []
        while True:
            # Receive data into the buffer
            nbytes = s2.recv_into(buffer)
            if nbytes == 0:
                # No more data to receive, break out of the loop
                break
            # Append the received data to the results list
            results.append(buffer[:nbytes])
        # Concatenate the chunks of data into a single bytes object
        results_bytes = b''.join(results)

        # Decode the results from UTF-8
        results_str = results_bytes.decode('UTF-8')

        # Print the received data
        print(f"server Received from DB {results_str!r}")

        # Return the parsed data
        return parse(results_str)