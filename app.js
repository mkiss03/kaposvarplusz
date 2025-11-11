/* ===========================
   Kaposvár+ Interactive Landing
   =========================== */

(function() {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

      if (!isExpanded) {
        navToggle.setAttribute('aria-label', 'Menü bezárása');
      } else {
        navToggle.setAttribute('aria-label', 'Menü megnyitása');
      }
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-label', 'Menü megnyitása');
      });
    });

    // Close menu on escape
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

    // Flip on click/Enter/Space
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

    // Pointer tilt effect (disabled if reduced motion)
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

        card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
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
    if (!mapElement || typeof L === 'undefined') return;

    // Initialize map centered on Kaposvár
    const map = L.map('map', {
      center: [46.3594, 17.7967],
      zoom: 14,
      zoomControl: true
    });

    // Dark tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
      className: 'map-tiles'
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #F59E0B, #F2C94C);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #0B132B;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    // Points of interest
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

    const markers = {};
    const layerGroups = {
      events: L.layerGroup().addTo(map),
      discounts: L.layerGroup().addTo(map),
      parking: L.layerGroup().addTo(map)
    };

    // Add markers
    pois.forEach((poi, index) => {
      const marker = L.marker(poi.coords, { icon: customIcon })
        .bindPopup(`<strong>${poi.name}</strong><br>${poi.description}`)
        .addTo(layerGroups[poi.layer]);

      marker.on('click', () => showPOICard(poi));
      markers[index] = marker;
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
      poiCard.focus();
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
     Seat Picker
     ========================= */
  function initSeatPicker() {
    const seatGrid = document.getElementById('seatGrid');
    if (!seatGrid) return;

    const ROWS = 12;
    const COLS = 8;
    const PRICE_PER_SEAT = 3200;
    const DISCOUNT_PERCENT = 10;

    const selectedSeats = new Set();
    const occupiedSeats = new Set([
      '2-3', '2-4', '3-5', '5-2', '5-3', '6-6', '7-1', '8-7', '9-4', '10-5', '11-2'
    ]);

    // Generate seats
    for (let row = 1; row <= ROWS; row++) {
      for (let col = 1; col <= COLS; col++) {
        const seatId = `${row}-${col}`;
        const seat = document.createElement('button');
        seat.className = 'seat';
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

        seatGrid.appendChild(seat);
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
      document.getElementById('totalPrice').textContent = `${total.toLocaleString('hu-HU')} Ft`;

      const walletBtn = document.getElementById('walletBtn');
      walletBtn.disabled = count === 0;
    }

    // Discount toggle
    const discountCheckbox = document.getElementById('cardDiscount');
    discountCheckbox.addEventListener('change', updateSummary);

    // Wallet button
    const walletBtn = document.getElementById('walletBtn');
    walletBtn.addEventListener('click', () => {
      if (selectedSeats.size > 0) {
        alert(`Demo: ${selectedSeats.size} jegy hozzáadva a Wallethez!\n\nKiválasztott helyek: ${Array.from(selectedSeats).join(', ')}`);
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
      'Z1': 400, // Ft/óra
      'Z2': 300
    };

    // Load last plate from localStorage
    const savedPlate = localStorage.getItem('kaposvar_plus_plate');
    if (savedPlate) {
      licensePlateInput.value = savedPlate;
    }

    // Format plate input
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
        alert('Kérlek add meg a rendszámot ABC-123 formátumban!');
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
    }

    function extendParking() {
      elapsedSeconds += 30 * 60; // +30 perc
      updateTimer();

      const notification = document.createElement('div');
      notification.textContent = '+30 perc hozzáadva';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #F59E0B, #F2C94C);
        color: #0B132B;
        border-radius: 0.75rem;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: fadeUp 0.3s ease-out;
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'all 0.3s';
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    }

    function stopParking() {
      clearInterval(interval);
      interval = null;

      const zone = zoneSelect.value;
      const rate = ZONE_RATES[zone];
      const hours = elapsedSeconds / 3600;
      const cost = Math.ceil(hours * rate);

      alert(`Parkolás lezárva!\n\nIdőtartam: ${formatTime(elapsedSeconds)}\nDíj: ${cost.toLocaleString('hu-HU')} Ft\n\n(Ez egy demo, valós fizetés nem történik.)`);

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

      timerCost.textContent = `${cost.toLocaleString('hu-HU')} Ft`;
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
      const start = 0;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        element.textContent = current.toLocaleString('hu-HU');

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = target.toLocaleString('hu-HU');
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* =========================
     Scroll Reveal
     ========================= */
  function initScrollReveal() {
    if (prefersReducedMotion) return;

    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(section => {
      section.style.opacity = '0';
      observer.observe(section);
    });
  }

  /* =========================
     FAQ
     ========================= */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const summary = item.querySelector('.faq-question');

      item.addEventListener('toggle', () => {
        if (item.open) {
          // Close other items (accordion behavior)
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
     Initialize All
     ========================= */
  function init() {
    initNavigation();
    initCard();
    lazyLoadMap();
    initSeatPicker();
    initParking();
    initCounters();
    initScrollReveal();
    initFAQ();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
