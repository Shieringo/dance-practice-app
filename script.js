const referenceVideo = document.getElementById('reference-video');
const cameraVideo = document.getElementById('camera-video');
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnCamera = document.getElementById('btn-camera');
const speedBtns = document.querySelectorAll('.speed-btn');

let currentStream = null;
let facingMode = 'user'; // フロントカメラ

// カメラ起動
async function startCamera(facing) {
  if (currentStream) {
    currentStream.getTracks().forEach(t => t.stop());
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facing },
      audio: false
    });
    currentStream = stream;
    cameraVideo.srcObject = stream;
  } catch (e) {
    alert('カメラの起動に失敗しました。ブラウザのカメラ許可を確認してください。');
  }
}

// カメラ切替ボタン
btnCamera.addEventListener('click', () => {
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  startCamera(facingMode);
});

// 見本動画の読み込み
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  referenceVideo.src = url;
  referenceVideo.load();
  uploadArea.classList.add('hidden');
});

// 再生・停止
btnPlay.addEventListener('click', () => referenceVideo.play());
btnPause.addEventListener('click', () => referenceVideo.pause());

// 速度調整
speedBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    speedBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    referenceVideo.playbackRate = parseFloat(btn.dataset.speed);
  });
});

// 起動時にカメラ開始
startCamera(facingMode);
