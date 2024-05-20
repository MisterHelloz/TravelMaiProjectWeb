document.addEventListener("DOMContentLoaded", function() {
    let slideIndex = 0;
    const slides = document.querySelectorAll(".slider img");
    const dots = document.querySelectorAll(".slider-nav a");

    function showSlides() {
        slideIndex++;
        if (slideIndex >= slides.length) {
            slideIndex = 0;
        }
        slides.forEach((slide) => {
            slide.style.transform = `translateX(-${slideIndex * 100}%)`;  
        });
        setActiveDot();
        setTimeout(showSlides, 5000); // Change image every 5 seconds
    }

    function setActiveDot() {
        dots.forEach((dot, index) => {
            if (index === slideIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function() {
            slideIndex = index;
            showSlides();
        });
    });

    showSlides();
});
