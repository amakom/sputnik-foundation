


/*---------------------------------
testimonial slider
-----------------------------------*/
function testimonialSlider(){
    const carouselOne = document.getElementById('carouselOne');
    if(carouselOne){ /* if the element  exists*/
        carouselOne.addEventListener('slid.bs.carousel', function () {
            const activeItem = this.querySelector(".active");
            document.querySelector(".js-testimonial-img").src = 
            activeItem.getAttribute("data-js-testimonial-img");
        })
    }
}
testimonialSlider();



/*---------------------------------
style switcher
-----------------------------------*/
function styleSwitcherToggle(){
    const styleSwitcher = document.querySelector(".js-style-switcher"),
    styleSwitcherToggler = document.querySelector(".js-style-switcher-toggler");

    styleSwitcherToggler.addEventListener("click", function(){
        styleSwitcher.classList.toggle("open");
        this.querySelector("i").classList.toggle("fa-times");
        this.querySelector("i").classList.toggle("fa-cog");
    });
}
styleSwitcherToggle();

/*---------------------------------
theme colors
-----------------------------------*/
function themeColors(){
    const colorStyle = document.querySelector(".js-color-style"),
    themeColorsContainer = document.querySelector(".js-theme-colors");

    themeColorsContainer.addEventListener("click", ({target}) => {
        if(target.classList.contains("js-theme-color-item")){
            localStorage.setItem("color", target.getAttribute("data-js-theme-color"));
            setColor();
        }
    });

    function setColor(){
        let path = colorStyle.getAttribute("href").split("/");
        path = path.slice(0, path.length-1);
        colorStyle.setAttribute("href", path.join("/") + "/" + localStorage.getItem("color") + ".css");

        if(document.querySelector(".js-theme-color-item.active")){
            document.querySelector(".js-theme-color-item.active").classList.remove("active");
        }
        document.querySelector("[data-js-theme-color=" + localStorage.getItem("color") + "]").classList.add("active");
    }
}
themeColors();