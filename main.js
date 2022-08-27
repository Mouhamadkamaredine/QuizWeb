let countspan = document.querySelector(" .count span");
let bulletss= document.querySelector(".bullets");
let bulletSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerData = document.querySelector(".answers-area ");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");


let currentIndex=0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions(){
let myrequest = new XMLHttpRequest();

myrequest.onreadystatechange= function(){
    if(this.readyState === 4 && this.status === 200){
        let questionsObject = JSON.parse(this.responseText);
        let questioncount = questionsObject.length;
       
        createBullets(questioncount);
        addQuestionsData(questionsObject[currentIndex],questioncount);
        countdown(5, questioncount);

        submitButton.onclick= ()=>{
            let theRightAnswer=questionsObject[currentIndex].right_answer;
             currentIndex++;
           checkAnswer(theRightAnswer,questioncount);
           quizArea.innerHTML="";
           answerData.innerHTML="";
           addQuestionsData(questionsObject[currentIndex],questioncount);
           handeleBullets();
           clearInterval(countdownInterval);
           countdown(5, questioncount);
           shoeResult(questioncount);

        };
    }
}
myrequest.open("Get","html-question.json",true);
myrequest.send();
}
getQuestions();

function createBullets(num){
    countspan.innerHTML=num;
for (let i=0;i<num;i++){
    let theBullet = document.createElement("span");
    if(i===0){
        theBullet.className="on";
    }
    bulletSpanContainer.appendChild(theBullet); 

}
}

function addQuestionsData(obj , count){
    if(currentIndex<count){
        
  let questionTitle= document.createElement("h2");
  let questionText = document.createTextNode(obj['title']);
  questionTitle.appendChild(questionText);
quizArea.appendChild(questionTitle);

//create answer
for(let i=1;i<=4;i++){
    let mainDiv = document.createElement("div");
    mainDiv.className="answer";
    let radioInput = document.createElement("input");
    radioInput.name = "question";
    radioInput.type = "radio";
    radioInput.id=`answer_${i}`;
    radioInput.dataset.answer= obj[`answer_${i}`];
    if (i===1){
        radioInput.checked=true;
    }
    let theLable= document.createElement("lable");
    theLable.htmlFor=`answer_${i}`;
    let theLableText= document.createTextNode( obj[`answer_${i}`]);
  
    theLable.appendChild(theLableText);
    mainDiv.appendChild(radioInput); 
    mainDiv.appendChild(theLable);
    answerData.appendChild(mainDiv);

}
    }
}
function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
  
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].checked) {
        theChoosenAnswer = answers[i].dataset.answer;
      }
    }
  
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
      
    }
  }
  function handeleBullets(){
    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    let arraySpans = Array.from(bulletsSpan);
    arraySpans.forEach((span,index)=>{
        if(currentIndex===index){
            span.className="on";
        }
    });
  }
  function shoeResult(count){
    if (currentIndex===count){
        quizArea.remove();
        answerData.remove();
        submitButton.remove();
         bulletss.remove();
         if(rightAnswers>(count/2)&& rightAnswers<count){
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
         }
         else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
          } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
          }
          resultsContainer.innerHTML = theResults;
          resultsContainer.style.padding = "10px";
          resultsContainer.style.backgroundColor = "white";
          resultsContainer.style.marginTop = "10px";
    }
  }
  function countdown(duration, count) {
    if (currentIndex < count) {
      let minutes, seconds;
      countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
  
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
  
        countdownElement.innerHTML = `${minutes}:${seconds}`;
  
        if (--duration < 0) {
          clearInterval(countdownInterval);
          submitButton.click();
        }
      }, 1000);
    }
  }