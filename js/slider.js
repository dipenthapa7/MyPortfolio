class ImageSlider {

    constructor(selector) {

        this.slider =
            document.querySelector(selector);

        this.track =
            this.slider.querySelector(".slider-track");

        this.slides = Array.from(
            this.track.querySelectorAll(".slide")
        );

        this.prevBtn =
            this.slider.querySelector(".prev");

        this.nextBtn =
            this.slider.querySelector(".next");

        this.dotsBox =
            this.slider.querySelector(".dots");


        this.index = 1;

        this.isMoving = false;

        this.isHovering = false;

        this.timer = null;


        this.createClones();

        this.createDots();

        this.bindEvents();


        this.move(false);

        this.startAutoSlide();
    }


    /* CREATE CLONES FOR INFINITE LOOP */

    createClones() {

        const first =
            this.slides[0].cloneNode(true);


        const last =
            this.slides[
                this.slides.length - 1
            ].cloneNode(true);


        this.track.appendChild(first);


        this.track.insertBefore(
            last,
            this.slides[0]
        );


        this.allSlides =
            this.track.querySelectorAll(".slide");
    }


    /* CREATE INDICATOR DOTS */

    createDots() {

        this.slides.forEach(
            (slide, i) => {

                const dot =
                    document.createElement("button");


                dot.className = "dot";

                dot.type = "button";


                dot.setAttribute(
                    "aria-label",
                    `Go to slide ${i + 1}`
                );


                dot.addEventListener(
                    "click",
                    () => {

                        this.goToSlide(i);

                        this.restartAutoSlide();

                    }
                );


                this.dotsBox.appendChild(dot);

            }
        );


        this.dots =
            this.dotsBox.querySelectorAll(".dot");


        this.updateDots();
    }


    /* EVENT LISTENERS */

    bindEvents() {

        this.nextBtn.addEventListener(
            "click",
            () => {

                this.nextSlide();

                this.restartAutoSlide();

            }
        );


        this.prevBtn.addEventListener(
            "click",
            () => {

                this.prevSlide();

                this.restartAutoSlide();

            }
        );


        this.track.addEventListener(
            "transitionend",
            () => {

                this.checkBoundary();

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


    /* MOVE SLIDER */

    move(animate = true) {

        this.track.style.transition =
            animate
                ? "transform 0.5s ease-in-out"
                : "none";


        this.track.style.transform =
            `translateX(-${this.index * 100}%)`;
    }


    /* NEXT SLIDE */

    nextSlide() {

        if (this.isMoving) {
            return;
        }


        this.isMoving = true;

        this.index++;


        this.move();

        this.updateDots();
    }


    /* PREVIOUS SLIDE */

    prevSlide() {

        if (this.isMoving) {
            return;
        }


        this.isMoving = true;

        this.index--;


        this.move();

        this.updateDots();
    }


    /* CLICK INDICATOR DOT */

    goToSlide(i) {

        if (this.isMoving) {
            return;
        }


        this.isMoving = true;

        this.index = i + 1;


        this.move();

        this.updateDots();
    }


    /* INFINITE LOOP */

    checkBoundary() {

        if (this.index === 0) {

            this.index =
                this.slides.length;


            this.move(false);
        }


        if (
            this.index ===
            this.allSlides.length - 1
        ) {

            this.index = 1;


            this.move(false);
        }


        this.isMoving = false;


        this.updateDots();
    }


    /* UPDATE ACTIVE DOT */

    updateDots() {

        let active =
            this.index - 1;


        if (active < 0) {

            active =
                this.slides.length - 1;
        }


        if (
            active >=
            this.slides.length
        ) {

            active = 0;
        }


        this.dots.forEach(
            (dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === active
                );

            }
        );
    }


    /* AUTO SLIDE */

    startAutoSlide() {

        this.stopAutoSlide();


        if (!this.isHovering) {

            this.timer =
                setInterval(
                    () => this.nextSlide(),
                    5000
                );
        }
    }


    /* STOP AUTO SLIDE */

    stopAutoSlide() {

        clearInterval(
            this.timer
        );


        this.timer = null;
    }


    /* RESTART AUTO SLIDE */

    restartAutoSlide() {

        if (!this.isHovering) {

            this.startAutoSlide();

        }
    }

}


/* START SLIDER */

new ImageSlider(".image-slider");