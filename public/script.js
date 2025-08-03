const toggleBtn = document.getElementById("mode-toggle");

if (toggleBtn) {
  // Toggle night mode
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    toggleBtn.textContent = document.body.classList.contains("night-mode") ? "☀️" : "🌙";

    // Optional: Remember mode across reload
    localStorage.setItem("theme", document.body.classList.contains("night-mode") ? "night" : "dark");
  });

  // Load saved mode on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "night") {
    document.body.classList.add("night-mode");
    toggleBtn.textContent = "☀️";
  }
}

/*loading*/


