"use-script";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// IMPLEMENTING SMOOTH SCROLLING
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();

  // Scroll To (OLD WAY!)
  //   window.scrollTo({
  //     left: s1coords.left + window.pageXOffset,
  //     top: s1coords.top + window.pageYOffset,
  //     behavior: "smooth",
  // });

  section1.scrollIntoView({ behavior: "smooth" });
});

// PAGE NAVIGATION
// document.querySelectorAll(".nav__link").forEach(function(el){
//   el.addEventListener(`click`, function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   })
// })

// PAGE NAVIGATION - EVENT DELEGATION

// Add event listener to common parent element
//  Determine what element Originated from the event
document.querySelector(".nav__links").addEventListener("click", function (e) {
  console.log(e.target);
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute("href");
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// TABBED COMPONENTS
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  // console.log(clicked);

  // Guard Clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Activate Tab
  clicked.classList.add("operations__tab--active");

  // Activate Content Area
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//  MENU FADE ANIMATION
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// IMPLEMENTING STICKY NAVIGATION BAR
// const initialCoords = section1.getBoundingClientRect();
// // console.log(initialCoords);

// window.addEventListener("scroll", function (e) {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add(`sticky`);
//   } else {
//     nav.classList.remove(`sticky`);
//   }
// });

// IMPLEMENTING STICKY NAVIGATION BAR - INTERSECTION OBSERVER API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// };

// const obsOptions = {
//   root: null,
//   thershold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect();

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`,
});
headerObserver.observe(header);

// Reveal Sections
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = (entries, observer) => {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

imgTargets.forEach((img) => imgObserver.observe(img));

// SLIDER
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();



// // // // LECTURES // // // // // //

// SELECTING ELEMENTS
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector(`.header`);
// const allSections = document.querySelectorAll(`.section`);
// // console.log(allSections);

// document.getElementById(`section--1`);
// const allButtons = document.getElementsByTagName(`button`);
// console.log(allButtons);

// console.log(document.getElementsByClassName("btn"));

// CREATING AND INSERTING ELEMENTS
// .insertAdjacentHTML

// const message = document.createElement(`div`);
// message.classList.add(`cookie-message`);
// message.textContent = `We use cookies for improved functionalities and analytics.`;
// message.innerHTML = `We use cookies for improved functionalities and analytics. <button class="btn btn--close-cookie">Got it!</button>`;

// // header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// DELETE ELEMENTS
// document
//   .querySelector(".btn--close-cookie")
//   .addEventListener("click", function () {
//     // message.remove();
//     message.parentElement.removeChild(message);
//   });

// // Styles
// message.style.backgroundColor = "#37383d";
// message.style.width = "120%";

// console.log(message.style.height);
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).width);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + `px`;

// document.documentElement.style.setProperty(`--color-primary`, `skyblue`);

// // Attributes
// const logo = document.querySelector(".nav__logo");
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// console.log(logo.getAttribute("src"));

// // Data Attributes
// console.log(logo.dataset.versionNumber);

// Classes
// logo.classList.add("c");
// logo.classList.remove("c");
// logo.classList.contains("C");
// logo.classList.toggle("C");

// IMPLEMENTING SMOOTH SCROLLING
// const btnScrollTo = document.querySelector(".btn--scroll-to");
// const section1 = document.querySelector("#section--1");

// btnScrollTo.addEventListener("click", function (e) {
//   const s1coords = section1.getBoundingClientRect();

//   // Scroll To (OLD WAY!)
//   //   window.scrollTo({
//   //     left: s1coords.left + window.pageXOffset,
//   //     top: s1coords.top + window.pageYOffset,
//   //     behavior: "smooth",
//   // });

//   section1.scrollIntoView({ behavior: "smooth" });
// });

// TYPES OF EVENTS AND EVENT HANDLERS
// const h1 = document.querySelector("h1");

// const alerth1 = function () {
//   alert(`addEventListener : Great! You're reading the heading :D`);

//   h1.removeEventListener("mouseenter", alerth1);
// };

// h1.addEventListener("mouseenter", alerth1);

// h1.onmouseenter = alerth1;

//  EVENT PROPAGATION
//  event bubbling  rgb(255,255,255);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// // console.log(randomColor(0, 255));

// document.querySelector(".nav__link").addEventListener("click", function() {
//   // console.log(`Link`);
//   this.style.backgroundColor = randomColor();
//   console.log(`Link`, e.target, e.currentTarget);
// })

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   // console.log(`Link`);
//   this.style.backgroundColor = randomColor();
//   console.log(`Container`, e.target, e.currentTarget);
// });

// document.querySelector(".nav").addEventListener("click", function (e) {
//   // console.log(`Link`);
//   this.style.backgroundColor = randomColor();
//   console.log(`Nav`, e.target, e.currentTarget);
// });

// DOM TRAVERSING
// const h1 = document.querySelector("h1");

// // Going downwards: Child
// console.log(h1.querySelectorAll(`.highlight`));
// // console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = "white";
// h1.lastElementChild.style.color = "white";

// // Going Upwards :Parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest(".header").style.backgroundColor = "orangered"

document.addEventListener("DOMContentLoaded", function(e) {
  console.log(`HTML parsed and DOM Tree Built`, e);
});

window.addEventListener("load", function(e){
  console.log(`Page Fully loaded`, e);
})

window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = ""
});