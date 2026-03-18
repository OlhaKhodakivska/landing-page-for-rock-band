document.addEventListener('DOMContentLoaded', () => {
    // Elements for Pop-up and form
    const popup = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const popupMsg = document.getElementById('popup-msg');
    const closeBtn = document.getElementById('popup-close-btn');
    const contactForm = document.getElementById('main-contact-form');

    // --- MENU ELEMENTS ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Function to show Pop-up
    const showPopup = (title, message) => {
        popupTitle.textContent = title;
        popupMsg.textContent = message;
        popup.classList.remove('popup-hidden');
    };

    // --- HAMBURGER MENU LOGIC ---
    if (hamburger && navMenu) {
        // Open/Close menu on icon click
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click (useful for mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Close Pop-up
    closeBtn.addEventListener('click', () => popup.classList.add('popup-hidden'));
    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.classList.add('popup-hidden');
    });

    // Handle "Book Ticket" buttons
    document.querySelectorAll('.order-ticket, .cta-button, .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Check: if it's an anchor link (like in Hero), let it work normally
            if (btn.tagName === 'A' && btn.getAttribute('href').startsWith('#')) return;

            e.preventDefault();
            showPopup('Booking', 'You clicked to book a ticket. Our manager will contact you shortly!');
        });
    });

    // Validation and GET request
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();

            if (name.length < 2) {
                showPopup('Input Error', 'Please enter a valid name (minimum 2 characters)');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showPopup('Input Error', 'Please enter a valid email (e.g., name@mail.com)');
                return;
            }

            const params = new URLSearchParams({
                user_name: name,
                user_email: email,
                source: 'landing_contact_form'
            });

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/posts?${params.toString()}`);
                if (response.ok) {
                    showPopup('Success!', `Thank you, ${name}! We have received your request.`);
                    contactForm.reset();
                } else {
                    throw new Error();
                }
            } catch (error) {
                showPopup('Error', 'Failed to send the request. Please check your internet connection or try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
});