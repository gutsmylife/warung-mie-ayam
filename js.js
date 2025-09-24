/* --- Force redirect to HTTPS if not secure (client-side fallback) --- */
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  // Jangan redirect saat pengembangan di localhost
  try {
    location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
  } catch (e) {
    // jika ada error, abaikan (lebih aman daripada loop)
    console.warn('Redirect to HTTPS gagal:', e);
  }
}

/* --- Rating Bintang yang dapat diakses --- */
const starsContainer = document.getElementById("stars");
const ratingValue = document.getElementById("ratingValue");
let rating = 0;

for (let i = 1; i <= 5; i++) {
  const span = document.createElement("span");
  span.textContent = "★";
  span.tabIndex = 0; // fokus keyboard
  span.dataset.value = i;
  span.role = "radio";
  span.setAttribute('aria-checked', 'false');
  span.addEventListener("click", () => {
    rating = i;
    updateStars();
    ratingValue.textContent = `Rating Anda: ${rating}`;
  });
  span.addEventListener("keydown", (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      rating = i;
      updateStars();
      ratingValue.textContent = `Rating Anda: ${rating}`;
    }
  });
  starsContainer.appendChild(span);
}

function updateStars() {
  const stars = starsContainer.querySelectorAll("span");
  stars.forEach(star => {
    const active = Number(star.dataset.value) <= rating;
    star.classList.toggle("active", active);
    star.setAttribute('aria-checked', active ? 'true' : 'false');
  });
}

/* --- Komentar dengan sanitasi XSS --- */
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const commentList = document.getElementById("commentList");

function sanitizeInput(str) {
  // Mengganti karakter berbahaya — lebih aman daripada innerHTML langsung
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

commentForm.addEventListener("submit", e => {
  e.preventDefault();
  let text = commentInput.value.trim();
  if (!text) return;

  const safe = sanitizeInput(text);

  const li = document.createElement("li");
  li.textContent = safe; // menggunakan textContent agar aman
  commentList.appendChild(li);
  commentInput.value = "";
});

/* --- Opsional: pastikan link utama menggunakan https (lihat index.html untuk default) --- */
const mainLink = document.getElementById('mainLink');
if (mainLink && mainLink.href && !mainLink.href.startsWith('https://')) {
  // jika user lupa mengubah, force ke https
  try {
    const u = new URL(mainLink.href, location.href);
    u.protocol = 'https:';
    mainLink.href = u.href;
  } catch (err) {
    // abaikan jika URL tidak valid
  }
}
