const body = document.body;
const nav = document.getElementById("mainNav");
const menuBtn = document.getElementById("mobileMenuBtn");
const themeBtn = document.getElementById("themeBtn");
const pulseBtn = document.getElementById("pulseBtn");
const heroCard = document.querySelector(".hero");
const itemForm = document.getElementById("itemForm");
const itemInput = document.getElementById("itemInput");
const itemList = document.getElementById("itemList");
const filterButtons = document.querySelectorAll(".filter-btn");
const countLabel = document.getElementById("itemCount");
const toast = document.getElementById("toast");

let activeFilter = "all";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1400);
}

function updateCount() {
  const total = itemList.querySelectorAll(".list-item").length;
  countLabel.textContent = `${total} item${total === 1 ? "" : "s"}`;
}

function applyFilter(filter) {
  activeFilter = filter;
  itemList.querySelectorAll(".list-item").forEach((item) => {
    const isDone = item.dataset.status === "done";
    const visible =
      filter === "all" || (filter === "done" && isDone) || (filter === "active" && !isDone);
    item.style.display = visible ? "flex" : "none";
  });
}

function createItem(label) {
  const li = document.createElement("li");
  li.className = "list-item";
  li.dataset.status = "active";
  li.innerHTML = `
    <button class="check-btn" aria-label="Mark ${label} done">○</button>
    <span></span>
    <button class="btn btn-ghost btn-sm remove-btn" aria-label="Remove ${label}">Remove</button>
  `;
  li.querySelector("span").textContent = label;
  return li;
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

pulseBtn?.addEventListener("click", () => {
  heroCard.classList.remove("pulse");
  window.requestAnimationFrame(() => {
    heroCard.classList.add("pulse");
  });
});

itemForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const label = itemInput.value.trim();
  if (!label) {
    showToast("Please enter an item name.");
    return;
  }

  const newItem = createItem(label);
  itemList.appendChild(newItem);
  itemInput.value = "";
  updateCount();
  applyFilter(activeFilter);
  showToast(`Added: ${label}`);
});

itemList?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const item = target.closest(".list-item");
  if (!item) {
    return;
  }

  if (target.classList.contains("check-btn")) {
    const done = item.dataset.status === "done";
    item.dataset.status = done ? "active" : "done";
    target.textContent = done ? "○" : "✓";
    applyFilter(activeFilter);
    return;
  }

  if (target.classList.contains("remove-btn")) {
    const text = item.querySelector("span")?.textContent || "Item";
    item.remove();
    updateCount();
    showToast(`Removed: ${text}`);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
    applyFilter(button.dataset.filter || "all");
  });
});

updateCount();
applyFilter(activeFilter);
