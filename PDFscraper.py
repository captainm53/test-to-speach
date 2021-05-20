from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from io import StringIO
from gtts import gTTS

language = 'en'
import re


def convert_pdf_to_txt(path):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, laparams=laparams)
    fp = open(path, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 0
    caching = True
    pagenos = set()
    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching,
                                  check_extractable=True):
        interpreter.process_page(page)
        text = retstr.getvalue()
        fp.close()
        device.close()
        retstr.close()
        return text


def cleanList(list):
    while ("" in list):
        list.remove("")
        while (" " in list):
            list.remove(" ")
        return list


def findQuestions(qa):
    reaesc = re.compile(r'[\n\t]')
    newtest = reaesc.sub('^', qa)
    newtest = re.sub(' +', ' ', newtest)
    mylist = newtest.split("^")
    mylist = cleanList(mylist)
    qlist = []
    alist = []
    qnumber = 1
    for x in range(len(mylist)):
        dog = str(qnumber) + "."
        if dog in mylist[x]:
            qlist.append(mylist[x])
            qnumber = qnumber + 1
        else:
            alist.append(mylist[x])
    alistprime = [[]]
    num = -1
    print(alist)
    for x in alist:
        if "a." in x:
            num = num + 1
            alistprime.append([])
            alistprime[num].append(x)
        elif "b." in x:
            alistprime[num].append(x)
        elif "c." in x:
            alistprime[num].append(x)
        elif "d." in x:
            alistprime[num].append(x)
        else:
            pass
        print(alistprime)
    return alistprime


saveName = ("a", "b", "c", "d")


def saveTTS(path):
    x = 1
    for q in path:
        j = 0
        for i in q:
            voiceObj = gTTS(text=i, lang=language, slow=False)
            voiceObj.save(saveName[j] + str(x) + ".mp3")
            j = j + 1
        x = x + 1


questions = convert_pdf_to_txt("testdoc.pdf")
debug = open("debug.txt", "w")
debug.truncate(0)
debug.write(questions)
debug.close()
answers = findQuestions(questions)
saveTTS(answers)
