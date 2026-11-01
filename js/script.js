/* =========================================================
   Discover Mahinog, Camiguin — script.js
   Beginner-friendly, commented JavaScript.
   Handles: mobile nav, active link highlight, smooth scroll,
   scroll-to-top button, gallery lightbox, and reveal animations.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------
     1. MOBILE HAMBURGER NAVIGATION
     Toggles the .open class on the menu + button so the
     CSS can slide the mobile menu in and out.
  --------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      var isOpen = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close the mobile menu whenever a link is tapped
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  /* ---------------------------------------------------
     2. ACTIVE NAVIGATION HIGHLIGHTING
     Compares the current page filename to each nav link's
     href and adds an "active" class to the matching link.
  --------------------------------------------------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    var linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  /* ---------------------------------------------------
     3. SMOOTH SCROLLING FOR ON-PAGE ANCHOR LINKS
     (e.g. "Explore Mahinog" button that jumps to a section)
  --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------------------------------------------------
     3b. HEADER SOLIDIFY-ON-SCROLL
     The header starts transparent, blended into the hero.
     Once the user scrolls past the hero it picks up a solid
     background + shadow so nav links stay readable over the
     lighter page content underneath.
  --------------------------------------------------- */
  var siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    var applyHeaderState = function () {
      if (window.scrollY > 60) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    applyHeaderState();
    window.addEventListener('scroll', applyHeaderState, { passive: true });
  }

  /* ---------------------------------------------------
     4. SCROLL-TO-TOP BUTTON
     Shows the button after scrolling down 400px,
     scrolls smoothly back to top when clicked.
  --------------------------------------------------- */
  var scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------
     5. SCROLL-REVEAL ANIMATION
     Uses IntersectionObserver to fade elements in as the
     user scrolls them into view. Falls back gracefully
     if the browser doesn't support it.
  --------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------------------------------------------
     5c. ANIMATED COUNT-UP NUMBERS (about.html — Population & Demographics)
     Numbers count up from 0 to their data-target value once
     the stat row scrolls into view, with comma formatting.
  --------------------------------------------------- */
  var counterEls = document.querySelectorAll('.counter-num');
  if (counterEls.length) {
    var countingDone = false;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var duration = 1600; // ms
      var startTime = null;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease-out for a natural "settling" finish
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = current.toLocaleString('en-US');
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString('en-US');
        }
      }
      window.requestAnimationFrame(step);
    }

    function startAllCounters() {
      if (countingDone) return;
      countingDone = true;
      counterEls.forEach(function (el) { animateCounter(el); });
    }

    var counterRow = document.querySelector('.counter-row');
    if (counterRow && 'IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startAllCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });
      counterObserver.observe(counterRow);
    } else {
      startAllCounters();
    }
  }

  /* ---------------------------------------------------
     5b. SCHOOL LOCATOR MAP (gallery.html only)
     Renders a real OpenStreetMap (via Leaflet) of Mahinog
     with a marker + popup for each school.
  --------------------------------------------------- */
  var mapEl = document.getElementById('schoolMap');
  if (mapEl && typeof L !== 'undefined') {
    var schoolMap = L.map('schoolMap', { scrollWheelZoom: false });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(schoolMap);

    var schools = [
      { name: 'Mahinog National High School II', location: 'Brgy. Poblacion, Mahinog', lat: 9.1571, lng: 124.7857 },
      { name: 'Tacangon Elementary School', location: 'Tacangon, Poblacion, Mahinog', lat: 9.1552, lng: 124.7845 },
      { name: 'Sixto A. Abao National High School', location: 'Brgy. Hubangon, Mahinog (formerly Mahinog National High School)', lat: 9.1746, lng: 124.7834 },
      { name: 'Hubangon Elementary School', location: 'Brgy. Hubangon, Mahinog', lat: 9.1728, lng: 124.7808 },
      { name: 'Catohugan Elementary School', location: 'Brgy. Catohugan, Mahinog', lat: 9.1859, lng: 124.7819 },
      { name: 'Owakan Elementary School', location: 'Brgy. Owakan, Mahinog', lat: 9.1566, lng: 124.7641 }
    ];

    var schoolMarkers = [];
    schools.forEach(function (s) {
      var marker = L.marker([s.lat, s.lng]).addTo(schoolMap);
      marker.bindPopup('<strong>' + s.name + '</strong>' + s.location);
      schoolMarkers.push(marker);
    });

    var group = L.featureGroup(schoolMarkers);
    schoolMap.fitBounds(group.getBounds().pad(0.3));

    // Allow zoom with scroll once the user has clicked into the map
    schoolMap.on('click', function () { schoolMap.scrollWheelZoom.enable(); });
  }

  /* ---------------------------------------------------
     6. GALLERY FILTER (gallery.html only)
     Shows/hides gallery items based on the selected
     category button.
  --------------------------------------------------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var category = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------------------------------------------------
     7. LIGHTBOX (gallery.html only)
     Clicking a gallery image opens a full-screen preview.
     Prev/Next buttons and Escape key are supported.
  --------------------------------------------------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox && galleryItems.length) {
    var lightboxImg = lightbox.querySelector('img');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var currentIndex = 0;

    // Build a live list every time, so the filter selection is respected
    function getVisibleItems() {
      return Array.prototype.filter.call(galleryItems, function (item) {
        return item.style.display !== 'none';
      });
    }

    function openLightbox(index) {
      var visible = getVisibleItems();
      if (!visible.length) return;
      currentIndex = index;
      var item = visible[currentIndex];
      var img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    function showRelative(step) {
      var visible = getVisibleItems();
      if (!visible.length) return;
      currentIndex = (currentIndex + step + visible.length) % visible.length;
      var img = visible[currentIndex].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () {
        var visible = getVisibleItems();
        var visibleIndex = visible.indexOf(item);
        openLightbox(visibleIndex === -1 ? 0 : visibleIndex);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { showRelative(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showRelative(1); });

    // Close when clicking the dark backdrop (not the image itself)
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showRelative(-1);
      if (e.key === 'ArrowRight') showRelative(1);
    });
  }

  /* ---------------------------------------------------
     8. NEWS PHOTO SLIDESHOW (news.html)
     Each .news-slideshow auto-cycles through its .slide
     images every few seconds, with dot indicators.
  --------------------------------------------------- */
  var slideshows = document.querySelectorAll('.news-slideshow');
  slideshows.forEach(function (slideshow) {
    var slides = slideshow.querySelectorAll('.slide');
    if (slides.length < 2) return; // nothing to slide between

    // Build dot indicators
    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'slide-dots';
    var dots = [];
    slides.forEach(function (_, i) {
      var dot = document.createElement('span');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
    slideshow.appendChild(dotsWrap);

    var current = 0;
    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    setInterval(function () {
      goTo((current + 1) % slides.length);
    }, 4000);
  });

});