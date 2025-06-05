document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.program-card, .update-item');

  cards.forEach(card => {
    card.classList.add('aos-hidden');
    card.setAttribute('data-aos', 'fade-down');
  });

  AOS.init({
    duration: 800,
    once: true
  });

  const shown = new Set();
  const observer = new IntersectionObserver((entries) => {
    const visible = [];

    entries.forEach(entry => {
      if (entry.isIntersecting && !shown.has(entry.target)) {
        visible.push(entry.target);
        shown.add(entry.target);
        observer.unobserve(entry.target);
      }
    });

    visible
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
      .forEach((card, index) => {
        setTimeout(() => {
          card.classList.remove('aos-hidden');
          AOS.refreshHard();

          setTimeout(() => {
            card.style.transform = "";
          }, 900);

        }, index * 70);
      });

  }, { threshold: 0.3 });

  cards.forEach(card => observer.observe(card));
});
