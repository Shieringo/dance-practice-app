const referenceVideo = document.getElementById('reference-video');
const cameraVideo = document.getElementById('camera-video');
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnCamera = document.getElementById('btn-camera');
const speedBtns = document.querySelectorAll('.speed-btn');

let currentStream = null;
let facingMode = 'user';
let currentZoom = 0.5;
let pinchStartDist = 0;
let pinchStartZoom = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

// カメラ起動
async function startCamera(facing) {
  if (currentStream) {
    currentStream.getTracks().forEach(t => t.stop());
  }
  try {
    const constraints = {
      video: {
        facingMode: facing,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    currentStream = stream;
    cameraVideo.srcObject = stream;
    await cameraVideo.play();
    currentZoom = 0.5;
    applyZoom(0.5);
  } catch (e) {
    alert('カメラエラー：' + e.message);
  }
}

// ズーム適用（デジタルズーム）
function applyZoom(zoom) {
  currentZoom = Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
  const scale = facingMode === 'user' ? `scaleX(-1) scale(${currentZoom})` : `scale(${currentZoom})`;
  cameraVideo.style.transform = scale;
}

// 2点間の距離を計算
function getPinchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// ピンチイン/アウト
const rightPanel = document.getElementById('panel-right');

rightPanel.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    pinchStartDist = getPinchDist(e.touches);
    pinchStartZoom = currentZoom;
    e.preventDefault();
  }
}, { passive: false });

rightPanel.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2) {
    const dist = getPinchDist(e.touches);
    const ratio = dist / pinchStartDist;
    applyZoom(pinchStartZoom * ratio);
    e.preventDefault();
  }
}, { passive: false });

// カメラ切替
btnCamera.addEventListener('click', () => {
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  startCamera(facingMode);
});

// 見本動画の読み込み
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (referenceVideo.src) {
    URL.revokeObjectURL(referenceVideo.src);
  }
  const url = URL.createObjectURL(file);
  referenceVideo.src = url;
  referenceVideo.load();
  uploadArea.classList.add('has-video');
});

// 再生・停止
btnPlay.addEventListener('click', () => {
  referenceVideo.play().catch(e => alert('再生エラー：' + e.message));
});
btnPause.addEventListener('click', () => referenceVideo.pause());

// 速度調整
speedBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    speedBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    referenceVideo.playbackRate = parseFloat(btn.dataset.speed);
  });
});

// ページ読み込み時にカメラ起動
window.addEventListener('load', () => {
  startCamera(facingMode);
});
