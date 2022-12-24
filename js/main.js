


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
header menu
-----------------------------------*/
function headerMenu(){
    const menu = document.querySelector(".js-header-menu"),
    backdrop = document.querySelector(".js-header-backdrop"),
    menuCollapseBreakpoint = 991;

    function toggleMenu(){
        menu.classList.toggle("open");
        backdrop.classList.toggle("active");
        document.body.classList.toggle("overflow-hidden");
    }

    document.querySelectorAll(".js-header-menu-toggler").forEach((item) => {
        item.addEventListener("click", toggleMenu);
    });

    // close the menu by clicking outside of it
    backdrop.addEventListener("click", toggleMenu);



    function collapse(){
        menu.querySelector(".active .js-sub-menu").removeAttribute("style");
        menu.querySelector(".active").classList.remove("active");
    }

    menu.addEventListener("click", (event) => {
        const { target } = event;
        
        if(target.classList.contains("js-toggle-sub-menu") && 
        window.innerWidth <= menuCollapseBreakpoint){
            // prevent default anchor click behavior
            event.preventDefault();


            // if menu-item already expanded collapse it and exit
            if(target.parentElement.classList.contains("active")){
                collapse();
                return;
            }
            // if not already expanded..... run below code

            // collapse the other expanded menu item if exixts
            if(menu.querySelector(".active")){
                collapse();
            }

            // expand new menu-item
            target.parentElement.classList.add("active");
            target.nextElementSibling.style.maxHeight = 
            target.nextElementSibling.scrollHeight + "px";
        }
    });

    // when resizing window
    window.addEventListener("resize", function() {
        if(this.innerWidth > menuCollapseBreakpoint && menu.classList.contains("open")){
            toggleMenu();
        }
        if(this.innerWidth > menuCollapseBreakpoint && menu.querySelector(".active")){
            collapse();
        }
    });
}
headerMenu();

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


    if(localStorage.getItem("color") !== null){
        setColor();
    }
    else{
        const defaultColor = colorStyle.getAttribute("href").split("/").pop().split(".").shift();
        document.querySelector("[data-js-theme-color=" + defaultColor + "]").classList.add("active");
    }
}
themeColors();


/*---------------------------------
theme light & dark mode
-----------------------------------*/

function themeLightDark(){
    const darkModeCheckbox = document.querySelector(".js-dark-mode");

    darkModeCheckbox.addEventListener("click", function() {
        if(this.checked){
            localStorage.setItem("theme-dark", "true");
        }
        else{
            localStorage.setItem("theme-dark", "false");
        }
        themeMode();
    });

    function themeMode(){
        if(localStorage.getItem("theme-dark") === "false"){
            document.body.classList.remove("t-dark");
        }
        else{
            document.body.classList.add("t-dark");
        }
    }

    if(localStorage.getItem("theme-dark") !== null){
        themeMode();
    }
    if(document.body.classList.contains("t-dark")){
        darkModeCheckbox.checked = true;
    }
}
themeLightDark();


function bodyScrollingToggle(){
    document.body.classList.toggle("hidden-scrolling");
}
/*---------------------------------
gallery filtert & popup
-----------------------------------*/

(() =>{

    const filterContainer = document.querySelector(".gallery-filter"),
    portfolioItemsContainer = document.querySelector(".gallery-items"),
    portfolioItems = document.querySelectorAll(".gallery-img-item"),
    popup = document.querySelector(".gallery-popup"),
    prevBtn = popup.querySelector(".gp-prev"),
    nextBtn = popup.querySelector(".gp-next"),
    closeBtn = popup.querySelector(".gp-close"),
    projectDetailsContainer = popup.querySelector(".gp-details"),
    projectDetailsBtn = popup.querySelector(".gp-img-details-btn");
    let itemIndex, slideIndex, screenshots;

    /* filter portfolio items */
    filterContainer.addEventListener("click", (event)=>{
        if(event.target.classList.contains("filter-item") &&
        !event.target.classList.contains("active")){
            // deactivate existing active 'filter-item'
            filterContainer.querySelector(".active").classList.remove("active");
            // activate new 'filter item'
            event.target.classList.add("active");
            const target = event.target.getAttribute("data-target");
            portfolioItems.forEach((item) =>{
                if(target === item.getAttribute("data-category") || target === 'all'){
                    item.classList.remove("hide");
                    item.classList.add("show");
                }
                else{
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
    })


    portfolioItemsContainer.addEventListener("click", (event) =>{
        if(event.target.closest(".gallery-img-item-inner")){
            const portfolioItem = event.target.closest(".gallery-img-item-inner").parentElement;
            // get the portfolioItem index
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            screenshots = portfolioItems[itemIndex].querySelector(".gallery-img-inner img").getAttribute("data-screenshots");
            // convert screenshots into Array
            screenshots = screenshots.split(",");
            if(screenshots.length === 1){
               prevBtn.style.display="none";
               nextBtn.style.display="none";
            }
            else{
                prevBtn.style.display="block";
                nextBtn.style.display="block";
            }
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    })

    closeBtn.addEventListener("click", () =>{
        popupToggle();
        if(projectDetailsContainer.classList.contains("active")){
            popupDetailsToggle();
        }
    })

    function popupToggle() {
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow(){
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector(".gp-img");
        /* activate loader until the poupImg loaded  */
        popup.querySelector(".gp-loader").classList.add("active");
        popupImg.src=imgSrc;
        popupImg.onload = () =>{
           // deactivate loader after the popupImg loaded
           popup.querySelector(".gp-loader").classList.remove("active");
        }
        popup.querySelector(".gp-counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;
    }

    // next slide
    nextBtn.addEventListener("click", () =>{
        if(slideIndex === screenshots.length-1){
            slideIndex = 0;
        }
        else{
            slideIndex++;
        }
        popupSlideshow();
    })

    // prev slide
    prevBtn.addEventListener("click", () =>{
        if(slideIndex === 0){
            slideIndex = screenshots.length-1
        }
        else{
            slideIndex--;
        }
        popupSlideshow();
    })

    function popupDetails(){
        // if gallery-image-details mot exists
        if(!portfolioItems[itemIndex].querySelector(".gallery-images-title")){
            projectDetailsBtn.style.display="none";
            return; /*end function execution*/
        }
        projectDetailsBtn.style.display="block";
        // get the project details
        const details = portfolioItems[itemIndex].querySelector(".gallery-image-details").innerHTML;
        popup.querySelector(".gp-photo-details").innerHTML = details;
        const title = portfolioItems[itemIndex].querySelector(".gallery-images-title").innerHTML;
        popup.querySelector(".gp-title h2").innerHTML = title;
        const category = portfolioItems[itemIndex].getAttribute("data-category");
    }

    projectDetailsBtn.addEventListener("click",() =>{
        popupDetailsToggle();
    })

    function popupDetailsToggle(){
        if(projectDetailsContainer.classList.contains("active")){
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");
            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight =0 + "px"
        }
        else{
           projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
           projectDetailsBtn.querySelector("i").classList.add("fa-minus");
           projectDetailsContainer.classList.add("active");
           projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
           popup.scrollTo(0,projectDetailsContainer.offsetTop);
        }
    }

})();