// Product Data
const products = [
    {
        id: 1,
        name: "Red Tulips and Pink-and-White Lilies",
        category: ["tulips", "lilies"],
        description: "Fresh and fragrant crimson roses to brighten your day.",
        price: "Price varies",
        image: "img/Red_roses.jpg",
    },
    {
        id: 2,
        name: "Dahlia",
        category: "dahlias",
        description: "Elegant and pure, this handcrafted white dahlia symbolizes grace and sincerity — a timeless gift for heartfelt occasions.",
        price: "Price varies",
        image: "img/Dahlia.jpg",
    },
    {
        id: 3,
        name: "Gerbera",
        category: "gerberas",
        description: "A vibrant medley of pastel gerberas handcrafted from soft felt — this bouquet brings cheerful charm and gentle elegance to any occasion.",
        price: "Price varies",
        image: "img/Gerbera.jpg",
    },
    {
        id: 4,
        name: "Lily",
        category: "lilies",
        description: "Warm and refined, these handcrafted caramel lilies bring an earthy elegance — perfect for heartfelt moments and timeless gestures.",
        price: "Price varies",
        image: "img/Lily.jpg",
    },
    {
        id: 5,
        name: "Satin Roses",
        category: "roses",
        description: "A bouquet of deep red satin roses, radiating passion and elegance — perfect for anniversaries, special dates, or simply saying 'I love you'.",
        price: "Price varies",
        image: "img/Satin_roses.jpg",
    },
    {
        id: 6,
        name: "Blue Forget-Me-Not Bunch",
        category: "Forget-Me-Nots",
        description: "Tiny and sweet, these handcrafted blue forget-me-nots add a touch of innocence and whimsy to any arrangement or craft project",
        price: "Price varies",
        image: "img/Blue_Forget-Me-Not_Bunch.jpg",
    },
];

// Ratings data (persisted in localStorage)
let ratings = JSON.parse(localStorage.getItem('flowerRatings')) || {};

// Elements
const productGrid = document.querySelector('.product-grid');
const filterButtons = document.querySelectorAll('.filter-button');
const hamburger = document.querySelector('.hamburger');
const nav = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
});

// Functions for star ratings
function createStarRating(id, currentRating) {
    const container = document.createElement('div');
    container.className = 'star-rating';
    container.setAttribute('role', 'radiogroup');
    container.setAttribute('aria-label', `Rating for product ${id}`);

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.setAttribute('role', 'radio');
        star.setAttribute('aria-checked', (i === currentRating).toString());
        star.setAttribute('tabindex', '0');
        star.dataset.value = i;
        star.innerHTML = '&#9733;'; // star symbol

        if (i <= currentRating) {
            star.classList.add('filled');
        }

        // Hover effect
        star.addEventListener('mouseenter', () => {
            const stars = container.querySelectorAll('.star');
            stars.forEach((s, idx) => {
                s.classList.toggle('filled', idx < i);
            });
        });

        star.addEventListener('mouseleave', () => {
            const stars = container.querySelectorAll('.star');
            stars.forEach((s, idx) => {
                s.classList.toggle('filled', idx < currentRating);
            });
        });

        // Click to rate
        star.addEventListener('click', () => {
            ratings[id] = i;
            localStorage.setItem('flowerRatings', JSON.stringify(ratings));
            currentRating = i;
            updateAriaChecked(container, i);
        });

        // Keyboard support
        star.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                star.click();
            }
            else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                let nextStar = star.nextElementSibling || container.firstElementChild;
                nextStar.focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                let prevStar = star.previousElementSibling || container.lastElementChild;
                prevStar.focus();
            }
        });

        container.appendChild(star);
    }
    return container;
}

function updateAriaChecked(container, ratingValue) {
    const stars = container.querySelectorAll('.star');
    stars.forEach((star, idx) => {
        star.setAttribute('aria-checked', (idx + 1) === ratingValue ? 'true' : 'false');
    });
}

function renderProducts(filterCategory = 'all') {
    productGrid.innerHTML = '';
    let filteredProducts = products;

    if (filterCategory !== 'all') {
        filteredProducts = products.filter(p => {
            if (Array.isArray(p.category)) {
                return p.category.includes(filterCategory);
            }
            return p.category === filterCategory;
        });
    }

    filteredProducts.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card fade-in';
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${p.name}, price ${p.price}`);

    const img = document.createElement('div');
    img.className = 'product-image';
    img.style.backgroundImage = `url(${p.image})`;
    img.setAttribute('role', 'img');
    img.setAttribute('aria-label', p.name + ' flower image');

    const info = document.createElement('div');
    info.className = 'product-info';

    const name = document.createElement('h3');
    name.className = 'product-name';
    name.textContent = p.name;

    const desc = document.createElement('p');
    desc.className = 'product-description';
    desc.textContent = p.description;

    const price = document.createElement('p');
    price.className = 'product-price';

    try {
        price.textContent = typeof p.price === 'number'
            ? `$${p.price.toFixed(2)}`
            : p.price || 'Price unavailable';
    } catch (err) {
        price.textContent = 'Price unavailable';
        console.error('Error rendering price for product:', p, err);
    }

    const ratingValue = ratings[p.id] || 0;
    const rating = createStarRating(p.id, ratingValue);

    info.appendChild(name);
    info.appendChild(desc);
    info.appendChild(price);
    info.appendChild(rating);

    card.appendChild(img);
    card.appendChild(info);

    productGrid.appendChild(card);
});

    observeFadeIn();
}

// Filter buttons logic
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        renderProducts(button.getAttribute('data-filter'));
    });
});

// Animation on scroll for fade-in elements
function observeFadeIn() {
    const faders = document.querySelectorAll('.fade-in');
    const options = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    faders.forEach(fader => {
        observer.observe(fader);
    });
}
observeFadeIn();

renderProducts();

// Testimonials slider logic
const testimonialCards = document.getElementById('testimonialCards');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const totalTestimonials = testimonialCards.children.length;
let testimonialIndex = 0;

function updateTestimonialPosition() {
    const shift = testimonialIndex * -320;
    testimonialCards.style.transform = `translateX(${shift}px)`;
}

prevBtn.addEventListener('click', () => {
    testimonialIndex = (testimonialIndex - 1 + totalTestimonials) % totalTestimonials;
    updateTestimonialPosition();
});

nextBtn.addEventListener('click', () => {
    testimonialIndex = (testimonialIndex + 1) % totalTestimonials;
    updateTestimonialPosition();
});

prevBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        prevBtn.click();
    }
});
nextBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nextBtn.click();
    }
});

// Contact form logic
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', e => {
    e.preventDefault();
    formMessage.textContent = '';
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !subject || !message) {
        formMessage.style.color = 'red';
        formMessage.textContent = 'Please fill in all required fields.';
        return;
    }
    if (!validateEmail(email)) {
        formMessage.style.color = 'red';
        formMessage.textContent = 'Please enter a valid email address.';
        return;
    }
    // Simulate form submission (no backend)
    formMessage.style.color = 'green';
    formMessage.textContent = `Thank you, ${name}! Your message has been received. We will get back to you soon.`;
    contactForm.reset();
});

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}