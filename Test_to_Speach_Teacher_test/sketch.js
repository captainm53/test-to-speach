let ySpacing = 40;
let yOffset = 110;
let readXSpacing = 25;
let answerXSpacing = 150

let fillCol
let buttonCol
let textCol


let buttons = [];
let questions = [];
let questionsAudio = [];
let letters = ["Questions", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let answers;
let currentAnswer = "0";
let currentQuestionNumber = 0;
let maxQuestionNumber;
let playing = false;
let numFolders = 0;
let testName
let name


function preload() {
  result = loadStrings('');
  //loadStuff(loadFile('data.txt'), "test")
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  buttonCol = color(255,255,255);
  fillCol = color(5,102,141,50);
  textCol = color(0, 0, 0)
  print("setup complete");
  answers = [];
  for (let i = 0; i < questions.length; i++) {
    answers.push("0");
  }
  //makeTheQuestion(0);
  welcomeScreen();
}

function draw() {

}

function loadStuff(folder) {
  data = loadFile(folder + 'data.txt');
  data = data.split("\n")
  num = str(data[0]);
  fileNames = ["q", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];
  for (i = 0; i < num; i++) {
    questions.push([]);
    questionsAudio.push([]);
    goOn = true;
    j = 0;
    while (goOn) {
      questions[i][j] = loadFile(folder + fileNames[j] + (i + 1) + ".txt");
      questionsAudio[i].push(loadSound(folder + fileNames[j] + (i + 1) + ".mp3"))
      j++;
      if (j >= data[i + 1]) {
        goOn = false;
      }
    }

  }
  maxQuestionNumber = questions.length;
  print(questions);
}

function welcomeScreen() {
  clear();
  clearButtons();
  rectMode(CENTER)
  noStroke()
  fill(fillCol);
  rect(windowWidth/2, windowHeight/2 - 165, 550,100, 20);
  textSize(30);
  textFont();
  textStyle(BOLD)
  textAlign(CENTER);
  fill(textCol);
  text("Welcome to the Test to Speech App!", windowWidth/2, windowHeight/2 - 175)
  textSize(25)
  textStyle(NORMAL);
  text("Please Select Your Test.", windowWidth/2, windowHeight/2 - 140)
  dropdown = createSelect();
  dropdown.position(windowWidth/2 - 120,windowHeight/2-105);
  dropdown.style('font-size', '20px');
  dropdown.style('background-color', buttonCol);
  buttons.push(dropdown);
  testList = loadFile("testList.txt");
  testList = testList.split("\n");
  for(let i = 0; i < testList.length - 1; i++) {
    dropdown.option(testList[i]);
  }
  Rbutton = createButton("Start Test");
  Rbutton.style('font-size', '25px');
  Rbutton.position(windowWidth/2 - 65, windowHeight/2);
  Rbutton.mousePressed(() => chooseTest());
  Rbutton.style('background-color', buttonCol);
  buttons.push(Rbutton);
  fill(textCol);
  text("Please enter your name:", windowWidth/2, windowHeight/2 - 50)
  enterName = createInput("")
  enterName.style('background-color', buttonCol);
  enterName.position(windowWidth/2 - 110, windowHeight/2 - 40);
  enterName.size(200, 25)
  buttons.push(enterName)
  teachButton = createButton("Are you a teacher?");
  teachButton.style('background-color', buttonCol);
  teachButton.position(windowWidth/2, windowHeight - 10);
  teachButton.mousePressed(() => teacherSignin());
  buttons.push(teachButton);
}

function chooseTest() {
  folder = dropdown.value() + "\\";
  testName = dropdown.value()
  name = enterName.value();
  print(name)
  loadStuff(folder);
  clear()
  makeTheQuestion(0);
}
function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    result = xmlhttp.responseText;
  }
  return result;
}

