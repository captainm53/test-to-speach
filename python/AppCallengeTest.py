from gtts import gTTS
import PyPDF4
import os

# pdfobj = open('I_Am_Poem_1.pdf','rb')
# pdfReader = PyPDF4.PdfFileReader(pdfobj)
# pageobj = pdfReader.getPage(0)
# print(pageobj.extractText())
# pdfobj.close()
language = 'en'

questions = (("Example Question 1", "Example Answer A", "Example Answer B", "Example Answer C", "Example Answer D"),
             ("Example Question 2", "Example Answer A", "Example Answer B", "Example Answer C", "Example Answer D"))
saveName = ("question", "a", "b", "c", "d")


def saveTTS(path):
    x = 1
    for q in path:
        j = 0
        for i in q:
            voiceObj = gTTS(text=i, lang=language, slow=False)
            voiceObj.save(saveName[j] + str(x) + ".mp3")
            j = j + 1
        x = x + 1


saveTTS(questions)

# atext = 'Answer A'
# btext = 'Answer B'
# ctext = 'Answer C'
# dtext = 'Answer D'

# qobj = gTTS(text=qtext, lang=language, slow=False)
# aobj = gTTS(text=atext, lang=language, slow=False)
# bobj = gTTS(text=btext, lang=language, slow=False)
# cobj = gTTS(text=ctext, lang=language, slow=False)
# dobj = gTTS(text=dtext, lang=language, slow=False)

# qobj.save("q.mp3")
# aobj.save("a.mp3")

# os.system("start q.mp3")
