/**
@author : ChatGPT
Remarque : merci !
*/

let timerDuration = 120; // durée par défaut (2 min)
let remainingTime = timerDuration;
let timerInterval = null;

// Mettre à jour l'affichage du temps
function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  document.getElementById("timer").textContent =
    String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
}

// Fonction commune de compte à rebours
function runTimer() {
  timerInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      document.getElementById("beep").play();
    }
  }, 1000);
}

// Démarrer le minuteur (depuis le temps initial choisi)
function startTimer() {
  resetTimer(); // toujours repartir de la valeur initiale
  runTimer();
}

// Pause
function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Reprendre
function resumeTimer() {
  if (!timerInterval && remainingTime > 0) {
    runTimer();
  }
}

// Réinitialiser
function resetTimer() {
  pauseTimer();
  const radios = document.querySelectorAll('input[name="duration"]');
  radios.forEach(radio => {
    if (radio.checked) {
      timerDuration = parseInt(radio.value);
    }
  });
  remainingTime = timerDuration;
  updateDisplay();
}

// Quand on change de durée (radio)
document.querySelectorAll('input[name="duration"]').forEach(radio => {
  radio.addEventListener('change', resetTimer);
});

// Initialisation
resetTimer();
