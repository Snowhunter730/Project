// Vokabeln definieren
let vocabulary = [
  { question: "Hund", answer: "dog" },
  { question: "Katze", answer: "cat" },
  { question: "Haus", answer: "house" },
  // Weitere Vokabeln hier hinzufügen
];

let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let resultDiv = document.getElementById("result");
let questionDiv = document.getElementById("question");
let answerInput = document.getElementById("answer");
let counterDiv = document.getElementById("counter");
let customVocabularyList = document.getElementById("customVocabularyList");
let isCustomVocabularyVisible = false;

// Funktion zum Überprüfen der Antwort
function checkAnswer() {
  let currentVocabulary = vocabulary[currentIndex];
  let userAnswer = answerInput.value.trim().toLowerCase();

  if (userAnswer === currentVocabulary.answer) {
    resultDiv.innerHTML = "Richtig!";
    correctCount++;
  } else {
    resultDiv.innerHTML =
      "Falsch. Die richtige Antwort lautet: " + currentVocabulary.answer;
    wrongCount++;
  }

  // Zähler aktualisieren
  counterDiv.innerHTML =
    "Richtig: " + correctCount + " | Falsch: " + wrongCount;

  // Nächste Vokabel anzeigen
  currentIndex++;
  if (currentIndex < vocabulary.length) {
    showQuestion();
  } else {
    questionDiv.innerHTML = "Vokabeltraining abgeschlossen.";
    answerInput.style.display = "none";
  }

  answerInput.value = "";
  saveProgress(); // Fortschritt speichern
}

// Funktion zum Anzeigen der nächsten Frage
function showQuestion() {
  let currentVocabulary = vocabulary[currentIndex];
  questionDiv.innerHTML = currentVocabulary.question;
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
      questionDiv.innerHTML = "Vokabeltraining abgeschlossen.";
      answerInput.style.display = "none";
    }

    counterDiv.innerHTML =
      "Richtig: " + correctCount + " | Falsch: " + wrongCount;
  }
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
    let listItem = document.createElement("div");
    listItem.textContent =
      vocabulary[i].question + " - " + vocabulary[i].answer;
    customVocabularyList.appendChild(listItem);
    listItem.id = "vocabulary-" + i;
    customVocabularyList.appendChild(listItem);
    let deleteItem = document.createElement("button");
    deleteItem.textContent = "X";
    deleteItem.classList = "deleteButton";
    deleteItem.setAttribute("onclick", "deleteVocabulary(" + i + ")");
    listItem.appendChild(deleteItem);
  }
}

// Funktion zum Zurücksetzen des Zählers
function resetProgress() {
  currentIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  answerInput.style.display = "inline-block";
  resultDiv.innerHTML = "";
  counterDiv.innerHTML =
    "Richtig: " + correctCount + " | Falsch: " + wrongCount;
  saveProgress();
}

function deleteVocabulary(index) {
  vocabulary.splice(index, 1);
  showCustomVocabulary();
  saveProgress();
}

// Ersten Fortschritt laden oder erste Frage anzeigen
loadProgress();
showQuestion();
