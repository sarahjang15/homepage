const body = document.body;
const nav = document.getElementById("mainNav");
const menuBtn = document.getElementById("mobileMenuBtn");
const themeBtn = document.getElementById("themeBtn");
const pubList = document.getElementById("pubList");
const pubFilterButtons = document.querySelectorAll(".pub-filter");
const toast = document.getElementById("toast");
const revealSections = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-link");

let activePublicationFilter = "all";

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1400);
}

function applyPublicationFilter(filterName) {
  activePublicationFilter = filterName;
  if (!pubList) {
    return;
  }

  pubList.querySelectorAll(".list-item").forEach((item) => {
    const category = item.dataset.pub;
    const visible = filterName === "all" || category === filterName;
    item.style.display = visible ? "flex" : "none";
  });
}

menuBtn?.addEventListener("click", () => {
  const expanded = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", String(!expanded));
  nav.classList.toggle("open", !expanded);
});

themeBtn?.addEventListener("click", () => {
  body.classList.toggle("theme-night");
  const isNight = body.classList.contains("theme-night");
  showToast(isNight ? "Night theme on" : "Day theme on");
});

pubFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    pubFilterButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
    applyPublicationFilter(button.dataset.pubFilter || "all");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealSections.forEach((section) => {
  revealObserver.observe(section);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const activeId = entry.target.id;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    rootMargin: "-35% 0px -50% 0px",
  }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "t" || event.key === "T") {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    body.classList.toggle("theme-night");
    const isNight = body.classList.contains("theme-night");
    showToast(isNight ? "Night theme on" : "Day theme on");
  }
  if (event.key === "Escape") {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  }
});

themeBtn?.addEventListener("mouseenter", () => {
  if (!body.classList.contains("theme-night")) {
    themeBtn.classList.add("pulse");
    window.setTimeout(() => themeBtn.classList.remove("pulse"), 500);
    return;
  }
});

applyPublicationFilter(activePublicationFilter);
