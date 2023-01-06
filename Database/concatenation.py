def loadFile(file):
    lstLines=[]

    file = open(file,'r')

    dicoFile = {}

    first = file.readline()

    first = first[:-1]
    first = first.split(";")

    for column in first:
        dicoFile[column] = ""

    lines = file.readlines()

    #print("------------------------------------------------\nLines of ",file.name)
    for line in lines:
        if line[-1]=="\n":
            line = line[:-1]

        line = line.split(";")

        columns = dicoFile.keys()
        iterator=0
        for column in columns:
            dicoFile[column]=line[iterator]
            iterator+=1
        lstLines.append(dicoFile.copy())
    
    file.close()
    return lstLines

def fusion(lstDicoFirstFile,file2,condi,nomFichierTempo):
    lstLinesSecondFile = loadFile(file2)

    finalLst = []

    

    for second in range(len(lstLinesSecondFile)):

        if condi[0] in lstLinesSecondFile[second].keys():
                condition = lstLinesSecondFile[second][condi[0]]
                condiIndexFirstFile = 1
        else:
            condition = lstLinesSecondFile[second][condi[1]]
            condiIndexFirstFile = 0

        for first in range(len(lstDicoFirstFile)):
            if lstDicoFirstFile[first][condi[condiIndexFirstFile]] == condition:
                temp = dict(lstLinesSecondFile[second].copy())
                temp.update(lstDicoFirstFile[first].copy())
                finalLst.append(temp.copy())

    tempFile = open(nomFichierTempo,'w')

    for i in range(len(finalLst)):
        if i==0:
            for key in finalLst[i].keys():
                tempFile.write(key)
                tempFile.write(";")
            tempFile.write("\n")
        for key in finalLst[i].keys():
            tempFile.write(finalLst[i][key])
            tempFile.write(";")
        tempFile.write("\n")
    tempFile.close()

def concatenate(lstTable,condition,nomFichierTempo):
    for i in range(len(lstTable)):
        if i==0:
            firstLstDico = loadFile(lstTable[i])
        else:
            fusion(firstLstDico,lstTable[i],condition,nomFichierTempo)