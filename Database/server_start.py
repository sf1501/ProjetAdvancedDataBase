import socket
import fileMgr

def main():

    db =fileMgr.Database()

    HOST = "127.0.0.1"  # Standard loopback interface address (localhost)
    PORT = 65432  # Port to listen on (non-privileged ports are > 1023)

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
                    print("Server recived : ",data.decode('UTF-8'))
                    answer = db.translateRequest(data.decode('UTF-8'))
                    temp = ""
                    for e in answer:
                        temp += str(e)
                    print("Server send : ",temp.encode('UTF-8'))
                    conn.sendall(temp.encode('UTF-8'))
            conn.close()

if __name__ == "__main__":
    main()