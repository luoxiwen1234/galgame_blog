const musicPlayer = document.querySelector('#musicPlayer');
const music = document.querySelector('#backgroundMusic');
const musicToggle = document.querySelector('#musicToggle');
const musicLabel = musicToggle?.querySelector('.music-label');
const musicVolume = document.querySelector('#musicVolume');

const musicStorage = {
  read(key, fallback) {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  },
};

function setMusicState(state, label) {
  if (!musicPlayer || !musicToggle || !musicLabel) return;
  musicPlayer.dataset.state = state;
  musicToggle.setAttribute('aria-pressed', state === 'playing' ? 'true' : 'false');
  musicToggle.setAttribute('aria-label', state === 'playing' ? '暂停背景音乐' : '播放背景音乐');
  musicLabel.textContent = label;
}

async function playMusic() {
  if (!music) return;
  try {
    await music.play();
    musicStorage.write('blog-music-enabled', 'true');
    setMusicState('playing', '暂停音乐');
  } catch {
    setMusicState('error', '音乐文件未添加');
  }
}

function pauseMusic() {
  music?.pause();
  musicStorage.write('blog-music-enabled', 'false');
  setMusicState('paused', '播放音乐');
}

if (music && musicToggle && musicVolume) {
  const savedVolume = Number(musicStorage.read('blog-music-volume', '0.35'));
  music.volume = Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : 0.35;
  musicVolume.value = String(music.volume);

  musicToggle.addEventListener('click', () => {
    if (musicPlayer.dataset.state === 'playing') pauseMusic();
    else playMusic();
  });

  musicVolume.addEventListener('input', () => {
    music.volume = Number(musicVolume.value);
    musicStorage.write('blog-music-volume', musicVolume.value);
  });

  music.addEventListener('error', () => setMusicState('error', '音乐文件未添加'));

  if (musicStorage.read('blog-music-enabled', 'false') === 'true') {
    const resume = () => playMusic();
    document.addEventListener('pointerdown', resume, { once: true });
    document.addEventListener('keydown', resume, { once: true });
    setMusicState('paused', '点击页面继续音乐');
  }
}
