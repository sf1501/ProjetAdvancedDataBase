import os

class Database:

    """
    Forme de la DB : ID_train,Heure_départ,Gare_départ,Heure_arrivé,Gare_arrivé,Vitesse
    
    """
    ID_TRAIN = 0
    HEURE_DEPART = 1
    GARE_DEPART = 2
    HEURE_arrivé = 3
    GARE_arrivé = 4
    VITESSE = 5

    def __init__(self,path_database,data=""):

        if not(os.path.exists(path_database)):
            print("database does not exist")
            self.createDatabase(path_database)
        else:
            print("database does exist")
            self.path_database = path_database
        if data!="":
            print("data isn't empty")
            self.loadDatabase(data)

    def createDatabase(self,path_database):
        with open(path_database, 'w') as f:
            self.path_database = path_database
            print("database created")
        f.close()

    def loadDatabase(self,data):
        with open(self.path_database, 'a') as f:
            f.write(data)
        print("database loaded")

db = Database("testdb")
db2 = Database("testdb2","data1\ndata2")
db3 = Database("testdb2")
db4 = Database("testdb2","data3\ndata4")

   