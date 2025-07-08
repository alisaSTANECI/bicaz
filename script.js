const navToggleBtn = document.querySelector('#navToggleBtn');
const nav = document.querySelector('nav.navigation');
const navLinks = document.querySelectorAll('nav .nav-link');

if (navToggleBtn && nav) {
  navToggleBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });
}

// ...restul codului rămâne la fel...

document.addEventListener("DOMContentLoaded", function () {
  // Activare calendar Flatpickr
  flatpickr("#calendar", {
    mode: "range",
    minDate: "today",
    dateFormat: "Y-m-d",
    onClose: function(selectedDates, dateStr, instance) {
      if (selectedDates.length === 2) {
        const diff = (selectedDates[1] - selectedDates[0]) / (1000 * 60 * 60 * 24);
        if (diff < 2) {
          alert("⚠️ Trebuie să selectezi minimum 2 nopți de cazare.");
          instance.clear();
        }
      }
    }
  });

  // Trimitere formular
  const form = document.getElementById("rezervare-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const perioada = document.getElementById("calendar").value;
      const nume = document.getElementById("nume").value;
      const email = document.getElementById("email").value;

      if (!perioada.includes(" to ")) {
        alert("Te rog să selectezi o perioadă validă (minimum 2 nopți).");
        return;
      }

      const date = { perioada, nume, email };

      fetch("http://localhost:3000/rezerva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(date)
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "✅ Rezervarea a fost trimisă!");
        })
        .catch(() => {
          alert("❌ A apărut o eroare la trimiterea rezervării.");
        });
    });
  }
});





