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

// ズーム適用
function applyZoom(zoom) {
  const scale = facingMode === 'user' ? `scaleX(-1) scale(${zoom})` : `scale(${zoom})`;
  cameraVideo.style.transform = scale;
}

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
    applyZoom(0.5);
  } catch (e) {
    alert('カメラエラー：' + e.message);
  }
}

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
