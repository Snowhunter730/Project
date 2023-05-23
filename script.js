// Vokabeln definieren
let vocabulary = [
  { question: "Hund", answer: "dog" },
  { question: "Katze", answer: "cat" },
  { question: "Haus", answer: "house" },
  // Weitere Vokabeln hier hinzufügen
];



let currentIndex = 0;
let correctCount = 0;
let totalCount = vocabulary.length; // Gesamtzahl der Vokabeln
let resultDiv = document.getElementById("result");
let questionDiv = document.getElementById("question");
let answerInput = document.getElementById("answer");
let counterDiv = document.getElementById("counter");
let btnCheck = document.getElementById("btn-check");
let btnNextVocabulary = document.getElementById("btn-next-vocabulary");

let customVocabularyList = document.getElementById("customVocabularyList");
let isCustomVocabularyVisible = false;
let wrongAnswers = []; // Liste für falsche Antworten

// Funktion zum Überprüfen der Antwort und Farbwechsel
function checkAnswer() {
  let currentVocabulary = vocabulary[currentIndex];
  let userAnswer = answerInput.value.trim().toLowerCase();

  let questionWord = document.getElementById("question");
  if (userAnswer === currentVocabulary.answer) {
    questionWord.classList = "question question-color-green";
    correctCount++;
  } else {
    questionWord.classList = "question question-color-red";
    wrongAnswers.push(currentVocabulary); // Falsche Antwort zur Liste hinzufügen
  }

  

  // eingabefeld und check button nicht anzeigen

  answerInput.style.display = "none";
  btnCheck.style.display = "none";

  // next vocabulary button anzeigen

  btnNextVocabulary.style.display = "inline-block";

  saveProgress(); // Fortschritt speichern
}

// Nächste Vokabel anzeigen

function nextQuestion() {
  // hintergrund farbe neutralisieren
  let questionWord = document.getElementById("question");
  questionWord.classList = "question";

  currentIndex++;

  // next vocabulary button entfernen
  btnNextVocabulary.style.display = "none";

  // eingabefeld und checkbutton anzeigen

  answerInput.style.display = "inline-block";
  btnCheck.style.display = "inline-block";

  if (currentIndex < vocabulary.length) {
    if (wrongAnswers.length > 0) {
      let nextIndex = vocabulary.length; // Index am Ende der Vokabelliste
      let wrongVocabulary = wrongAnswers.shift(); // Erste falsche Antwort aus der Liste entfernen
      vocabulary.splice(nextIndex, 0, wrongVocabulary); // Falsche Antwort am Ende der Liste wieder einfügen
    } 
    showQuestion();
  } else {
    questionDiv.innerHTML = "Training completed.";
    answerInput.style.display = "none";
    addWrongAnswersToVocabulary(); // Falsche Antworten zum Vokabeltrainer hinzufügen
  }
  answerInput.value = "";
  updateCounter();
  saveProgress(); // Fortschritt speichern
}
// Funktion zum Hinzufügen der falschen Antworten zum Vokabeltrainer
function addWrongAnswersToVocabulary() {
  vocabulary = vocabulary.concat(wrongAnswers);
  totalCount = vocabulary.length;
}


// Funktion zum Anzeigen der nächsten Frage
function showQuestion() {
  let currentVocabulary = vocabulary[currentIndex];
  questionDiv.innerHTML = currentVocabulary.question;
}
// Funktion zum Aktualisieren des Zählers
function updateCounter() {
  counterDiv.innerHTML = correctCount + " / " + totalCount;
}

// Funktion zum Speichern des Fortschritts im Local Storage
function saveProgress() {
  localStorage.setItem("currentIndex", currentIndex.toString());
  localStorage.setItem("correctCount", correctCount.toString());
  localStorage.setItem("wrongCount", wrongCount.toString());
  localStorage.setItem("vocabulary", JSON.stringify(vocabulary));
}

