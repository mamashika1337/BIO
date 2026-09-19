const funBtn = document.getElementById('funBtn');
const funText = document.getElementById('funText');

// Список рандомных фраз/приколов
const jokes = [
  "Баг — это не ошибка, это недокументированная фича! 🐛",
  "Ты только что потратил 1 секунду своей жизни на этот клик 👀",
  "Ctrl + Z в реальной жизни не работает, увы ☕",
  "Frontend — это когда двигаешь кнопку 4 часа вправо 🎨",
  "Поздравляю, ты нашел секретное ничего! 🎉"
];

funBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  funText.textContent = jokes[randomIndex];
});