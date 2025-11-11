/* =============================
   Kaposvár+ Professional JavaScript
   ============================= */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================
     Utility Functions
     ========================= */

  function createToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function addRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('hu-HU').format(num);
  }

  /* =========================
     Scroll Progress Bar
     ========================= */

  function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.transform = `scaleX(${progress / 100})`;
    });
  }

  /* =========================
     Particle Background
     ========================= */

  function initParticles() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 201, 76, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  /* =========================
     Navigation
     ========================= */

  function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-label', isExpanded ? 'Menü megnyitása' : 'Menü bezárása');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-label', 'Menü megnyitása');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-label', 'Menü megnyitása');
      }
    });
  }

  /* =========================
     City Card (3D Flip + Tilt)
     ========================= */

  function initCard() {
    const card = document.getElementById('cityCard');
    if (!card) return;

    let isFlipped = false;

    function flipCard() {
      isFlipped = !isFlipped;
      card.classList.toggle('flipped', isFlipped);
      card.setAttribute('aria-pressed', isFlipped);
    }

    card.addEventListener('click', flipCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flipCard();
      }
    });

    // Tilt effect
    if (!prefersReducedMotion) {
      const cardContainer = card.closest('.card-container');

      cardContainer.addEventListener('mousemove', (e) => {
        const rect = cardContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      cardContainer.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }

    // Generate QR Code
    const qrContainer = document.getElementById('qrcode');
    if (qrContainer && typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: 'kaposvar-plus-demo://card/KAPO-0123-4567',
        width: 72,
        height: 72,
        colorDark: '#0B132B',
        colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
      });
    }

    // Generate Barcode
    const barcodeElement = document.getElementById('barcode');
    if (barcodeElement && typeof JsBarcode !== 'undefined') {
      JsBarcode(barcodeElement, 'KAPO01234567', {
        format: 'CODE128',
        width: 2,
        height: 60,
        displayValue: false,
        background: 'transparent',
        lineColor: '#0B132B'
      });
    }
  }

  /* =========================
     Interactive Map
     ========================= */

  function initMap() {
    const mapElement = document.getElementById('map');
    const mapOverlay = document.getElementById('mapOverlay');
    const mapContainer = document.getElementById('mapContainer');

    if (!mapElement || typeof L === 'undefined') return;

    let map = null;
    let isMapActive = false;

    // Click to activate map
    mapOverlay.addEventListener('click', () => {
      mapOverlay.classList.add('hidden');
      isMapActive = true;
      if (!map) {
        initializeMap();
      }
    });

    // Deactivate when clicking outside
    document.addEventListener('click', (e) => {
      if (isMapActive && !mapContainer.contains(e.target)) {
        mapOverlay.classList.remove('hidden');
        isMapActive = false;
      }
    });

    function initializeMap() {
      map = L.map('map', {
        center: [46.3594, 17.7967],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #F59E0B, #F2C94C);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #0B132B;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const pois = [
        {
          name: 'Tourinform Iroda',
          coords: [46.3594, 17.7967],
          description: 'Információs központ, programajánlatok, Kaposvár+ kártya ügyfélszolgálat.',
          meta: '10% kedvezmény városi túrákra',
          layer: 'discounts'
        },
        {
          name: 'Csiky Gergely Színház',
          coords: [46.3610, 17.7980],
          description: 'Jegyvásárlás kártyás kedvezménnyel, online ülésválasztás.',
          meta: '−15% kártyásoknak',
          layer: 'events'
        },
        {
          name: 'Fő tér',
          coords: [46.3585, 17.7955],
          description: 'Központi rendezvénytér, piacok, fesztiválok helyszíne.',
          meta: 'Hétvégente farmers market',
          layer: 'events'
        },
        {
          name: 'KAPO-Z1 Parkolózóna',
          coords: [46.3600, 17.7990],
          description: 'Belváros zóna. Pay-by-plate rendszer, 400 Ft/óra.',
          meta: 'Szabad: 12 / 45 férőhely',
          layer: 'parking'
        },
        {
          name: 'KAPO-Z2 Parkolózóna',
          coords: [46.3575, 17.7940],
          description: 'Városközpont zóna. Hosszabb parkolás, 300 Ft/óra.',
          meta: 'Szabad: 28 / 60 férőhely',
          layer: 'parking'
        }
      ];

      const layerGroups = {
        events: L.layerGroup().addTo(map),
        discounts: L.layerGroup().addTo(map),
        parking: L.layerGroup().addTo(map)
      };

      pois.forEach(poi => {
        const marker = L.marker(poi.coords, { icon: customIcon })
          .bindPopup(`<strong>${poi.name}</strong><br>${poi.description}`)
          .addTo(layerGroups[poi.layer]);

        marker.on('click', () => showPOICard(poi));
      });

      // POI card
      const poiCard = document.getElementById('poiCard');
      const poiTitle = document.getElementById('poi-title');
      const poiDescription = document.getElementById('poi-description');
      const poiMeta = document.getElementById('poi-meta');
      const poiClose = poiCard.querySelector('.poi-close');

      function showPOICard(poi) {
        poiTitle.textContent = poi.name;
        poiDescription.textContent = poi.description;
        poiMeta.textContent = poi.meta;
        poiCard.classList.remove('hidden');
      }

      poiClose.addEventListener('click', () => {
        poiCard.classList.add('hidden');
      });

      // Layer controls
      const layerButtons = document.querySelectorAll('.map-control-btn');
      layerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const layer = btn.dataset.layer;
          const isActive = btn.classList.contains('active');

          if (isActive) {
            map.removeLayer(layerGroups[layer]);
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
          } else {
            map.addLayer(layerGroups[layer]);
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
          }
        });
      });
    }
  }

  /* =========================
     Lazy Load Map
     ========================= */

  function lazyLoadMap() {
    const mapSection = document.getElementById('map-section');
    if (!mapSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initMap();
          observer.disconnect();
        }
      });
    }, { rootMargin: '100px' });

    observer.observe(mapSection);
  }

  /* =========================
     3D Theater Seat Picker
     ========================= */

  function initSeatPicker() {
    const theaterSeats = document.getElementById('theaterSeats');
    if (!theaterSeats) return;

    const ROWS = 12;
    const COLS = 8;
    const PRICE_PER_SEAT = 3200;
    const DISCOUNT_PERCENT = 10;

    const selectedSeats = new Set();
    const occupiedSeats = new Set([
      '2-3', '2-4', '3-5', '5-2', '5-3', '6-6', '7-1', '8-7', '9-4', '10-5', '11-2', '11-7'
    ]);

    // Generate seats
    for (let row = 1; row <= ROWS; row++) {
      for (let col = 1; col <= COLS; col++) {
        const seatId = `${row}-${col}`;
        const seat = document.createElement('button');
        seat.className = 'theater-seat';
        seat.dataset.seat = seatId;
        seat.setAttribute('role', 'gridcell');
        seat.setAttribute('aria-label', `Sor ${row}, Szék ${col}`);
        seat.setAttribute('aria-selected', 'false');

        if (occupiedSeats.has(seatId)) {
          seat.classList.add('occupied');
          seat.disabled = true;
          seat.setAttribute('aria-label', `Sor ${row}, Szék ${col} (foglalt)`);
        } else {
          seat.addEventListener('click', () => toggleSeat(seatId, seat));
        }

        theaterSeats.appendChild(seat);
      }
    }

    function toggleSeat(seatId, seatElement) {
      if (selectedSeats.has(seatId)) {
        selectedSeats.delete(seatId);
        seatElement.classList.remove('selected');
        seatElement.setAttribute('aria-selected', 'false');
      } else {
        selectedSeats.add(seatId);
        seatElement.classList.add('selected');
        seatElement.setAttribute('aria-selected', 'true');
      }
      updateSummary();
    }

    function updateSummary() {
      const count = selectedSeats.size;
      const discountCheckbox = document.getElementById('cardDiscount');
      const hasDiscount = discountCheckbox.checked;

      let total = count * PRICE_PER_SEAT;
      if (hasDiscount) {
        total = total * (1 - DISCOUNT_PERCENT / 100);
      }

      document.getElementById('selectedCount').textContent = count;
      document.getElementById('totalPrice').textContent = `${formatNumber(total)} Ft`;

      const walletBtn = document.getElementById('walletBtn');
      walletBtn.disabled = count === 0;
    }

    const discountCheckbox = document.getElementById('cardDiscount');
    discountCheckbox.addEventListener('change', updateSummary);

    const walletBtn = document.getElementById('walletBtn');
    walletBtn.addEventListener('click', () => {
      if (selectedSeats.size > 0) {
        // Confetti effect
        if (typeof confetti !== 'undefined') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#F2C94C', '#FFDC6B']
          });
        }

        createToast(`${selectedSeats.size} jegy hozzáadva a Wallethez! 🎉`, 'success');

        // Reset seats
        setTimeout(() => {
          selectedSeats.clear();
          document.querySelectorAll('.theater-seat.selected').forEach(seat => {
            seat.classList.remove('selected');
            seat.setAttribute('aria-selected', 'false');
          });
          updateSummary();
        }, 2000);
      }
    });

    updateSummary();
  }

  /* =========================
     Parking Widget
     ========================= */

  function initParking() {
    const licensePlateInput = document.getElementById('licensePlate');
    const zoneSelect = document.getElementById('parkingZone');
    const startBtn = document.getElementById('startParking');
    const extendBtn = document.getElementById('extendParking');
    const stopBtn = document.getElementById('stopParking');
    const statusBadge = document.getElementById('statusBadge');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerCost = document.getElementById('timerCost');
    const parkingTimer = document.getElementById('parkingTimer');

    if (!startBtn) return;

    let interval = null;
    let startTime = null;
    let elapsedSeconds = 0;

    const ZONE_RATES = {
      'Z1': 400,
      'Z2': 300
    };

    const savedPlate = localStorage.getItem('kaposvar_plus_plate');
    if (savedPlate) {
      licensePlateInput.value = savedPlate;
    }

    licensePlateInput.addEventListener('input', (e) => {
      let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (value.length > 3) {
        value = value.slice(0, 3) + '-' + value.slice(3, 6);
      }
      e.target.value = value;
    });

    startBtn.addEventListener('click', startParking);
    extendBtn.addEventListener('click', extendParking);
    stopBtn.addEventListener('click', stopParking);

    function startParking() {
      const plate = licensePlateInput.value.trim();
      if (!plate || plate.length < 7) {
        createToast('Kérlek add meg a rendszámot ABC-123 formátumban!', 'error');
        licensePlateInput.focus();
        return;
      }

      localStorage.setItem('kaposvar_plus_plate', plate);

      startTime = Date.now();
      elapsedSeconds = 0;

      startBtn.classList.add('hidden');
      extendBtn.classList.remove('hidden');
      stopBtn.classList.remove('hidden');
      parkingTimer.classList.remove('hidden');

      statusBadge.textContent = 'Aktív';
      statusBadge.className = 'status-badge status-active';

      licensePlateInput.disabled = true;
      zoneSelect.disabled = true;

      interval = setInterval(updateTimer, 1000);
      updateTimer();

      createToast('Parkolás elindítva! ⏱️', 'success');
    }

    function extendParking() {
      elapsedSeconds += 30 * 60;
      updateTimer();
      createToast('+30 perc hozzáadva! ⏰', 'success');
    }

    function stopParking() {
      clearInterval(interval);
      interval = null;

      const zone = zoneSelect.value;
      const rate = ZONE_RATES[zone];
      const hours = elapsedSeconds / 3600;
      const cost = Math.ceil(hours * rate);

      createToast(`Parkolás lezárva! Időtartam: ${formatTime(elapsedSeconds)}, Díj: ${formatNumber(cost)} Ft`, 'success');

      resetParking();
    }

    function resetParking() {
      startBtn.classList.remove('hidden');
      extendBtn.classList.add('hidden');
      stopBtn.classList.add('hidden');
      parkingTimer.classList.add('hidden');

      statusBadge.textContent = 'Várakozik';
      statusBadge.className = 'status-badge status-idle';

      licensePlateInput.disabled = false;
      zoneSelect.disabled = false;

      elapsedSeconds = 0;
      startTime = null;
    }

    function updateTimer() {
      if (!startTime) return;

      elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

      timerDisplay.textContent = formatTime(elapsedSeconds);

      const zone = zoneSelect.value;
      const rate = ZONE_RATES[zone];
      const hours = elapsedSeconds / 3600;
      const cost = Math.ceil(hours * rate);

      timerCost.textContent = `${formatNumber(cost)} Ft`;
    }

    function formatTime(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  }

  /* =========================
     KPI Counters
     ========================= */

  function initCounters() {
    const kpiValues = document.querySelectorAll('.kpi-value[data-target]');
    if (kpiValues.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    kpiValues.forEach(el => observer.observe(el));

    function animateCounter(element, target) {
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        element.textContent = formatNumber(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = formatNumber(target);
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* =========================
     Hero Stats Counter
     ========================= */

  function initHeroStats() {
    const heroStats = document.querySelectorAll('.hero-stats .stat-value[data-countup]');

    heroStats.forEach(stat => {
      const target = parseInt(stat.dataset.countup);
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);

        stat.childNodes[0].textContent = formatNumber(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          stat.childNodes[0].textContent = formatNumber(target);
        }
      }

      requestAnimationFrame(update);
    });
  }

  /* =========================
     Ripple Effect on Buttons
     ========================= */

  function initRippleEffect() {
    document.querySelectorAll('.ripple').forEach(button => {
      button.addEventListener('click', addRippleEffect);
    });
  }

  /* =========================
     Scroll Reveal
     ========================= */

  function initScrollReveal() {
    if (prefersReducedMotion) return;

    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });
  }

  /* =========================
     FAQ Accordion
     ========================= */

  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          faqItems.forEach(other => {
            if (other !== item && other.open) {
              other.open = false;
            }
          });
        }
      });
    });
  }

  /* =========================
     Parallax Effect
     ========================= */

  function initParallax() {
    if (prefersReducedMotion) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  /* =========================
     Initialize All
     ========================= */

  function init() {
    initScrollProgress();
    initParticles();
    initNavigation();
    initCard();
    lazyLoadMap();
    initSeatPicker();
    initParking();
    initCounters();
    initHeroStats();
    initRippleEffect();
    initScrollReveal();
    initFAQ();
    initParallax();

    console.log('%cKaposvár+ 🚀', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #F59E0B, #F2C94C); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('Digitális városi kártya | Modern • Interaktív • Professzionális');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
