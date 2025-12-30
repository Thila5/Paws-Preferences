const TOTAL_CATS = 10;
let cats = [];
let likedCats = [];
let currentIndex = 0;

const catImg = document.getElementById("cat-img");
const loader = document.getElementById("loader");
const likeIcon = document.getElementById("like");
const dislikeIcon = document.getElementById("dislike");
const progressFill = document.getElementById("progress-fill");

let startX = 0;
let currentX = 0;
let isDragging = false;

/* Generate unique cat URLs */
function generateCats() {
  cats = [];
  for (let i = 0; i < TOTAL_CATS; i++) {
    cats.push(`https://cataas.com/cat?nocache=${Math.random()}_${Date.now()}_${i}`);
  }
}

function updateProgress() {
  progressFill.style.width = ((currentIndex + 1) / TOTAL_CATS) * 100 + "%";
}

function showCat() {
  if (currentIndex >= cats.length) {
    showSummary();
    return;
  }

  loader.style.display = "block";
  catImg.style.opacity = 0;
  catImg.style.transform = "translateX(0)";
  likeIcon.style.opacity = 0;
  dislikeIcon.style.opacity = 0;

  catImg.src = "";
  setTimeout(() => {
    catImg.src = cats[currentIndex];
  }, 50);

  updateProgress();
}

catImg.onload = () => {
  loader.style.display = "none";
  catImg.style.opacity = 1;
};

catImg.onerror = () => {
  cats[currentIndex] = `https://cataas.com/cat?fallback=${Date.now()}`;
  showCat();
};

/* ===== TOUCH EVENTS (MOBILE) ===== */
catImg.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  isDragging = true;
  catImg.style.transition = "none";
});

catImg.addEventListener("touchmove", e => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX;
  handleMove(currentX - startX);
});

catImg.addEventListener("touchend", () => {
  handleEnd();
});

/* ===== MOUSE EVENTS (DESKTOP) ===== */
catImg.addEventListener("mousedown", e => {
  startX = e.clientX;
  isDragging = true;
  catImg.style.transition = "none";
});

document.addEventListener("mousemove", e => {
  if (!isDragging) return;
  currentX = e.clientX;
  handleMove(currentX - startX);
});

document.addEventListener("mouseup", () => {
  if (isDragging) handleEnd();
});

/* ===== SHARED LOGIC ===== */
function handleMove(deltaX) {
  catImg.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 10}deg)`;

  if (deltaX > 50) {
    likeIcon.style.opacity = 1;
    dislikeIcon.style.opacity = 0;
  } else if (deltaX < -50) {
    dislikeIcon.style.opacity = 1;
    likeIcon.style.opacity = 0;
  } else {
    likeIcon.style.opacity = 0;
    dislikeIcon.style.opacity = 0;
  }
}

function handleEnd() {
  isDragging = false;
  catImg.style.transition = "transform 0.4s ease";

  const deltaX = currentX - startX;

  if (deltaX > 120) {
    catImg.style.transform = "translateX(500px) rotate(20deg)";
    likedCats.push(cats[currentIndex]);
    nextCat();
  } else if (deltaX < -120) {
    catImg.style.transform = "translateX(-500px) rotate(-20deg)";
    nextCat();
  } else {
    catImg.style.transform = "translateX(0)";
  }

  likeIcon.style.opacity = 0;
  dislikeIcon.style.opacity = 0;
}

function nextCat() {
  setTimeout(() => {
    currentIndex++;
    showCat();
  }, 300);
}

/* BUTTONS */
document.getElementById("likeBtn").onclick = () => {
  likedCats.push(cats[currentIndex]);
  currentIndex++;
  showCat();
};

document.getElementById("dislikeBtn").onclick = () => {
  currentIndex++;
  showCat();
};

function showSummary() {
  document.getElementById("app").innerHTML = `
    <div class="summary">
      <h2>You liked ${likedCats.length} cats 😻</h2>

      <div class="grid summary-grid">
        ${likedCats.map(cat => `<img src="${cat}" loading="lazy">`).join("")}
      </div>

      <div class="summary-footer">
        <button id="restartBtn" class="restart-btn">Restart 🔁</button>
      </div>
    </div>
  `;

  document.getElementById("restartBtn").addEventListener("click", restart);
}

function restart() {
  window.location.href = window.location.pathname;
}


generateCats();
showCat();
