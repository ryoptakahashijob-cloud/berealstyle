const largePreview = document.getElementById("large-preview");
const smallPreview = document.getElementById("small-preview");
const largeContainer = document.getElementById("large-container");
const smallContainer = document.getElementById("small-container");
const largeImage = document.getElementById("large-image");
const smallImage = document.getElementById("small-image");
const gridButtons = document.querySelectorAll(".grid button");

let smallPosition = "top-left";  

const updateStyle = () => {
    const width = smallContainer.clientWidth;
    smallContainer.style.outlineWidth = (width * 0.0155) + "px";
    smallContainer.style.borderRadius = (width * 0.137) + "px";
    smallPreview.style.borderRadius = (width * 0.137) + "px";
};

const handlePreviewLoad = (img) => {
    if (img.src.includes("/static/images/plus.svg")) {
        img.classList.remove("has-image");
    } else {
        img.classList.add("has-image");
    }
};

largeContainer.addEventListener("click", () => {
    largeImage.click();
});

smallContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    smallImage.click();
});

let timer;

window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        updateStyle();
    }, 100);
});

updateStyle();

largePreview.addEventListener("load", () => handlePreviewLoad(largePreview));
smallPreview.addEventListener("load", () => handlePreviewLoad(smallPreview));

gridButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        gridButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");

        smallContainer.classList.remove("top-left", "top-right", "bottom-left", "bottom-right");

        smallContainer.classList.add(btn.id);
        smallPosition = btn.id;
    });
});
