import os
import concatenation
import json
import shutil

class Database:

    KEYWORDS=["INSERT","SELECT","UPDATE","DELETE","FROM","JOIN","ON","WHERE","AND","OR","TO","SET"]

    def checkError(self,lstInstruction):

        #Vérifiacation que la requete n'est pas vide
        if len(lstInstruction)==0:
            return [False,"Query empty"]

        #Verification qu'une table est apelle table existe
        if not("FROM" in lstInstruction or "TO" in lstInstruction or "UPDATE" in lstInstruction):
            return [False,"No Table word invoked"]

        #On note la/les table de travail
        selectedTable = []
        if lstInstruction[0] == "SELECT":

            iterator = lstInstruction.index("FROM")+1
            while iterator<len(lstInstruction) and lstInstruction[iterator]!="WHERE" and lstInstruction[iterator]!="ON":
                if lstInstruction[iterator] != "JOIN":
                    selectedTable.append(lstInstruction[iterator])
                iterator += 1

        #Vérification que s'il y a un JOIN il y a un where
        if ("JOIN" in lstInstruction and not("ON" in lstInstruction)):
            return [False,"JOIN without ON"]

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
            firstLine = firstLine.split(";")
            for condi in firstLine:
                validValues.append(condi)
            
            #En fonction du type de requete on place l'iterator au bon endroit
            if (lstInstruction[0]=="UPDATE") :
                iterator = lstInstruction.index("SET")+1
            elif (lstInstruction[0]=="INSERT"):
                iterator = lstInstruction.index("INSERT")+1
            else:# (lstInstruction[0]=="DELETE")
                iterator = len(lstInstruction)

            #On verifie que chaque colonne appellee existe
            while ((iterator < len(lstInstruction)) and (lstInstruction[iterator]!="WHERE")and(lstInstruction[iterator]!="TO")):
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
        #Requete type : SELECT infos1 infos2 infos3 FROM db1 JOIN db2  db3 ON db1id=db2id db2id=db3id WHERE condi1=1 AND condi2<1

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
        while iterator<len(lstInstruction) and lstInstruction[iterator]!="ON" and lstInstruction[iterator]!="WHERE":
            if lstInstruction[iterator] != "JOIN":
                selectedTable.append(lstInstruction[iterator])
            iterator += 1

        #On skip le ON
        if iterator<len(lstInstruction) and lstInstruction[iterator]=="ON" :
            iterator += 1
        selectedJoin = []

        while iterator<len(lstInstruction) and lstInstruction[iterator]!="WHERE":
            condi = lstInstruction[iterator].split("=")
            selectedJoin.append(condi)
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
        while iterator<len(lstInstruction) and iterator!=len(lstInstruction):
            if (lstInstruction[iterator] not in ["AND","OR"]):
                selectedConditions.append(lstInstruction[iterator])
            iterator += 1

        
        if selectedJoin != []:
            Join_table=self.joinHandler(selectedTable,selectedJoin)
        else :
            Join_table="temp"+selectedTable[0]
            
            shutil.copyfile(selectedTable[0],Join_table)
            

        #On envoie les donnees traitees de la requete a la fonction select
        return self.select([selectedData,Join_table,selectedConditions,typeCondition])

    def select(self,arg_list):
        columns=arg_list[0]
        checked_columns=[]
        table=arg_list[1]
        conditions=arg_list[2] ## chaque element de la liste est une string complete de condition
        cond_keys=[]
        cond_values=[]
        cond_operands=[]
        for condition in conditions:
            split_conds=self.condition_splitter(condition)
            cond_keys.append(split_conds[0])
            cond_values.append(split_conds[1])
            cond_operands.append(split_conds[2])
        where_type=arg_list[3]
        
        f=open(table,"r")
        lines_unformated=f.readlines()
        f.close()
        formated_lines=[]
        for line in lines_unformated:
            formated_lines.append(self.reformat(line))

        ##Identification des colonnes dans la requêtes qui sont effectivement dans la base de données
        for oui in columns:
            if oui in formated_lines[0]:
                checked_columns.append(oui)

        ##Identification des colonnes de vérification du WHERE :
        important_columns = []
        for cond in cond_keys :
            for m in range(len(formated_lines[0])):
                if formated_lines[0][m] == cond:
                    important_columns.append(m)

        ####Condition_check
        selected_lines=[]
        for line in formated_lines[1:]:
            line_cond=[]
            for n in range(len(conditions)):
                line_cond.append(self.check_condition(line[important_columns[n]],cond_values[n],cond_operands[n]))
            if where_type=="OR":
                if True in line_cond:
                    selected_lines.append(line)
            elif where_type=="AND":
                if not(False in line_cond):
                    selected_lines.append(line)
            elif where_type=="None":
                if True in line_cond or not(line_cond):
                    selected_lines.append(line)

        ##Selection des colonnes
        only_columns=[checked_columns]
        for line in selected_lines:
            line_filtered=[]
            for iterator in range(len(line)):
                if formated_lines[0][iterator] in columns:
                    line_filtered.append(line[iterator])
            only_columns.append(line_filtered)

        ##transfo json maintenant
        diction={}
        for c in range(len(only_columns[0])):
            list_temp=[]
            for g in range(len(only_columns)-1):
                list_temp.append(only_columns[g+1][c])
            diction[only_columns[0][c]]=list_temp
        self.deleteFile(table)
        answer = json.dumps(diction) 

        return answer

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


        return self.insert([insertedColumns,insertedTable])

    def insert(self,lstInstruction):

        #On ouvre le fichier pour récupérer un dictionnaire des valeurs en fonction des colonnes
        file = open(lstInstruction[1][0],"r")

        dicoFile = {}

        first = file.readline()

        first = first[:-1]
        first = first.split(";")

        for column in first:
            dicoFile[column] = ""

        file.close()

        #On créer la ligne que l'on va ajouter
        txt=""

        for key in dicoFile.keys():

            if key != "":
                txt += lstInstruction[0][key] +";"

        txt += "\n"

        #On ajoute la ligne à la fin du fichier
        file = open(lstInstruction[1][0],"a")

        file.write(txt)

        file.close()

        return txt

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
        condition = []

        operator="None"

        while (iterator != len(lstInstruction)):
            
            if lstInstruction[iterator] != "AND" and lstInstruction[iterator] != "OR":
                condition.append(lstInstruction[iterator])
            else:
                operator = lstInstruction[iterator]
            iterator += 1
        
        return self.update([uptadedTable,updatedValues,condition,operator])

    def update(self,lstInstruction):
        
        #On ouvre le fichier pour récupérer un dictionnaire des valeurs en fonction des colonnes
        print(lstInstruction)
        file = open(lstInstruction[0][0],"r")

        dicoFile = {}

        first = file.readline()

        firstlinesave = first

        first = first[:-1]
        first = first.split(";")

        for column in first:
            dicoFile[column] = ""

        lines = file.readlines()

        file.close()

        neddedLineDelete = []
        #On itere par ligne (on passe par un len pour pouvoir modifier lines)
        for idLine in range(len(lines)):

            line = lines[idLine][:-1]
            line = line.split(";")

            #On récupère un dico de la ligne
            dicoLine = {}

            i=0

            for key in dicoFile.keys():
            
                dicoLine[key] = line[i]
                i+=1

            #On regarde si la condition est requise
            operateur=lstInstruction[-1]
            if operateur == "None":
                operateur = "AND"

            #En fonction de si on a un AND ou un OR on inserve la logique
            if operateur == "AND":
                needUpdate = True
            else:
                needUpdate = False

            #On vérifie si il faut modifier la ligne
            for condition in lstInstruction[2]:
                if "=" in condition:
                    column = condition.split("=")
                    if column[1]!=dicoLine[column[0]]:
                        if operateur == "AND":
                            needUpdate = False
                    else:
                        if operateur == "OR":
                            needUpdate = True

                if "<" in condition:
                    column = condition.split("<")
                    if column[1]<dicoLine[column[0]]:

                        if operateur == "AND":
                            needUpdate = False
                    else:
                        if operateur == "OR":
                            needUpdate = True

                if ">" in condition:
                    column = condition.split(">")
                    if column[1]<dicoLine[column[0]]:

                        if operateur == "AND":
                            needUpdate = False
                    else:
                        if operateur == "OR":
                            needUpdate = True

            #Si on doit edit la ligne
            if needUpdate:
                #On attribut les nouvelles valeurs à dicoLine
                for key in lstInstruction[1].keys():
                    dicoLine[key] = lstInstruction[1][key]
                #On modifie lines avec la nouvelle ligne
                txt=""
                for key in dicoLine.keys():
                    if key!="":
                        txt += dicoLine[key] +";"
                txt += "\n"

                lines[idLine] = txt

        #Maintenant on réécrit le fichier
        file = open(lstInstruction[0][0],"w")

        file.write(firstlinesave)
        for line in lines:
            file.write(line)

        file.close()

        return "Done"

    def translateDelete(self,lstInstruction):
        #Requete type : DELETE FROM testdb2.db WHERE id=1
        #print(lstInstruction)
        #['DELETE', 'FROM', 'voyagedb.txt', 'WHERE', 'id_voyage=1', 'AND', 'nom_voyage=1']
        deleteTable = lstInstruction[2]
        if len(lstInstruction)<=3:
            return self.delete(deleteTable,[])
        iterator = 4

        condi = []
        if "AND" in lstInstruction:
            while(iterator<len(lstInstruction)):
                if lstInstruction[iterator] != "AND":
                    condi.append(lstInstruction[iterator])
                iterator+=1
            self.delete(deleteTable,condi)
        elif "OR" in lstInstruction:
            while iterator<len(lstInstruction):
                self.delete(deleteTable,[lstInstruction[iterator]])
                iterator+=2
        elif not ("OR" in lstInstruction or "AND" in lstInstruction):
            self.delete(deleteTable,[lstInstruction[iterator]])
        return "Done"

    def delete (self, deleteTable, conditions):
        f=open(deleteTable,'r')
        f_lines_unformated=f.readlines()
        if not(conditions):
            f.close()
            f_new=open(deleteTable,'w')
            f_new.write(f_lines_unformated[0])
            f_new.close()
            return None
        formated_lines=[]
        for line in f_lines_unformated:
            formated_lines.append(self.reformat(line))
        f.close()
        important_columns=[]
        cond_keys=[]
        cond_values=[]
        cond_operands=[]
        for condition in conditions:
            split_cond=self.condition_splitter(condition)
            cond_keys.append(split_cond[0])
            cond_values.append(split_cond[1])
            cond_operands.append(split_cond[2])
            
        for j in range(len(formated_lines[0])):        
            if formated_lines[0][j] in cond_keys:
                important_columns.append(j)

        f_new=open(deleteTable,'w')
        for line in formated_lines :
            delete = False
            for k in range(len(important_columns)):
                if self.check_condition(line[important_columns[k]],cond_values[k],cond_operands[k]):
                    delete=True
            if not(delete):
                recap=''
                for el in line :
                    recap+=el
                    recap+=";"
                f_new.write(recap+"\n")
        f_new.close()
        return None

    def deleteFile(self,lastname):

        number = lastname.replace(".txt","")
        number = number.replace("temp","")
        if (number.isdigit()):
            number = int(number)

            for i in range(number+1):
                    #On supprime les fichiers temporaires

                    nom = "temp"+str(i)+".txt"

                    os.remove(nom)

    def joinHandler(self,lstTable,lstCondi):


        lstNomfichier = []

        #On itere le nombre de fois qu'on a une jointure à faire
        for i in range(len(lstTable)-1):

            #On créer le nom du fichier temporaires qui va être crée
            nom = "temp"+str(i)+".txt"

            if i==0:
                concatenation.concatenate([lstTable[i],lstTable[i+1]],lstCondi[i],nom)
            else:
                ancienNom = "temp"+str(i-1)+".txt"
                concatenation.concatenate([ancienNom,lstTable[i+1]],lstCondi[i],nom)

        #self.deleteFile(nom)

        return nom

    def reformat(self,text):
        ligne=[]
        i=0
        while i<len(text):
            mot=""
            while i<len(text) and text[i]!=";":
                mot+=text[i]
                i+=1
            if mot !="\n":
                ligne.append(mot)
            i+=1
        return ligne

    def check_condition(self,line_value, condition_value, operand):

        if (line_value.isdigit() and condition_value.isdigit()):
            line_value = int(line_value)
            condition_value = int(condition_value)

        if operand == "=" and line_value==condition_value:
            return True
        elif operand == "<" and line_value<condition_value:
            return True
        elif operand == ">" and line_value>condition_value:
            return True
        return False

    def condition_splitter(self,condition):
        operands=("<","=",">")
        split_cond=[]
        i=0
        while i<len(condition):
            part=""
            while i<len(condition) and (condition[i] not in operands):
                part+=condition[i]
                i+=1
            split_cond.append(part)
            if i<len(condition) and condition[i] in operands:
                operand=condition[i]
                i+=1
        split_cond.append(operand)
        return split_cond

#Exemple requete : 
#SELECT id_gare name nb_voie id_voyage FROM gare.db JOIN voyage.db train.db ON id_gare=gare_depart id_voyage=voyage WHERE condi1=1 AND condi2<1
#INSERT column1=values1 column2=values2 column3=values3 TO testdb2.db
#UPDATE testdb2.db SET column1=value1 column2=value2 WHERE id=1
#DELETE FROM testdb2.db WHERE column3=1

#db = Database()
#print(db.translateRequest("DELETE FROM voyage.db WHERE id_voyage=1"))
