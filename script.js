const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const cursorAura = document.getElementById("cursorAura");
const emberField = document.getElementById("emberField");
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

hamburger.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
    });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const target = document.querySelector(anchor.getAttribute("href"));

        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

const sections = document.querySelectorAll("main section");

function updateActiveNavigation() {
    let current = "home";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 220) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
}

window.addEventListener("scroll", updateActiveNavigation, { passive: true });
updateActiveNavigation();

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.14,
    rootMargin: "0px 0px -80px 0px"
});

document.querySelectorAll(".hero .reveal").forEach((element) => element.classList.add("visible"));
document.querySelectorAll(".reveal:not(.visible)").forEach((element) => revealObserver.observe(element));

function createSpark(target, event) {
    if (!motionAllowed) {
        return;
    }

    const rect = target.getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;

    for (let index = 0; index < 8; index += 1) {
        const spark = document.createElement("span");
        const angle = (Math.PI * 2 * index) / 8;
        const distance = 22 + Math.random() * 30;

        spark.className = "spark";
        spark.style.left = `${startX}px`;
        spark.style.top = `${startY}px`;
        spark.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
        spark.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
        target.appendChild(spark);

        window.setTimeout(() => spark.remove(), 650);
    }
}

document.querySelectorAll(".btn, .project-link, .contact-method").forEach((element) => {
    element.addEventListener("pointerenter", (event) => createSpark(element, event));
});

function spawnEmber() {
    if (!motionAllowed || !emberField) {
        return;
    }

    const ember = document.createElement("span");
    const size = 2 + Math.random() * 4;

    ember.className = "ember";
    ember.style.left = `${Math.random() * 100}%`;
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.setProperty("--drift", `${(Math.random() - 0.5) * 150}px`);
    ember.style.animationDuration = `${5 + Math.random() * 5}s`;
    emberField.appendChild(ember);

    window.setTimeout(() => ember.remove(), 10000);
}

if (motionAllowed) {
    window.setInterval(spawnEmber, 260);
}

window.addEventListener("pointermove", (event) => {
    if (!motionAllowed || !cursorAura) {
        return;
    }

    cursorAura.style.opacity = "1";
    cursorAura.style.left = `${event.clientX}px`;
    cursorAura.style.top = `${event.clientY}px`;
}, { passive: true });

window.addEventListener("pointerleave", () => {
    if (cursorAura) {
        cursorAura.style.opacity = "0";
    }
});
