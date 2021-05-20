import io
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from io import StringIO
from gtts import gTTS
import re
import os
from tkinter import filedialog

path = os.getcwd()
language = 'en'
saveName = ("q.", "a.", "b.", "c.", "d.", "e.", "f.", "g.", "h.", "i.", "j.", "k.", "l.","m.","n.","o","p","q","r","s","t","u","v","w","x","y","z")
def saveTTS(questions):
    x = 1
    for q in questions:
        j = 0
        if (q != []):
            for i in q:
                voiceObj = gTTS(text=i, lang=language, slow=False, lang_check=False)
                voiceObj.save(path + saveName[j][0] + str(x) + ".mp3")
                txtSave = open(path + saveName[j][0] + str(x) + ".txt", "w+")
                txtSave.write(i)
                txtSave.close()
                j = j + 1
            x = x + 1
def convert_pdf_to_txt(where):
    rsrcmgr = PDFResourceManager()
    retstr = io.StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, laparams=laparams)
    fp = open(where, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 0
    caching = True
    pagenos = set()

    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages,
                                  password=password,
                                  caching=caching,
                                  check_extractable=True):
        interpreter.process_page(page)



    fp.close()
    device.close()
    text = retstr.getvalue()
    retstr.close()
    return text
def cleanList(data):
    while "" in data:
        data.remove("")
        while " " in data:
            data.remove(" ")
        return data
def findQuestions(qa):
    qa = re.sub('[\n\t]', '^', qa)
    qa = re.sub(' +', ' ', qa)
    qaList = qa.split("^")
    qaList = cleanList(qaList)

    global path
    global file
    fileName = os.path.splitext(file)[0].split('/')[-1]
    print(fileName)
    path = path + "\\" + fileName + "\\"
    try:
        os.mkdir(path)
    except:
        print(path + " already exists")

    testList = open("testList.txt", "r+")
    if(fileName in testList.read()) == False:
        testList.write(fileName + '\n')

    qaListPrime = [[]]
    dataList = []
    qnumber = 0
    answernum = 1
    for x in range(len(qaList)):
        if qaList[x][:1].isnumeric() and qaList[x][1] == ".":
            qaListPrime.append([])
            qaListPrime[qnumber + 1].append(qaList[x])
            qnumber = qnumber + 1
            dataList.append(answernum)
            answernum = 1
        elif saveName[answernum] == qaList[x][:2]:
            qaListPrime[qnumber].append(qaList[x])
            answernum = answernum + 1
        print(qaListPrime)
    dataList.append(answernum)
    print(qnumber)
    data = open(path + "data.txt", "w")
    dataList[0] = qnumber
    print(dataList)
    for q in dataList:
        data.write(str(q))
        data.write("\n")
    data.close()
    return qaListPrime


file = filedialog.askopenfilename(initialdir=path)
questions = convert_pdf_to_txt(file)
debug = open("debug.txt", "w+")
debug.truncate(0)
debug.write(questions)
debug.close()
answers = findQuestions(questions)
saveTTS(answers)