function makeTheQuestion(questionNumber) {
  clearButtons();
  col = color(255,255,255);
  let i = 0;
  buttonQ = createButton(questions[questionNumber][i]);
  buttonQ.position(answerXSpacing, ySpacing * i + yOffset);
  buttons.push(buttonQ);
  buttonQ.style('font-size', '18px');
  buttonQ.style('background-color', buttonCol);
  
  buttonARead = createButton("Read Aloud");
  buttonARead.mousePressed(() => queuePlayAnswer(questionNumber, i));
  buttonARead.position(readXSpacing, ySpacing * i + yOffset);
  buttons.push(buttonARead);
  buttonARead.style('font-size', '18px');
  buttonARead.style('background-color', buttonCol);

  buttonReadAll = createButton("Read Entire Question " + str(questionNumber + 1))
  buttonReadAll.mousePressed(() => queuePlayAll(questionNumber, 0));
  buttonReadAll.position(answerXSpacing, ySpacing * -1 + yOffset);
  buttons.push(buttonReadAll);
  buttonReadAll.style('font-size', '18px');
  buttonReadAll.style('background-color', buttonCol);
 
  for (let i = 1; i < questions[questionNumber].length; i++) {
    button = createButton(questions[questionNumber][i]);
    buttons.push(button);
    button.mousePressed(() => saveAnswer(letters[i], answerXSpacing, ySpacing * i + yOffset));
    button.position(answerXSpacing, ySpacing * i + yOffset);
    button.style('font-size', '18px');
    button.style('background-color', buttonCol);
    buttonASound = createButton("Read Aloud");
    buttons.push(buttonASound);
    buttonASound.position(readXSpacing, ySpacing * i + yOffset);
    buttonASound.mousePressed(() => queuePlayAnswer(questionNumber, i));
    buttonASound.style('font-size', '18px');
    buttonASound.style('background-color', buttonCol);
  }
  if (currentQuestionNumber < maxQuestionNumber - 1) {
    buttonNext = createButton('Next Question');
    buttons.push(buttonNext);
    buttonNext.position(answerXSpacing, ySpacing * (questions[questionNumber].length) + yOffset);
    buttonNext.mousePressed(nextQuestion);
    buttonNext.style('font-size', '18px');
    buttonNext.style('background-color', buttonCol);
  }
  if (currentQuestionNumber > 0) {
    buttonP = createButton('Previous');
    buttonP.mousePressed(previousQuestion);
    buttonP.position(readXSpacing, ySpacing * (questions[questionNumber].length) + yOffset);
    buttons.push(buttonP);
    buttonP.style('font-size', '18px');
    buttonP.style('background-color', buttonCol);
  }
  if (currentQuestionNumber == maxQuestionNumber - 1){
    buttonNext = createButton('Finished!');
    buttons.push(buttonNext);
    buttonNext.position(answerXSpacing, ySpacing * (questions[questionNumber].length) + yOffset *2);
    buttonNext.style('font-size', '18px');
    buttons.push(buttonNext);
    buttonNext.mousePressed(() => sendEmail());
    buttonNext.style('background-color', buttonCol);
  }
}
function nextQuestion() {
  //if (currentAnswer != "0") {
    clear();
    clearButtons();
    for(let x = 0; x < questionsAudio[currentQuestionNumber].length; x++){
      questionsAudio[currentQuestionNumber][x].stop();
    }
    answers[currentQuestionNumber] = currentAnswer;
    currentQuestionNumber++;
    currentAnswer = answers[currentQuestionNumber];
    if (currentQuestionNumber < maxQuestionNumber) {
      if (answers[currentQuestionNumber] != "0") {
        redrawEllipse(answers[currentQuestionNumber]);
      }
      makeTheQuestion(currentQuestionNumber);
      } else {
      text("You are done!", 100, 100);
      print(answers);
      saveStrings(answers, "answers.txt");
    }
  //}
}
function previousQuestion() {
  if (currentAnswer != "0") {
    answers[currentQuestionNumber] = (currentAnswer);
    currentAnswer = "0";
  }
  for(let x = 0; x < questionsAudio[currentQuestionNumber].length; x++){
    questionsAudio[currentQuestionNumber][x].stop();
  }
  currentQuestionNumber--;
  clear();
  clearButtons();
  currentAnswer = answers[currentQuestionNumber];
  if (currentQuestionNumber < maxQuestionNumber) {
    if (answers[currentQuestionNumber] != "0") {
      redrawEllipse(answers[currentQuestionNumber]);
    }
    makeTheQuestion(currentQuestionNumber);
  } else {
    //text("You are done!", 100, 100);
    //print(answers);
    //saveStrings(answers, "answers.txt");
  }
}
function saveAnswer(letter, x, y) {
  currentAnswer = letter;
  clear();
  fill(255, 0, 0);
  ellipse(x - 7.5, y + 10, 10);
  print(currentAnswer);
}
function redrawEllipse(letter) {
  if (letter != "0") {
    for (let i = 1; i <= letters.length; i++) {
      if (letters[i] == letter) {
        ellipse(answerXSpacing - 7.5, ySpacing * i + yOffset + 10, 10);
      }
    }
  }
}
function queuePlayAnswer(questionNumber, answer){
  if(playing == false){
    playAnswer(questionNumber, answer);
  }
}
function playAnswer(questionNumber, answer) {
  if (questionsAudio[questionNumber][answer].isPlaying()) {
    questionsAudio[questionNumber][answer].stop()
  }
  questionsAudio[questionNumber][answer].play()
}
function queuePlayAll(questionNumber, j){
  for(let x = 0; x < questionsAudio[questionNumber].length; x++){
    questionsAudio[questionNumber][x].stop();
  }
  if(playing == false){
    playAll(questionNumber, j);
  }
}
function playAll(questionNumber, j){
  if(j == 0){
    playing = true;
  }
  if(j<questionsAudio[questionNumber].length && playing == true){
    questionsAudio[questionNumber][j].play();
    questionsAudio[questionNumber][j].onended(() => playAll(questionNumber, j + 1));
  }
  else{
    playing = false;
  }
}
function sendEmail() {
  answers[currentQuestionNumber] = currentAnswer;
  let emailAnswers = "";
  for (let i = 0; i < answers.length; i++) {
    emailAnswers += " " + (i + 1) + "." + answers[i] + "\n";
  }
  Email.send({
    Host: "smtp.gmail.com",
    Username: "testtospeech999@gmail.com",
    Password: "Falcons11",
    To: 'testtospeech999@gmail.com',
    From: "testtospeech999@gmail.com",
    Subject: testName + ": " + name + "'s Test",
    Body: emailAnswers,
  }).then(
    message => alert("Answers sent successfully")
  );
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].remove();
    clear();
  }
  textStyle(BOLD)
  textSize(25)
  fill(textCol)
  text("You are done!", windowWidth/2, windowHeight/2);
  text("Answers successfully sent (Disregard if answers recorded on paper)", windowWidth/2 -50, windowHeight/2+50)
}
function clearButtons(){
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].remove();
  }
  buttons = [];
}
function teacherSignin(){
  clearButtons();
  clear();
  returnToWelcome = createButton("Return to main page");
  returnToWelcome.style('background-color', buttonCol);
returnToWelcome.position(windowWidth/2, 10);
  buttons.push(returnToWelcome)
  returnToWelcome.mousePressed(() => welcomeScreen());
  buttons.push(returnToWelcome);
  
  textSize(30);
  textFont();
  textStyle(BOLD)
  textAlign(CENTER);
  fill(textCol);
  text("Enter your teacher code:", windowWidth/2, windowHeight/2 - 175)
  
  teacherCode = createInput("")
  teacherCode.style('background-color', buttonCol);
  teacherCode.position(windowWidth/2 - 100, windowHeight/2 - 150);
  teacherCode.size(200, 25)
  buttons.push(teacherCode)
  
  testCode = createButton("Sign In")
  testCode.style('backgrould-color', buttonCol);
  testCode.position(windowWidth/2 - 100, windowHeight/2 - 100);
  testCode.mousePressed(() => checkCode(teacherCode.value()));
  buttons.push(testCode);
}
function checkCode(code){
  teacherControls();
}
function teacherControls(codeCorrect){
  clearButtons();
  clear();
  returnToWelcome = createButton("Return to main page");
  returnToWelcome.style('background-color', buttonCol);
returnToWelcome.position(windowWidth/2, 10);
  buttons.push(returnToWelcome)
  returnToWelcome.mousePressed(() => welcomeScreen());
  buttons.push(returnToWelcome);
}