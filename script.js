// Product Data
const products = [
    {
        id: 1,
        name: "Crimson Roses",
        category: "roses",
        description: "Fresh and fragrant crimson roses to brighten your day.",
        price: 5.00,
        image: "https://ts2.mm.bing.net/th?id=OIP.QY3kB2tE79OWsw7NZcmdtwHaJ4&pid=15.1",
    },
    {
        id: 2,
        name: "Sunlit Tulips",
        category: "tulips",
        description: "Bright yellow tulips perfect for a sunny atmosphere.",
        price: 5.00,
        image: "https://ts4.mm.bing.net/th?id=OIP.MWnwmMKKRviQQh_RhObgwwHaJ4&pid=15.1",
    },
    {
        id: 3,
        name: "Elegant Lilies",
        category: "lilies",
        description: "White lilies that bring elegance and purity to any room.",
        price: 5.00,
        image: "https://ts3.mm.bing.net/th?id=OIP.h6Xpt2vyqRyj2FbJikwmcgHaJ4&pid=15.1",
    },
    {
        id: 4,
        name: "Pink Garden Roses",
        category: "roses",
        description: "Soft pink roses with a delicate, romantic aroma.",
        price: 5.00,
        image: "https://tse3.mm.bing.net/th/id/OIP.3_qbdOQNnw_7JMNW1ELk-AHaLH?pid=ImgDet&w=203&h=304&c=7",
    },
    {
        id: 5,
        name: "Purple Tulips",
        category: "tulips",
        description: "Deep purple tulips that express creativity and charm.",
        price: 5.00,
        image: "https://tse1.mm.bing.net/th/id/OIP._2J0LJrngtH9JAzF7Y8J3AHaJQ?pid=ImgDet&w=203&h=253&c=7",
    },
    {
        id: 6,
        name: "Orange Lilies",
        category: "lilies",
        description: "Vibrant orange lilies for an energetic and lively vibe.",
        price: 5.00,
        image: "https://tse2.mm.bing.net/th/id/OIP.zjHf3120-TeVF_c_1A7a7gHaHa?pid=ImgDet&w=203&h=203&c=7",
    }
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
        filteredProducts = products.filter(p => p.category === filterCategory);
    }

    filteredProducts.forEach(p => {
        const card = document.createElement('article');
        card.className = 'product-card fade-in';
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${p.name}, price $${p.price.toFixed(2)}`);

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
        price.textContent = `$${p.price.toFixed(2)}`;

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