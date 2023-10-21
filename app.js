const questionContainer = document.querySelector(".question-container");
const timeContainer = document.querySelector(".time-container");
const timerEl = document.querySelector(".time");
const highScoresElement = document.querySelector(".high-scores");
const highScoresButton = document.querySelector(".high-scores-button");
let questions = [];
let currentQuestionIndex = 0;
let remainingTime = 15;
let totalScore = 0;
let timerId;
let isAnswered = false;
const highScores = JSON.parse(localStorage.getItem("scores")) || [];

function start(event) {
  event.target.parentElement.remove();
  highScoresButton.addEventListener("click", displayHighScores);
  function fetchQuestions() {
    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => {
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
      questionContainer.appendChild(highScoresElement);
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
    // currentQuestionIndex++;
    // renderQuestion();
  }

  function nextQuestion(event) {
    if (currentQuestionIndex >= 9) {
      console.log(event.target);
      event.target.remove();
      console.log("equals");
      gameOver();
    } else if (isAnswered) {
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
    clearInterval(timerId); // Clear any previous intervals

    if (sub && remainingTime - 5 >= 0) {
      remainingTime = remainingTime - 5;
    } else {
      clearInterval(timerId);
    }

    if (remainingTime > 0) {
      timerId = setInterval(() => {
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
    // openButton = document.querySelector(".open-form-button");

    // if (!openButton) {
    const nextButton = document.querySelector(".next-button");
    if (nextButton) {
      nextButton.remove();
    }
    setTimeout(() => {
      const scoreInfoElement = document.createElement("p");
      scoreInfoElement.textContent = "your score is: " + totalScore;
      scoreInfoElement.classList.add("score-info");
      questionContainer.appendChild(scoreInfoElement);
      const openFormButton = document.createElement("button");
      openFormButton.classList.add("open-form-button");
      openFormButton.textContent = "save my score";
      openFormButton.addEventListener("click", openForm);
      questionContainer.appendChild(openFormButton);
    }, 300);
    // }
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

  function displayHighScores(event) {
    const parentContainer = event.target.parentElement;
    const scoresContainer = document.createElement("ul");
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", (e) => {
      e.target.parentElement.remove();
    });
    scoresContainer.classList.add("scores-container");
    scoresContainer.appendChild(closeBtn);
    highScores.forEach((highScore, index) => {
      const scoreElement = document.createElement("li");
      const scoreName = highScore.name;
      const scoreLastName = highScore.lastName;
      const scoreValue = highScore.score;
      scoreElement.textContent =
        scoreName + " " + scoreLastName + " " + scoreValue;
      scoresContainer.appendChild(scoreElement);
    });
    parentContainer.appendChild(scoresContainer);
  }

  function openForm() {
    const saveScoreContainer = document.querySelector(".save-score-overlay");
    const saveScoreForm = saveScoreContainer.querySelector("form");
    const closeFormBtn = saveScoreForm.querySelector(".close-form");
    closeFormBtn.addEventListener("click", (e) => {
      e.target.parentElement.parentElement.classList.remove("overlay-active");
    });

    saveScoreContainer.classList.add("overlay-active");
    saveScoreContainer.querySelector(".score").textContent = totalScore;
    saveScoreForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = saveScoreForm.querySelector("input[name='name']");
      const lastNameInput = saveScoreForm.querySelector(
        "input[name='lastName']"
      );
      if (nameInput.value && lastNameInput.value) {
        highScores.push({
          name: nameInput.value,
          lastName: lastNameInput.value,
          score: totalScore,
        });
        localStorage.setItem("scores", JSON.stringify(highScores));
      }
      setTimeout(() => {
        saveScoreContainer.classList.remove("overlay-active");
      }, 300);
    });
  }
}
