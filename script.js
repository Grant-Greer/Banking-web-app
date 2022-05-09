'use strict';
var modal = document.querySelector('.modal');
var overlay = document.querySelector('.overlay');
var btnCloseModal = document.querySelector('.btn--close-modal');
var btnsOpenModal = document.querySelectorAll('.btn--show-modal');
var btnScrollTo = document.querySelector('.btn--scroll-to');
var section1 = document.querySelector('#section--1');
var nav = document.querySelector('.nav');
var tabs = document.querySelectorAll('.operations__tab');
var tabsContainer = document.querySelector('.operations__tab-container');
var tabsContent = document.querySelectorAll('.operations__content');
///////////////////////////////////////
// Modal window
var openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};
var closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};
btnsOpenModal.forEach(function (btn) { return btn.addEventListener('click', openModal); });
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});
///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
    var s1coords = section1.getBoundingClientRect();
    console.log(s1coords);
    console.log(e.target.getBoundingClientRect());
    console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
    console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);
    // Scrolling
    section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////
// Page navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
        var id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});
///////////////////////////////////////
// Tabbed component
tabsContainer.addEventListener('click', function (e) {
    var clicked = e.target.closest('.operations__tab');
    // Guard clause
    if (!clicked)
        return;
    // Remove active classes
    tabs.forEach(function (t) { return t.classList.remove('operations__tab--active'); });
    tabsContent.forEach(function (c) { return c.classList.remove('operations__content--active'); });
    // Activate tab
    clicked.classList.add('operations__tab--active');
    // Activate content area
    document
        .querySelector(".operations__content--".concat(clicked.dataset.tab))
        .classList.add('operations__content--active');
});
///////////////////////////////////////
// Menu fade animation
var handleHover = function (e) {
    var _this = this;
    if (e.target.classList.contains('nav__link')) {
        var link_1 = e.target;
        var siblings = link_1.closest('.nav').querySelectorAll('.nav__link');
        var logo = link_1.closest('.nav').querySelector('img');
        siblings.forEach(function (el) {
            if (el !== link_1)
                el.style.opacity = _this;
        });
        logo.style.opacity = this;
    }
};
// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
///////////////////////////////////////
// Sticky navigation: Intersection Observer API
var header = document.querySelector('.header');
var navHeight = nav.getBoundingClientRect().height;
var stickyNav = function (entries) {
    var entry = entries[0];
    // console.log(entry);
    if (!entry.isIntersecting)
        nav.classList.add('sticky');
    else
        nav.classList.remove('sticky');
};
var headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: "-".concat(navHeight, "px")
});
headerObserver.observe(header);
///////////////////////////////////////
// Reveal sections
var allSections = document.querySelectorAll('.section');
var revealSection = function (entries, observer) {
    var entry = entries[0];
    if (!entry.isIntersecting)
        return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};
var sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
});
allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});
// Lazy loading images
var imgTargets = document.querySelectorAll('img[data-src]');
var loadImg = function (entries, observer) {
    var entry = entries[0];
    if (!entry.isIntersecting)
        return;
    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
};
var imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px'
});
imgTargets.forEach(function (img) { return imgObserver.observe(img); });
///////////////////////////////////////
// Slider
var slider = function () {
    var slides = document.querySelectorAll('.slide');
    var btnLeft = document.querySelector('.slider__btn--left');
    var btnRight = document.querySelector('.slider__btn--right');
    var dotContainer = document.querySelector('.dots');
    var curSlide = 0;
    var maxSlide = slides.length;
    // Functions
    var createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML('beforeend', "<button class=\"dots__dot\" data-slide=\"".concat(i, "\"></button>"));
        });
    };
    var activateDot = function (slide) {
        document
            .querySelectorAll('.dots__dot')
            .forEach(function (dot) { return dot.classList.remove('dots__dot--active'); });
        document
            .querySelector(".dots__dot[data-slide=\"".concat(slide, "\"]"))
            .classList.add('dots__dot--active');
    };
    var goToSlide = function (slide) {
        slides.forEach(function (s, i) { return (s.style.transform = "translateX(".concat(100 * (i - slide), "%)")); });
    };
    // Next slide
    var nextSlide = function () {
        if (curSlide === maxSlide - 1) {
            curSlide = 0;
        }
        else {
            curSlide++;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    };
    var prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        }
        else {
            curSlide--;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    };
    var init = function () {
        goToSlide(0);
        createDots();
        activateDot(0);
    };
    init();
    // Event handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')
            prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    });
    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            var slide = e.target.dataset.slide;
            goToSlide(slide);
            activateDot(slide);
        }
    });
};
slider();
