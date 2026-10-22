/* ---------- Интро-заставка ---------- */

const introEl = document.getElementById("intro");

function initIntro() {
  // Пропускаем заставку при уважении к reduced motion
  const reducer = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducer.matches) {
    introEl.remove();
    return;
  }

  const snow = document.getElementById("introSnow");
  const ctx = snow.getContext("2d");
  const line1 = introEl.querySelector(".intro-line--1 .txt");
  const line2 = introEl.querySelector(".intro-line--2 .txt");
  const line1El = introEl.querySelector(".intro-line--1");
  const line2El = introEl.querySelector(".intro-line--2");
  const textEl = introEl.querySelector(".intro-text");
  const reveal = introEl.querySelector(".intro-reveal");
  const promptEl = introEl.querySelector(".intro-prompt");

  const TEXTS = ["Привет!", "hello!"];

  let W = 0;
  let H = 0;
  let dpr = 1;
  const cx = () => W / 2;
  const cy = () => H / 2;

  const DPR_SAFE = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    dpr = DPR_SAFE;
    W = window.innerWidth;
    H = window.innerHeight;
    snow.width = Math.round(W * dpr);
    snow.height = Math.round(H * dpr);
    snow.style.width = W + "px";
    snow.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // ---------- Снежинки ----------

  let flakes = [];
  let state = "idle"; // idle | snow | converging
  let raf = 0;

  function makeFlake(spawnTopOnly) {
    const count = Math.round((W * H) / 11000);
    const r = (0.8 + Math.random() * 2.2) * (W / H < 1 ? 0.85 : 1);
    return {
      x: Math.random() * W,
      y: spawnTopOnly ? -10 - Math.random() * H * 0.2 : Math.random() * H,
      r,
      vy: 0.6 + Math.random() * 1.5,
      sway: 0.4 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      tw: Math.random() * Math.PI * 2,
      twSpeed: 0.02 + Math.random() * 0.05,
      alpha: 0.45 + Math.random() * 0.5,
      maxR: r,
    };
  }

  function spawnSnow() {
    const count = Math.min(200, Math.round((W * H) / 6500));
    flakes = Array.from({ length: count }, () => makeFlake(true));
  }

  function drawFlake(f) {
    const a = f.alpha * (0.75 + 0.25 * Math.sin(f.tw));
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r * 2.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 220, 240, ${a * 0.28})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
    ctx.fill();
  }

  function render(t) {
    ctx.clearRect(0, 0, W, H);
    const converging = state === "converging";

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.phase += 0.02;
      f.tw += f.twSpeed;

      if (converging) {
        // сведение частиц к центру с лёгким спиральным отклонением
        const dx = cx() - f.x;
        const dy = cy() - f.y;
        const d = Math.hypot(dx, dy);
        const ease = 0.09;
        f.vx = f.vx * 0.9 + (dx * ease) / (d || 1);
        f.vy = f.vy * 0.9 + (dy * ease) / (d || 1);
        f.x += f.vx;
        f.y += f.vy + Math.sin(f.phase * 3 + f.r) * 0.7;
        f.r *= 0.985;
        if (f.r < 0.15) f.r = 0.15;
      } else {
        // свободное падение с покачиванием
        f.y += f.vy;
        f.x += Math.sin(f.phase) * f.sway;
        if (f.y > H + 20) {
          f.y = -20;
          f.x = Math.random() * W;
        }
      }

      if (f.r > 0) drawFlake(f);
    }

    if (state !== "idle") raf = requestAnimationFrame(render);
  }

  // ---------- Печать текста ----------

  function typeLine(el, // строка-элемент
                    txtEl, // span .txt
                    text,
                    done) {
    let i = 0;
    el.classList.add("is-active");
    (function step() {
      if (i <= text.length) {
        txtEl.textContent = text.slice(0, i);
        i++;
        if (i <= text.length) setTimeout(step, 38 + Math.random() * 55);
        else {
          // небольшая пауза на полном слове
          if (done) {
            setTimeout(() => el.classList.remove("is-active"), 220);
            setTimeout(done, 320);
          }
        }
      }
    })();
  }

  function makeFlash() {
    const fl = document.createElement("div");
    fl.className = "intro-flash";
    introEl.appendChild(fl);
    // форсируем анимацию со следующего кадра
    requestAnimationFrame(() => fl.classList.add("is-flashing"));
    return fl;
  }

  // ---------- Оркестрация ----------

  function showPrompt() {
    promptEl.classList.add("is-visible");
  }

  function onIntroClick() {
    introEl.removeEventListener("pointerdown", onIntroClick);
    promptEl.classList.remove("is-visible");
    textEl.classList.remove("is-visible");

    state = "converging";

    // вспышка-концентрация
    setTimeout(() => makeFlash(), 150);

    // раскрытие круга, когда частицы уже стянулись
    setTimeout(() => {
      flakes = [];
      reveal.classList.add("is-revealing");
    }, 620);

    // финальное исчезновение оверлея
    setTimeout(() => {
      introEl.classList.add("intro--done");
      document.querySelector(".card-container").classList.add("is-entered");
    }, 620 + 1150);

    // удаление из DOM после завершения перехода
    setTimeout(() => {
      introEl.remove();
      cancelAnimationFrame(raf);
    }, 620 + 1150 + 820);
  }

  // ---------- Старт ----------

  introEl.classList.add("intro--active");

  setTimeout(() => {
    textEl.classList.add("is-visible");
    line1El.classList.add("is-active");

    typeLine(line1El, line1, TEXTS[0], () => {
      typeLine(line2El, line2, TEXTS[1], () => {
        // текст напечатан — стартует снег
        state = "snow";
        spawnSnow();
        raf = requestAnimationFrame(render);

        // клик доступен только после появления снега
        introEl.addEventListener("pointerdown", onIntroClick, { once: true });
        setTimeout(showPrompt, 1600);
      });
    });
  }, 350);
}

if (introEl) initIntro();

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