// Funktion zum Laden des Fortschritts aus dem Local Storage
function loadProgress() {
  let savedIndex = localStorage.getItem("currentIndex");
  let savedCorrectCount = localStorage.getItem("correctCount");
  let savedWrongCount = localStorage.getItem("wrongCount");
  let savedVocabulary = localStorage.getItem("vocabulary");

  if (
    savedIndex !== null &&
    savedCorrectCount !== null &&
    savedWrongCount !== null &&
    savedVocabulary !== null
  ) {
    currentIndex = parseInt(savedIndex);
    correctCount = parseInt(savedCorrectCount);
    wrongCount = parseInt(savedWrongCount);
    vocabulary = JSON.parse(savedVocabulary);

    if (currentIndex < vocabulary.length) {
      showQuestion();
    } else {
      questionDiv.innerHTML = "Training completed";
      answerInput.style.display = "none";
    }

   updateCounter();
  }
}
// Funktion zum Neustarten des Vokabeltrainers
function restartVocabularyTrainer() {
  currentIndex = 0;
  correctCount = 0;
  answerInput.style.display = "inline-block";
  resultDiv.innerHTML = "";
  updateCounter();
  saveProgress();
  showQuestion();
}


// Funktion zum Hinzufügen eigener Vokabeln
function addCustomVocabulary() {
  let newQuestion = document.getElementById("newQuestion").value.trim();
  let newAnswer = document.getElementById("newAnswer").value.trim();

  if (newQuestion !== "" && newAnswer !== "") {
    let isDuplicate = vocabulary.some(function (vocab) {
      return (
        vocab.question.toLowerCase() === newQuestion.toLowerCase() ||
        vocab.answer.toLowerCase() === newAnswer.toLowerCase()
      );
    });

    if (isDuplicate) {
      alert("Vokabel existiert bereits");
    } else {
      vocabulary.push({ question: newQuestion, answer: newAnswer });
      document.getElementById("newQuestion").value = "";
      document.getElementById("newAnswer").value = "";
      saveProgress();
      updateCounter(); // Zähler aktualisieren
      showCustomVocabulary();
    }
  }
}

// Funktion zum Anzeigen oder Ausblenden der eigenen Vokabelliste
function toggleCustomVocabulary() {
  isCustomVocabularyVisible = !isCustomVocabularyVisible;

  if (isCustomVocabularyVisible) {
    customVocabularyList.style.display = "flex";
    showCustomVocabulary();
  } else {
    customVocabularyList.style.display = "none";
  }
}

// Funktion zum Anzeigen der eigenen Vokabeln

function showCustomVocabulary() {
  customVocabularyList.innerHTML = "";

  for (let i = 0; i < vocabulary.length; i++) {
    let listItem = document.createElement("li");
    listItem.textContent =
      vocabulary[i].question + " - " + vocabulary[i].answer;
    customVocabularyList.appendChild(listItem);
    listItem.id = "vocabulary-" + i;
    customVocabularyList.appendChild(listItem);

    let deleteItem = document.createElement("button");
    deleteItem.textContent = "-";
    deleteItem.classList = "deleteButton";
    deleteItem.setAttribute(
      "onclick",
      "deleteVocabulary(" + i + "), listIsEmpty()"
    );
    listItem.appendChild(deleteItem);
  }
}

// funktion zum checken ob vocabulary liste is empty -> dann schliessen

function listIsEmpty() {
  if (customVocabularyList.innerHTML === "") {
    customVocabularyList.style.display = "none";
  }
}

// Funktion zum Zurücksetzen des Zählers
function resetProgress() {
  currentIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  answerInput.style.display = "inline-block";
  resultDiv.innerHTML = "";
  counterDiv.innerHTML = correctCount + " | " + vocabulary.length;
  saveProgress();
}

function deleteVocabulary(index) {
  vocabulary.splice(index, 1);
  showCustomVocabulary();
  counterDiv.innerHTML = correctCount + " | " + vocabulary.length;
  saveProgress();
}
document
  .getElementById("restartButton")
  .addEventListener("click", restartVocabularyTrainer);


// Ersten Fortschritt laden oder erste Frage anzeigen
loadProgress();
showQuestion();
