import os

class Database:

    KEYWORDS=["INSERT","SELECT","UPDATE","DELETE","FROM","JOIN","WHERE","AND","OR","TO","SET"]

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
        f.close()

    def readDB(self,searched_data,condition):
        f = open(self.path_database, 'r')
        for line in f:
            #Verification des conditions
            for cond in condition:
                if not(self.checkCondition(line,cond)):
                    next


    def checkError(self,lstInstruction):

        #Verification qu'une table est appele table existe
        if not("FROM" in lstInstruction or "TO" in lstInstruction or "UPDATE"):
            return [False,"No Table word invoked"]

        #On note la/les table de travail
        selectedTable = []
        if lstInstruction[0] == "SELECT":

            iterator = lstInstruction.index("FROM")
            while lstInstruction[iterator]!="WHERE":
                if lstInstruction[iterator] != "JOIN":
                    selectedTable.append(lstInstruction[iterator])
                iterator += 1

        elif lstInstruction[0] == "INSERT":
            selectedTable.append(lstInstruction[lstInstruction.index("TO")+1])
        elif lstInstruction[0] == "UPDATE":
            selectedTable.append(lstInstruction[1])
        else:
            selectedTable.append(lstInstruction[lstInstruction.index("FROM")+1])

        #On verifie que la table apellee existe
        for e in selectedTable:
            if not(os.path.exists(e)):
                return [False,"Table does not exist"]

        #Il y a plusieurs fois le meme mot cle
        for e in self.KEYWORDS:
            if (lstInstruction.count(e) > 1 and (e not in ["JOIN","OR","AND"])):
                return [False,"More than one unique keyword"]
        
        #SELECT/INSERT/UPDATE/DELETE est bien le premier mot
        if lstInstruction[0] not in ["INSERT","SELECT","UPDATE","DELETE"]:
            return [False,"Wrong first word"]
        
        if lstInstruction[0] == "FROM":
            #Verification de la structure : CRUD returnedData FROM db1 'JOIN db2' WHERE
            if not("JOIN" in lstInstruction):
                if not(lstInstruction.index("FROM")<lstInstruction.index("WHERE")):
                    return [False, "Wrong order of keyword"]
            else:
                if not(lstInstruction.index("FROM")<lstInstruction.index("JOIN")<lstInstruction.index("WHERE")):
                    return [False, "Wrong order of keyword"]

        #Verification qu'il n'y a pas de mix de AND et de OR
        if ("AND" in lstInstruction and "OR" in lstInstruction):
            return [False,"Mix of AND and OR"]

        #Verification que s'il y a INSERT ou VALUES ou TO alors il y a les autres
        if (lstInstruction[0]=="INSERT") and not("TO" in lstInstruction):
            return [False,"INSERT without TO"]

        if ("TO" in lstInstruction) and not(lstInstruction[0]=="INSERT"):
            return [False,"TO without INSERT"]

        #Verification de l'ordre de la commande INSERT
        if (lstInstruction[0]=="INSERT"):
            if not(lstInstruction.index("INSERT")<lstInstruction.index("TO")):
                return [False,"Wrong order of INSERT , TO"]

        #Verification que les colonnes dans la requete existe dans la table
        if (lstInstruction[0] in ["UPDATE","INSERT","DELETE"]):
            #On recupere les valeurs valides  (qui sont stockees dans la premiere ligne du csv)
            validValues = []

            infile = open(selectedTable[0], 'r')
            firstLine = infile.readline()[:-1]
            firstLine = firstLine.split(",")
            for condi in firstLine:
                validValues.append(condi)
            
            #En fonction du type de requete on place l'iterator au bon endroit
            if (lstInstruction[0]=="UPDATE") :
                iterator = lstInstruction.index("SET")+1
            elif (lstInstruction[0]=="INSERT"):
                iterator = lstInstruction.index("INSERT")+1
            else:# (lstInstruction[0]=="DELETE")
                iterator = lstInstruction.index("WHERE")+1

            #On verifie que chaque colonne appellee existe
            while ((lstInstruction[iterator]!="WHERE")and(lstInstruction[iterator]!="TO") and (iterator != len(lstInstruction))):
                condi = lstInstruction[iterator]
                condi = condi.split("=")
                iterator += 1
                if condi[0] not in validValues:
                    txt = condi[0]," not present in table ",selectedTable[0]
                    return [False,txt]

        return [True]

    def translateRequest(self,request):

        lstInstruction = request.split(" ")

        #On retire les espaces inutiles
        lstInstruction = list(filter(None, lstInstruction))

        #On vérifie s'il y a des erreurs dans la requete
        error = self.checkError(lstInstruction)
        if not(error[0]):
            return error[1]

        #On cherche a lire une donnee
        if lstInstruction[0] == "SELECT":
            return self.translateSelect(lstInstruction)
        if lstInstruction[0] == "INSERT":
            return self.translateInsert(lstInstruction)
        if lstInstruction[0] == "UPDATE":
            return self.translateUpdate(lstInstruction)
        if lstInstruction[0] == "DELETE":
            return self.translateDelete(lstInstruction)

    def translateSelect(self,lstInstruction):
        #Requete type : SELECT infos1 infos2 infos3 FROM db1 JOIN db2 WHERE condi1=1 AND condi2<1

        iterator = 1
        selectedData = []

        #On recupere les donnees que l'on souhaite recuperer
        while lstInstruction[iterator]!="FROM":
            selectedData.append(lstInstruction[iterator])
            iterator += 1


        #On skip de le FROM
        iterator += 1 
        selectedTable = []

        #On recupere la liste des DBB sur lesquelles on souhaite travailler
        while lstInstruction[iterator]!="WHERE":
            if lstInstruction[iterator] != "JOIN":
                selectedTable.append(lstInstruction[iterator])
            iterator += 1

        #On skip le WHERE
        iterator += 1
        selectedConditions = []

        #On recupere les conditions de la requete
        typeCondition = "None"
        if "AND" in lstInstruction:
            typeCondition = "AND"

        if "OR" in lstInstruction:
            typeCondition = "OR"

        #On recupere les conditions de la requete
        while iterator!=len(lstInstruction):
            if (lstInstruction[iterator] not in ["AND","OR"]):
                selectedConditions.append(lstInstruction[iterator])
            iterator += 1

        #On renvoie les donnees traitees de la requete
        return [selectedData,selectedTable,selectedConditions,typeCondition]

    def translateInsert(self,lstInstruction):
        #Requete type : INSERT column1=values1 column2=values2 column3=values3 TO testdb2
        
        iterator = 1
        insertedColumns = {}

        while (lstInstruction[iterator]!="TO"):
            temp = lstInstruction[iterator].split("=")
            insertedColumns[temp[0]]=temp[1]
            iterator += 1

        iterator += 1
        insertedTable = []

        while (iterator!=len(lstInstruction)):
            insertedTable.append(lstInstruction[iterator])
            iterator += 1


        return [insertedColumns,insertedTable]
        
    def translateUpdate(self,lstInstruction):
        #Requete type : UPDATE testdb2.db SET column1=value1 column2=value2 WHERE id=1
        
        iterator = 1
        uptadedTable = []

        uptadedTable.append(lstInstruction[iterator])

        iterator += 2

        #On creer un dictionnaire avec les paires clef/valeur valant la colonne et la nouvelle valeur
        updatedValues = {}
        while (lstInstruction[iterator]!="WHERE"):
            temp = lstInstruction[iterator].split("=")
            updatedValues[temp[0]]=temp[1]
            iterator += 1

        iterator += 1
        condition = {}

        while (iterator != len(lstInstruction)):
            temp = lstInstruction[iterator].split("=")
            condition[temp[0]]=temp[1]
            iterator += 1
        
        return [updatedValues,condition]

    def translateDelete(self,lstInstruction):
        #Requete type : DELETE FROM testdb2.db WHERE id=1

        deleteTable = lstInstruction[2]

        iterator = 4

        condi = {}

        while(iterator!=len(lstInstruction)):
            temp = lstInstruction[iterator].split("=")
            condi[temp[0]]=temp[1]
            iterator += 1

        return [deleteTable,condi]
            
#Exemple requete : 
#SELECT infos1 infos2 infos3 FROM testdb2.db JOIN testdb2.db WHERE condi1=1 AND condi2<1
#INSERT column1=values1 column2=values2 column3=values3 TO testdb2.db
#UPDATE testdb2.db SET column1=value1 column2=value2 WHERE id=1
#DELETE FROM testdb2.db WHERE column3=1


db = Database("testdb2.db")
print(db.translateRequest("INSERT column1=values1 column2=values2 column3=values3 TO testdb2.db"))