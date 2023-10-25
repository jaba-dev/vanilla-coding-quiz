const questionContainer = document.querySelector(".question-container");
const timeContainer = document.querySelector(".time-container");
const timerEl = document.querySelector(".time");
let questions = [];
let currentQuestionIndex = 0;
let remainingTime = 60;
let totalScore = 0;
let timerId;
let isAnswered = false;

function fetchQuestions() {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      questions = shuffleArray(data.questions).slice(0, 10);
      renderQuestion();
      countDown();
    });
}
fetchQuestions();

function renderQuestion() {
  questionContainer.innerHTML = "";

  questionContainer.appendChild(timeContainer);
  let currentQuestion = questions[currentQuestionIndex];
  const { question, options } = currentQuestion;
  const questionElement = document.createElement("div");

  questionElement.classList.add("question-element");
  const questionNumberElement = document.createElement("h2");
  questionNumberElement.textContent = "Question: " + (currentQuestionIndex + 1);
  const questionTextElement = document.createElement("p");
  questionTextElement.textContent = question;
  questionElement.appendChild(questionNumberElement);
  questionElement.appendChild(questionTextElement);
  const optionsElement = document.createElement("div");
  optionsElement.classList.add("options-container");

  options.forEach((option, index) => {
    const optionElement = document.createElement("button");
    optionElement.textContent = index + 1 + ". " + option;
    optionElement.id = index;
    optionElement.addEventListener("click", checkAnswer);
    optionsElement.appendChild(optionElement);
  });
  const nextButton = document.createElement("button");
  nextButton.textContent = "next";
  nextButton.classList.add("next-button");
  nextButton.addEventListener("click", nextQuestion);
  questionContainer.appendChild(questionElement);
  questionContainer.appendChild(optionsElement);
  if (currentQuestionIndex <= 8) {
    questionContainer.appendChild(nextButton);
  }
}

function checkAnswer(event) {
  isAnswered = true;
  const id = Number(event.target.getAttribute("id"));

  event.target.style.backgroundColor = "#6142a3";
  event.target.parentElement.replaceWith(
    event.target.parentElement.cloneNode(true)
  );
  if (id === questions[currentQuestionIndex].correctAnswer) {
    totalScore++;
  } else {
    countDown("sub");
  }

  if (currentQuestionIndex >= 9) {
    gameOver();
  }
}

function nextQuestion(event) {
  if (isAnswered) {
    isAnswered = false;
    if (remainingTime > 0) {
      currentQuestionIndex++;
      renderQuestion();
    } else {
      event.target.replaceWith(event.target.cloneNode(true));
      gameOver();
    }
  }
}

function countDown(sub) {
  clearInterval(timerId);

  if (sub && remainingTime - 5 >= 0) {
    remainingTime = remainingTime - 5;
  }

  if (remainingTime > 0) {
    timerId = setInterval(() => {
      remainingTime = remainingTime - 1;
      timerEl.textContent = remainingTime;

      if (remainingTime <= 0) {
        gameOver();
      }
    }, 1000);
  } else {
    gameOver();
  }
}

function gameOver() {
  setTimeout(() => {
    clearInterval(timerId);

    const scoreInfoElement = document.createElement("p");
    scoreInfoElement.textContent = "your score is: " + totalScore;
    scoreInfoElement.classList.add("score-info");
    questionContainer.appendChild(scoreInfoElement);
    const openFormButton = document.createElement("button");
    openFormButton.classList.add("open-form-button");
    openFormButton.textContent = "save my score";
    questionContainer.appendChild(openFormButton);
  }, 300);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
