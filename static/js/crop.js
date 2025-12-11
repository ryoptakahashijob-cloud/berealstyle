const overlay = document.getElementById('crop-overlay');
const imageToCrop = document.getElementById('image-to-crop');
const cancelButton = document.getElementById('crop-cancel-button');
const confirmButton = document.getElementById('crop-confirm-button');
const zoomSlider = document.getElementById('zoom-slider');

let cropper = null;
let currentInput = null;
let currentPreview = null;

// --- ズーム制御用の変数を準備 ---
let minZoomRatio = 0; // 最小ズーム率を保存する変数
const MAX_ZOOM_MULTIPLIER = 3.0; // 最小状態から最大で何倍までズームできるか (例: 3倍)

// ファイルが選択されたら、オーバーレイを表示してCropperを起動
const openCropper = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        imageToCrop.src = event.target.result;
        overlay.style.display = 'flex';

        if (cropper) cropper.destroy();
        
        cropper = new Cropper(imageToCrop, {
            aspectRatio: 3 / 4,
            viewMode: 1,
            dragMode: 'move',
            background: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            guides: false, 
            center: false, 
            highlight: false,
            // readyイベントで、初期ズーム値をスライダーに反映
            ready: function() {
                const canvasData = cropper.getCanvasData();
                const cropBoxData = cropper.getCropBoxData();
                // 枠に画像がぴったり収まる最小のズーム率を計算
                minZoomRatio = Math.max(
                    cropBoxData.width / canvasData.naturalWidth, 
                    cropBoxData.height / canvasData.naturalHeight
                );
                
                // 2. 最初に必ず最小ズーム状態にする
                cropper.zoomTo(minZoomRatio);

                // 3. スライダーの値を初期位置(0)に戻す
                zoomSlider.value = 0;
            }
        });
    };
    reader.readAsDataURL(file);
};

// スライダーを動かしたら、画像をズーム
zoomSlider.addEventListener('input', function() {
    if(cropper) {
        // スライダーの値(0-100)を、実際のズーム率に変換する
        // 最小ズーム率を基準に、最大でMAX_ZOOM_MULTIPLIER倍まで拡大できるように計算
        const zoomRange = minZoomRatio * (MAX_ZOOM_MULTIPLIER - 1);
        const targetZoom = minZoomRatio + (this.value / 100) * zoomRange;
        cropper.zoomTo(targetZoom);
    }
});

// --- マウスホイールなどでズームしたときの処理 ---
imageToCrop.addEventListener('zoom', function(event) {
    if (!cropper) return;

    // 1. 最大ズームを超えようとしたら、強制的に最大ズームに戻す
    const maxZoom = minZoomRatio * MAX_ZOOM_MULTIPLIER;
    if (event.detail.ratio > maxZoom) {
        event.preventDefault(); // それ以上ズームさせない
        cropper.zoomTo(maxZoom);
    }

    // 2. 最小ズームより小さくしようとしたら、強制的に最小ズームに戻す
    if (event.detail.ratio < minZoomRatio) {
        event.preventDefault();
        cropper.zoomTo(minZoomRatio);
    }

    // 3. 現在のズーム率をスライダーの位置に反映させる
    const zoomRange = minZoomRatio * (MAX_ZOOM_MULTIPLIER - 1);
    const currentRatioInPercent = ((cropper.getCanvasData().width / cropper.getCanvasData().naturalWidth) - minZoomRatio) / zoomRange * 100;
    zoomSlider.value = currentRatioInPercent;
});

// 「キャンセル」ボタンでオーバーレイを閉じる
cancelButton.addEventListener('click', function() {
    overlay.style.display = 'none';
    if(cropper) cropper.destroy();
    currentInput.value = '';
});

// 「決定」ボタンでトリミングを実行
confirmButton.addEventListener('click', function () {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({ width: 1500, height: 2000 });
    canvas.toBlob(function (blob) {
        const croppedFile = new File([blob], `${currentInput.name}.jpg`, { type: 'image/jpg' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(croppedFile);
        currentInput.files = dataTransfer.files;

        overlay.style.display = 'none'; // オーバーレイを閉じる
        if(cropper) cropper.destroy();

        // プレビュー画像をトリミング後のものに更新
        currentPreview.src = URL.createObjectURL(croppedFile);
    }, 'image/jpeg', 0.6);
});

largeImage.addEventListener("change", (e) => {
    openCropper(e);
    currentInput = largeImage;
    currentPreview = largePreview;
});

smallImage.addEventListener("change", (e) => {
    openCropper(e);
    currentInput = smallImage;
    currentPreview = smallPreview;
});
