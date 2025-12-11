const swapButton = document.getElementById("swap-button");

swapButton.addEventListener("click", () => {
    const largeSrc = largePreview.src;
    const smallSrc = smallPreview.src;

    largePreview.src = smallSrc
    smallPreview.src = largeSrc;
    handlePreviewLoad(largePreview);
    handlePreviewLoad(smallPreview);
});