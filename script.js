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
let isDragging = false; // 👈 for mouse swipe

/* ------------------ DATA ------------------ */
function generateCats() {
  cats = [];
  for (let i = 0; i < TOTAL_CATS; i++) {
    cats.push(`https://cataas.com/cat?random=${Date.now() + i}`);
  }
}

/* ------------------ UI ------------------ */
function updateProgress() {
  progressFill.style.width =
    ((currentIndex + 1) / TOTAL_CATS) * 100 + "%";
}

function resetCard() {
  catImg.style.transition = "transform 0.3s ease";
  catImg.style.transform = "translateX(0)";
  likeIcon.style.opacity = 0;
  dislikeIcon.style.opacity = 0;
}

function showCat() {
  if (currentIndex >= cats.length) {
    showSummary();
    return;
  }

  loader.style.display = "block";
  resetCard();
  catImg.src = cats[currentIndex];
  updateProgress();
}

catImg.onload = () => {
  loader.style.display = "none";
};

/* ------------------ TOUCH EVENTS (MOBILE) ------------------ */
catImg.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  catImg.style.transition = "none";
});

catImg.addEventListener("touchmove", e => {
  currentX = e.touches[0].clientX;
  handleMove(currentX - startX);
});

catImg.addEventListener("touchend", () => {
  handleEnd();
});

/* ------------------ MOUSE EVENTS (DESKTOP) ------------------ */
catImg.addEventListener("mousedown", e => {
  isDragging = true;
  startX = e.clientX;
  catImg.style.transition = "none";
});

document.addEventListener("mousemove", e => {
  if (!isDragging) return;
  currentX = e.clientX;
  handleMove(currentX - startX);
});

document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  handleEnd();
});

/* ------------------ SHARED LOGIC ------------------ */
function handleMove(deltaX) {
  catImg.style.transform =
    `translateX(${deltaX}px) rotate(${deltaX / 10}deg)`;

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
  let deltaX = currentX - startX;
  catImg.style.transition = "transform 0.4s ease";

  if (deltaX > 100) {
    catImg.style.transform = "translateX(500px) rotate(20deg)";
    likedCats.push(cats[currentIndex]);
  } else if (deltaX < -100) {
    catImg.style.transform = "translateX(-500px) rotate(-20deg)";
  } else {
    resetCard();
    return;
  }

  setTimeout(() => {
    currentIndex++;
    showCat();
  }, 300);
}

/* ------------------ BUTTONS ------------------ */
document.getElementById("likeBtn").onclick = () => {
  likedCats.push(cats[currentIndex]);
  currentIndex++;
  showCat();
};

document.getElementById("dislikeBtn").onclick = () => {
  currentIndex++;
  showCat();
};

/* ------------------ SUMMARY ------------------ */
function showSummary() {
  document.getElementById("app").innerHTML = `
    <div class="summary">
      <h2>You liked ${likedCats.length} cats 🐱</h2>
      <p class="summary-sub">Here are your favourites</p>

      <div class="summary-grid">
        ${likedCats.map(cat => `
          <div class="summary-card">
            <img src="${cat}" alt="Liked cat">
          </div>
        `).join("")}
      </div>

      <button class="restart-btn" onclick="restart()">Restart 🔁</button>
    </div>
  `;
}

function restart() {
  currentIndex = 0;
  likedCats = [];
  generateCats();
  location.reload();
}

/* ------------------ INIT ------------------ */
generateCats();
showCat();
