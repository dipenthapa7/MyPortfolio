class ImageSlider {

    constructor(selector) {

        this.slider =
            document.querySelector(selector);

        if (!this.slider) {
            return;
        }


        this.track =
            this.slider.querySelector(".slider-track");


        this.originalSlides = Array.from(
            this.track.querySelectorAll(".slide")
        );


        this.prevButton =
            this.slider.querySelector(".prev");


        this.nextButton =
            this.slider.querySelector(".next");


        this.dotsContainer =
            this.slider.querySelector(".dots");


        this.currentIndex = 1;

        this.isMoving = false;

        this.autoSlide = null;

        this.isHovering = false;


        this.createClones();


        this.slides = Array.from(
            this.track.querySelectorAll(".slide")
        );


        this.createDots();

        this.bindEvents();

        this.moveWithoutAnimation();

        this.startAutoSlide();
    }


    /* =========================
       CREATE CLONES
    ========================= */

    createClones() {

        const firstClone =
            this.originalSlides[0].cloneNode(true);


        const lastClone =
            this.originalSlides[
                this.originalSlides.length - 1
            ].cloneNode(true);


        firstClone.classList.add("clone");

        lastClone.classList.add("clone");


        firstClone.setAttribute(
            "aria-hidden",
            "true"
        );


        lastClone.setAttribute(
            "aria-hidden",
            "true"
        );


        this.track.appendChild(
            firstClone
        );


        this.track.insertBefore(
            lastClone,
            this.originalSlides[0]
        );

    }


    /* =========================
       CREATE INDICATOR DOTS
    ========================= */

    createDots() {

        this.originalSlides.forEach(
            (slide, index) => {


                const dot =
                    document.createElement("button");


                dot.classList.add("dot");


                dot.type = "button";


                dot.setAttribute(
                    "aria-label",
                    `Go to slide ${index + 1}`
                );


                dot.addEventListener(
                    "click",
                    () => {

                        this.goToSlide(index);

                        this.restartAutoSlide();
                    }
                );


                this.dotsContainer.appendChild(
                    dot
                );

            }
        );


        this.dots =
            this.dotsContainer
                .querySelectorAll(".dot");


        this.updateDots();

    }


    /* =========================
       EVENT ARCHITECTURE
    ========================= */

    bindEvents() {


        /* NEXT BUTTON */

        this.nextButton.addEventListener(
            "click",
            () => {

                this.nextSlide();

                this.restartAutoSlide();

            }
        );


        /* PREVIOUS BUTTON */

        this.prevButton.addEventListener(
            "click",
            () => {

                this.prevSlide();

                this.restartAutoSlide();

            }
        );


        /* CHECK LOOP AFTER ANIMATION */

        this.track.addEventListener(
            "transitionend",
            (event) => {

                if (
                    event.propertyName ===
                    "transform"
                ) {

                    this.checkBoundary();

                }

            }
        );


        /* PAUSE WHEN MOUSE ENTERS */

        this.slider.addEventListener(
            "mouseenter",
            () => {

                this.isHovering = true;

                this.stopAutoSlide();

            }
        );


        /* RESUME WHEN MOUSE LEAVES */

        this.slider.addEventListener(
            "mouseleave",
            () => {

                this.isHovering = false;

                this.startAutoSlide();

            }
        );

    }


    /* =========================
       SLIDING LAYOUT MATH
    ========================= */

    updatePosition() {

        const offset =
            this.currentIndex * 100;


        this.track.style.transform =
            `translateX(-${offset}%)`;

    }


    /* =========================
       NEXT SLIDE
    ========================= */

    nextSlide() {

        if (this.isMoving) {
            return;
        }


        this.isMoving = true;


        this.currentIndex++;


        this.track.style.transition =
            "transform 0.5s ease-in-out";


        this.updatePosition();

        this.updateDots();

    }


    /* =========================
       PREVIOUS SLIDE
    ========================= */

    prevSlide() {

        if (this.isMoving) {
            return;
        }


        this.isMoving = true;


        this.currentIndex--;


        this.track.style.transition =
            "transform 0.5s ease-in-out";


        this.updatePosition();

        this.updateDots();

    }


    /* =========================
       CLICKABLE DOT
    ========================= */

    goToSlide(index) {

        if (this.isMoving) {
            return;
        }


        this.isMoving = true;


        this.currentIndex =
            index + 1;


        this.track.style.transition =
            "transform 0.5s ease-in-out";


        this.updatePosition();

        this.updateDots();

    }


    /* =========================
       SEAMLESS INFINITE LOOP
    ========================= */

    checkBoundary() {


        /* BEFORE FIRST REAL SLIDE */

        if (this.currentIndex === 0) {

            this.currentIndex =
                this.originalSlides.length;


            this.moveWithoutAnimation();

        }


        /* AFTER LAST REAL SLIDE */

        if (
            this.currentIndex ===
            this.slides.length - 1
        ) {

            this.currentIndex = 1;


            this.moveWithoutAnimation();

        }


        this.isMoving = false;


        this.updateDots();

    }


    /* =========================
       MOVE WITHOUT TRANSITION
    ========================= */

    moveWithoutAnimation() {

        this.track.style.transition =
            "none";


        this.updatePosition();

    }


    /* =========================
       ACTIVE DOT STATE
    ========================= */

    updateDots() {

        if (!this.dots) {
            return;
        }


        let dotIndex =
            this.currentIndex - 1;


        if (dotIndex < 0) {

            dotIndex =
                this.originalSlides.length - 1;

        }


        if (
            dotIndex >=
            this.originalSlides.length
        ) {

            dotIndex = 0;

        }


        this.dots.forEach(
            (dot, index) => {

                const isActive =
                    index === dotIndex;


                dot.classList.toggle(
                    "active",
                    isActive
                );


                dot.setAttribute(
                    "aria-current",
                    isActive ? "true" : "false"
                );

            }
        );

    }


    /* =========================
       AUTO SLIDE
    ========================= */

    startAutoSlide() {

        this.stopAutoSlide();


        if (this.isHovering) {
            return;
        }


        this.autoSlide =
            setInterval(
                () => {

                    this.nextSlide();

                },
                5000
            );

    }


    /* =========================
       STOP AUTO SLIDE
    ========================= */

    stopAutoSlide() {

        if (this.autoSlide) {

            clearInterval(
                this.autoSlide
            );


            this.autoSlide = null;

        }

    }


    /* =========================
       RESTART AFTER USER ACTION
    ========================= */

    restartAutoSlide() {

        this.stopAutoSlide();


        if (!this.isHovering) {

            this.startAutoSlide();

        }

    }

}


/* =========================
   INITIALIZE SLIDER
========================= */

new ImageSlider(".image-slider");