/* ==========================================================
   script.js
   Interaktivitas untuk index.html + styles.css
   Portofolio - Rifki Laroyba
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
    initMenuToggle();
    initSmoothScroll();
    initProjectFilter();
    initLightbox();
    initContactFormValidation();

    console.log('script.js dimuat: semua fitur berhasil diinisialisasi.');
});

/* ----------------------------------------------------------
   LANGKAH 3a: Toggle menu navigasi (hamburger)
---------------------------------------------------------- */
function initMenuToggle() {
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const navLinks = document.getElementById('primary-navigation');

    if (!toggleBtn || !navLinks) {
        console.warn('Elemen menu toggle tidak ditemukan di halaman.');
        return;
    }

    toggleBtn.addEventListener('click', function () {
        toggleMenu(toggleBtn, navLinks);
    });
}

function toggleMenu(toggleBtn, navLinks) {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
}

/* ----------------------------------------------------------
   LANGKAH 3b: Pengguliran mulus untuk tautan navigasi dalam halaman
---------------------------------------------------------- */
function initSmoothScroll() {
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const navLinks = document.getElementById('primary-navigation');

    navAnchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            const targetId = anchor.getAttribute('href');
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                event.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Tutup menu mobile setelah salah satu tautan diklik
                if (navLinks && navLinks.classList.contains('open')) {
                    toggleMenu(toggleBtn, navLinks);
                }
            }
        });
    });
}

/* ----------------------------------------------------------
   LANGKAH 4a: Filter proyek berdasarkan kategori
---------------------------------------------------------- */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!filterButtons.length) {
        console.warn('Tombol filter proyek tidak ditemukan di halaman.');
        return;
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const category = button.getAttribute('data-category');
            filterProjects(category);

            filterButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });
}

function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(function (card) {
        const matches = category === 'all' || card.getAttribute('data-category') === category;
        card.style.display = matches ? '' : 'none';
    });

    console.log('Filter proyek diterapkan:', category);
}

/* ----------------------------------------------------------
   LANGKAH 4b: Efek lightbox untuk gambar proyek
---------------------------------------------------------- */
function initLightbox() {
    const images = document.querySelectorAll('.project-card img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.getElementById('lightbox-close');

    if (!lightbox || !lightboxImage || !closeBtn) {
        console.warn('Elemen lightbox tidak ditemukan di halaman.');
        return;
    }

    images.forEach(function (img) {
        img.addEventListener('click', function () {
            openLightbox(img.src, img.alt);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });

    function openLightbox(src, alt) {
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
    }
}

/* ----------------------------------------------------------
   LANGKAH 5: Validasi formulir kontak + umpan balik real-time
---------------------------------------------------------- */
function initContactFormValidation() {
    const form = document.querySelector('#contact form');

    if (!form) {
        console.warn('Formulir kontak tidak ditemukan di halaman.');
        return;
    }

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const statusEl = document.getElementById('form-status');
    const fields = [nameInput, emailInput, messageInput];

    // Validasi saat pengguna keluar dari kolom, dan saat mengetik ulang jika sedang invalid
    fields.forEach(function (field) {
        field.addEventListener('blur', function () {
            validateField(field);
        });
        field.addEventListener('input', function () {
            if (field.classList.contains('invalid')) {
                validateField(field);
            }
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const results = fields.map(validateField);
        const isFormValid = results.every(Boolean);

        if (isFormValid) {
            statusEl.textContent = 'Terima kasih! Pesan Anda berhasil dikirim.';
            statusEl.className = 'form-status success';
            console.log('Formulir valid, data siap dikirim ke server:', {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            });
            form.reset();
        } else {
            statusEl.textContent = 'Periksa kembali kolom yang ditandai sebelum mengirim.';
            statusEl.className = 'form-status error';
            console.warn('Formulir belum valid, pengiriman dibatalkan.');
        }
    });
}

function validateField(field) {
    const errorEl = document.getElementById(field.id + '-error');
    let message = '';

    if (field.validity.valueMissing) {
        message = 'Kolom ini wajib diisi.';
    } else if (field.type === 'email' && field.validity.typeMismatch) {
        message = 'Masukkan alamat email yang valid.';
    } else if (field.tagName.toLowerCase() === 'textarea' && field.value.trim().length < 10) {
        message = 'Pesan minimal 10 karakter.';
    }

    const isValid = message === '';

    field.classList.toggle('invalid', !isValid);
    if (errorEl) {
        errorEl.textContent = message;
    }

    return isValid;
}

/* ----------------------------------------------------------
   LANGKAH 6: Catatan pengujian & debugging
   - Buka DevTools (F12) > tab Console lalu coba: klik tombol hamburger,
     klik tautan navigasi, klik tombol filter, klik gambar proyek, dan
     kirim formulir kosong/salah — setiap aksi mencetak log di atas.
   - Error umum "X is not defined": pastikan script.js dimuat SETELAH
     seluruh HTML (tag <script> ada tepat sebelum </body>) dan setiap id
     yang dipakai di sini (menu-toggle-btn, primary-navigation, lightbox,
     name/email/message, form-status) sama persis dengan id di index.html.
   - Error umum "Cannot read properties of null": berarti
     querySelector/getElementById tidak menemukan elemennya — cek kembali
     ejaan id/class terkait di index.html.
---------------------------------------------------------- */
