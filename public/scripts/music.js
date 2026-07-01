const musicPlayer = document.querySelector('#musicPlayer');
const music = document.querySelector('#backgroundMusic');
const musicToggle = document.querySelector('#musicToggle');
const musicLabel = musicToggle?.querySelector('.music-label');
const musicVolume = document.querySelector('#musicVolume');
const musicTrackSelect = document.querySelector('#musicTrackSelect');
const musicPrevious = document.querySelector('#musicPrevious');
const musicNext = document.querySelector('#musicNext');

const musicStorage = {
  read(key, fallback) {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  },
};

let tracks = [];
let currentTrackIndex = 0;
let lastSavedSecond = -1;

function setMusicState(state, label) {
  if (!musicPlayer || !musicToggle || !musicLabel) return;
  musicPlayer.dataset.state = state;
  musicToggle.setAttribute('aria-pressed', state === 'playing' ? 'true' : 'false');
  musicToggle.setAttribute('aria-label', state === 'playing' ? '暂停背景音乐' : '播放背景音乐');
  musicLabel.textContent = label;
}

function trackLabel(track) {
  return track.artist ? `${track.title} — ${track.artist}` : track.title;
}

function savedPositions() {
  try { return JSON.parse(musicStorage.read('blog-music-positions', '{}')); } catch { return {}; }
}

function savePosition() {
  const track = tracks[currentTrackIndex];
  if (!track || !music || !Number.isFinite(music.currentTime)) return;
  const positions = savedPositions();
  positions[track.src] = music.currentTime;
  musicStorage.write('blog-music-positions', JSON.stringify(positions));
}

function loadTrack(index, shouldPlay = false) {
  if (!music || !tracks.length) return;
  savePosition();
  currentTrackIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrackIndex];
  music.src = track.src;
  musicTrackSelect.value = String(currentTrackIndex);
  musicStorage.write('blog-music-track', track.src);
  music.load();
  setMusicState('paused', trackLabel(track));
  if (shouldPlay) playMusic();
}

async function playMusic() {
  if (!music || !tracks.length) return;
  try {
    await music.play();
    musicStorage.write('blog-music-enabled', 'true');
    setMusicState('playing', trackLabel(tracks[currentTrackIndex]));
  } catch {
    setMusicState('error', '音乐文件不可用');
  }
}

function pauseMusic() {
  music?.pause();
  savePosition();
  musicStorage.write('blog-music-enabled', 'false');
  setMusicState('paused', tracks[currentTrackIndex] ? trackLabel(tracks[currentTrackIndex]) : '播放音乐');
}

async function initializePlaylist() {
  if (!music || !musicToggle || !musicVolume || !musicTrackSelect || !musicPrevious || !musicNext) return;

  const savedVolume = Number(musicStorage.read('blog-music-volume', '0.35'));
  music.volume = Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : 0.35;
  musicVolume.value = String(music.volume);

  try {
    const response = await fetch('/audio/tracks.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('playlist unavailable');
    tracks = (await response.json()).filter((track) => track.title && track.src);
  } catch {
    tracks = [];
  }

  if (!tracks.length) {
    musicTrackSelect.innerHTML = '<option>没有可用曲目</option>';
    musicTrackSelect.disabled = true;
    musicPrevious.disabled = true;
    musicNext.disabled = true;
    setMusicState('error', '没有可用曲目');
    return;
  }

  musicTrackSelect.replaceChildren(...tracks.map((track, index) => new Option(trackLabel(track), String(index))));
  musicPrevious.disabled = tracks.length < 2;
  musicNext.disabled = tracks.length < 2;
  const savedTrack = musicStorage.read('blog-music-track', tracks[0].src);
  const savedIndex = Math.max(0, tracks.findIndex((track) => track.src === savedTrack));
  loadTrack(savedIndex);

  musicToggle.addEventListener('click', () => {
    if (musicPlayer.dataset.state === 'playing') pauseMusic();
    else playMusic();
  });
  musicPrevious.addEventListener('click', () => loadTrack(currentTrackIndex - 1, musicPlayer.dataset.state === 'playing'));
  musicNext.addEventListener('click', () => loadTrack(currentTrackIndex + 1, musicPlayer.dataset.state === 'playing'));
  musicTrackSelect.addEventListener('change', () => loadTrack(Number(musicTrackSelect.value), musicPlayer.dataset.state === 'playing'));
  musicVolume.addEventListener('input', () => {
    music.volume = Number(musicVolume.value);
    musicStorage.write('blog-music-volume', musicVolume.value);
  });
  music.addEventListener('loadedmetadata', () => {
    const position = Number(savedPositions()[tracks[currentTrackIndex]?.src] || 0);
    if (position > 0 && position < music.duration - 2) music.currentTime = position;
  });
  music.addEventListener('timeupdate', () => {
    const second = Math.floor(music.currentTime);
    if (second !== lastSavedSecond && second % 5 === 0) {
      lastSavedSecond = second;
      savePosition();
    }
  });
  music.addEventListener('error', () => setMusicState('error', '音乐文件不可用'));
  window.addEventListener('pagehide', savePosition);

  if (musicStorage.read('blog-music-enabled', 'false') === 'true') {
    const resume = () => playMusic();
    document.addEventListener('pointerdown', resume, { once: true });
    document.addEventListener('keydown', resume, { once: true });
    setMusicState('paused', '点击页面继续音乐');
  }
}

initializePlaylist();
