const downloadButton = document.getElementById("download-button");
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

downloadButton.addEventListener("click", async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 1500;
    canvas.height = 2000;

    if (!largePreview.classList.contains("has-image")) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 1500, 2000);
    } else {
        ctx.drawImage(largePreview, 0, 0, 1500, 2000);
    }

    ctx.save();

    let smallX = 52;
    let smallY = 52;

    switch (smallPosition) {
        case "top-left":
            smallX = 52;
            smallY = 52;
            break;

        case "top-right":
            smallX = 1500 - 52 - 457;
            smallY = 52;
            break;

        case "bottom-left":
            smallX = 52;
            smallY = 2000 - 52 - 609;
            break;

        case "bottom-right":
            smallX = 1500 - 52 - 457;
            smallY = 2000 - 52 - 609;
            break;
    }

    ctx.beginPath();
    ctx.moveTo(smallX + 63, smallY);
    ctx.lineTo(smallX + 457 - 63, smallY);
    ctx.quadraticCurveTo(smallX + 457, smallY, smallX + 457, smallY + 63);
    ctx.lineTo(smallX + 457, smallY + 609 - 63);
    ctx.quadraticCurveTo(smallX + 457, smallY + 609, smallX + 457 - 63, smallY + 609);
    ctx.lineTo(smallX + 63, smallY + 609);
    ctx.quadraticCurveTo(smallX, smallY + 609, smallX, smallY + 609 - 63);
    ctx.lineTo(smallX, smallY + 63);
    ctx.quadraticCurveTo(smallX, smallY, smallX + 63, smallY);
    ctx.closePath();

    ctx.clip();

    if (!smallPreview.classList.contains("has-image")) {
        ctx.fillStyle = "black";
        ctx.fillRect(smallX, smallY, 457, 609);
    } else {
        ctx.drawImage(smallPreview, smallX, smallY, 457, 609);
    }

    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(smallX + 63, smallY);
    ctx.lineTo(smallX + 457 - 63, smallY);
    ctx.quadraticCurveTo(smallX + 457, smallY, smallX + 457, smallY + 63);
    ctx.lineTo(smallX + 457, smallY + 609 - 63);
    ctx.quadraticCurveTo(smallX + 457, smallY + 609, smallX + 457 - 63, smallY + 609);
    ctx.lineTo(smallX + 63, smallY + 609);
    ctx.quadraticCurveTo(smallX, smallY + 609, smallX, smallY + 609 - 63);
    ctx.lineTo(smallX, smallY + 63);
    ctx.quadraticCurveTo(smallX, smallY, smallX + 63, smallY);
    ctx.closePath();

    ctx.lineWidth = 7;
    ctx.strokeStyle = "black"; 
    ctx.stroke();


    canvas.toBlob((blob) => {
        const blobUrl = URL.createObjectURL(blob);

        if (isIOS) {
            window.open(blobUrl, "_blank");
            return;
        }

        const now = new Date();
        const MM = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const filename = `berealstyle${MM}${dd}${hh}${mm}.jpg`;

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(blobUrl);
    }, "image/jpeg", 1.0);
});