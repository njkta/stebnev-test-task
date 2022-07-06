

const mainSlider = new Swiper('.main-slider', {
    navigation: {
        nextEl: ".btn-next",
        prevEl: ".btn-prev",
    },
    pagination: {
        el: ".main-slider__pagination",
    },
});

const actionsSlider = new Swiper('.actions-slider', {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 15,
    loop: true,
    navigation: {
        nextEl: ".btn-next",
        prevEl: ".btn-prev",
    },
    pagination: {
        el: ".actions-slider__pagination",
    },
});

