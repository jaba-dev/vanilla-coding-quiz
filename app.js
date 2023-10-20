const questionContainer = document.querySelector(".question-container");
const timeContainer = document.querySelector(".time-container");
const timerEl = document.querySelector(".time");
let questions = [];
let currentQuestionIndex = 0;
let remainingTime = 20;
let totalScore = 0;
let timerId;

function fetchQuestions() {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      console.log(data.questions);
      questions = shuffleArray(data.questions).slice(0, 10);
      renderQuestion();
      timerEl.textContent = remainingTime;
      countDown();
    });
}
fetchQuestions();

function renderQuestion() {
  if (currentQuestionIndex <= 9) {
    questionContainer.innerHTML = "";
    questionContainer.appendChild(timeContainer);
    let currentQuestion = questions[currentQuestionIndex];
    const { question, options } = currentQuestion;
    const questionElement = document.createElement("div");

    questionElement.classList.add("question-element");
    const questionNumberElement = document.createElement("h2");
    questionNumberElement.textContent =
      "Question: " + (currentQuestionIndex + 1);
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
      optionElement.addEventListener("click", checkanswer);
      optionsElement.appendChild(optionElement);
    });
    const nextButton = document.createElement("button");
    nextButton.textContent = "next";
    nextButton.classList.add("next-button");
    nextButton.addEventListener("click", nextQuestion);
    questionContainer.appendChild(questionElement);
    questionContainer.appendChild(optionsElement);
    questionContainer.appendChild(nextButton);
  } else {
    clearInterval(timerId);
    gameOver();
  }
}

function checkanswer(event) {
  const id = Number(event.target.getAttribute("id"));
  console.log(id);
  event.target.style.backgroundColor = "#6142a3";
  event.target.parentElement.replaceWith(
    event.target.parentElement.cloneNode(true)
  );
  if (id === questions[currentQuestionIndex].correctAnswer) {
    console.log("correct");
    totalScore++;
  } else {
    console.log("incorrect");
    countDown("sub");
  }
  // currentQuestionIndex++;
  // renderQuestion();
}

function nextQuestion(event) {
  console.log(remainingTime);
  if (remainingTime > 0) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    event.target.replaceWith(event.target.cloneNode(true));
    gameOver();
  }
}

function countDown(sub) {
  clearInterval(timerId); // Clear any previous intervals

  if (sub && remainingTime - 5 >= 0) {
    remainingTime = remainingTime - 5;
  } else {
    clearInterval(timerId);
    console.log("game over");
  }

  if (remainingTime > 0) {
    console.log("yes");
    timerId = setInterval(() => {
      console.log("original interval");
      remainingTime = remainingTime - 1;
      timerEl.textContent = remainingTime;

      if (remainingTime <= 0) {
        clearInterval(timerId); // Clear the interval when the countdown reaches 0
        gameOver();
      }
    }, 1000);
  } else {
    gameOver();
  }
}

function gameOver() {
  openButton = document.querySelector(".open-form-button");
  if (!openButton) {
    setTimeout(() => {
      alert("your score is: " + totalScore);
      const openFormButton = document.createElement("button");
      openFormButton.classList.add("open-form-button");
      openFormButton.textContent = "save my score";
      openFormButton.addEventListener("click", openForm);
      questionContainer.appendChild(openFormButton);
    }, 300);
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap arr[i] and arr[j]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function openForm() {
  console.log("opening form");
  const saveScoreContainer = document.querySelector(".save-score-overlay");
  const saveScoreForm = saveScoreContainer.querySelector("form");
  saveScoreForm.addEventListener("submit", saveScore);
  saveScoreContainer.classList.add("overlay-active");
  saveScoreContainer.querySelector(".score").textContent = totalScore;
}

function saveScore(event) {
  event.preventDefault();
  console.log(event.target);
}
