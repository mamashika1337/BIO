const funBtn = document.getElementById("funBtn");
const funText = document.getElementById("funText");

const jokes = [
  "Баг — это не ошибка, это недокументированная фича! 🐛",
  "Ты только что потратил 1 секунду своей жизни на этот клик 👀",
  "Ctrl + Z в реальной жизни не работает, увы ☕",
  "Frontend — это когда двигаешь кнопку 4 часа вправо 🎨",
  "Поздравляю, ты нашел секретное ничего! 🎉",
  "Твой код работает. Не трогай его. 🧨",
  "Кофе — это компилятор мыслей в код. ☕",
];

let lastIndex = -1;

function pickJokeIndex() {
  if (jokes.length < 2) return 0;
  let idx;
  do {
    idx = Math.floor(Math.random() * jokes.length);
  } while (idx === lastIndex);
  return idx;
}

funBtn.addEventListener("click", () => {
  const idx = pickJokeIndex();
  lastIndex = idx;

  funText.classList.remove("is-visible");
  void funText.offsetWidth; // сброс анимации перед новым текстом
  funText.textContent = jokes[idx];
  funText.classList.add("is-visible");
});

/* ---------- Проекты ---------- */

const projectsBtn = document.getElementById("projectsBtn");
const projectsList = document.getElementById("projectsList");
const projectsCount = document.getElementById("projectsCount");

// Счётчик подхватывает реальное количество карточек
projectsCount.textContent = String(
  projectsList.querySelectorAll(".project-card").length
);

projectsBtn.addEventListener("click", () => {
  const isOpen = projectsBtn.getAttribute("aria-expanded") === "true";
  projectsBtn.setAttribute("aria-expanded", String(!isOpen));
  projectsList.hidden = isOpen;
});

// Закрытие по Esc — возвращает фокус на кнопку
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && projectsBtn.getAttribute("aria-expanded") === "true") {
    projectsBtn.setAttribute("aria-expanded", "false");
    projectsList.hidden = true;
    projectsBtn.focus();
  }
});