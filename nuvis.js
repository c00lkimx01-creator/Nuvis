// ==================== NUVIS SHARED UTILITIES ====================

// ---- Theme ----
function initTheme() {
  const t = localStorage.getItem('nuvis-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('nuvis-theme', next);
}

// ---- Language ----
const LANGS = {
  ja: {
    search: '検索', searchPlaceholder: '動画を検索...', home: 'ホーム',
    trending: 'トレンド', history: '履歴', favorites: 'お気に入り',
    subscriptions: '登録チャンネル', settings: '設定', login: 'ログイン',
    welcome: 'Nuvisへようこそ', password: 'パスワード', loginBtn: 'ログイン',
    noResults: '結果が見つかりません', loading: '読み込み中...',
    views: '回視聴', ago: '前', playMode: '再生方法', description: '概要',
    comments: 'コメント', subscribe: '登録', unsubscribe: '登録解除',
    addFav: 'お気に入りに追加', removeFav: 'お気に入りから削除',
    playbackMode: '再生方法', darkMode: 'ダークモード', language: '言語',
    loginError: 'パスワードが違います', watchHistory: '視聴履歴',
    noHistory: '履歴はありません', noFavorites: 'お気に入りはありません',
    noSubscriptions: '登録チャンネルはありません', popular: '急上昇',
    shorts: 'ショート', videos: '動画', about: 'チャンネルについて',
    appearance: '外観', general: '一般',
  },
  en: {
    search: 'Search', searchPlaceholder: 'Search videos...', home: 'Home',
    trending: 'Trending', history: 'History', favorites: 'Favorites',
    subscriptions: 'Subscriptions', settings: 'Settings', login: 'Login',
    welcome: 'Welcome to Nuvis', password: 'Password', loginBtn: 'Login',
    noResults: 'No results found', loading: 'Loading...',
    views: ' views', ago: ' ago', playMode: 'Play Mode', description: 'Description',
    comments: 'Comments', subscribe: 'Subscribe', unsubscribe: 'Unsubscribe',
    addFav: 'Add to Favorites', removeFav: 'Remove from Favorites',
    playbackMode: 'Playback Mode', darkMode: 'Dark Mode', language: 'Language',
    loginError: 'Wrong password', watchHistory: 'Watch History',
    noHistory: 'No history yet', noFavorites: 'No favorites yet',
    noSubscriptions: 'No subscriptions yet', popular: 'Popular',
    shorts: 'Shorts', videos: 'Videos', about: 'About',
    appearance: 'Appearance', general: 'General',
  },
  zh: {
    search: '搜索', searchPlaceholder: '搜索视频...', home: '主页',
    trending: '趋势', history: '历史', favorites: '收藏',
    subscriptions: '订阅', settings: '设置', login: '登录',
    welcome: '欢迎来到 Nuvis', password: '密码', loginBtn: '登录',
    noResults: '未找到结果', loading: '加载中...',
    views: ' 次观看', ago: '前', playMode: '播放方式', description: '描述',
    comments: '评论', subscribe: '订阅', unsubscribe: '取消订阅',
    addFav: '添加收藏', removeFav: '取消收藏',
    playbackMode: '播放模式', darkMode: '深色模式', language: '语言',
    loginError: '密码错误', watchHistory: '观看历史',
    noHistory: '暂无历史', noFavorites: '暂无收藏',
    noSubscriptions: '暂无订阅', popular: '热门',
    shorts: '短片', videos: '视频', about: '关于',
    appearance: '外观', general: '通用',
  }
};

function getLang() {
  return localStorage.getItem('nuvis-lang') || 'ja';
}

function t(key) {
  const lang = getLang();
  return (LANGS[lang] && LANGS[lang][key]) || LANGS['ja'][key] || key;
}

// ---- Navigation ----
function navigate(path) {
  window.location.href = path;
}

// ---- Favorites ----
function getFavorites() {
  return JSON.parse(localStorage.getItem('nuvis-favorites') || '[]');
}

function saveFavorites(favs) {
  localStorage.setItem('nuvis-favorites', JSON.stringify(favs));
}

function isFavorite(videoId) {
  return getFavorites().some(v => v.id === videoId);
}

function toggleFavorite(video) {
  let favs = getFavorites();
  const idx = favs.findIndex(v => v.id === video.id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    showToast(t('removeFav'));
  } else {
    favs.unshift(video);
    showToast(t('addFav'));
  }
  saveFavorites(favs);
  return idx < 0;
}

// ---- Subscriptions ----
function getSubscriptions() {
  return JSON.parse(localStorage.getItem('nuvis-subs') || '[]');
}

function saveSubscriptions(subs) {
  localStorage.setItem('nuvis-subs', JSON.stringify(subs));
}

function isSubscribed(channelId) {
  return getSubscriptions().some(c => c.id === channelId);
}

function toggleSubscription(channel) {
  let subs = getSubscriptions();
  const idx = subs.findIndex(c => c.id === channel.id);
  if (idx >= 0) {
    subs.splice(idx, 1);
    showToast(t('unsubscribe'));
  } else {
    subs.unshift(channel);
    showToast(t('subscribe') + ' ✓');
  }
  saveSubscriptions(subs);
  return idx < 0;
}

// ---- Watch History ----
function getHistory() {
  return JSON.parse(localStorage.getItem('nuvis-history') || '[]');
}

function addToHistory(video) {
  let hist = getHistory().filter(v => v.id !== video.id);
  hist.unshift({ ...video, watchedAt: Date.now() });
  if (hist.length > 200) hist = hist.slice(0, 200);
  localStorage.setItem('nuvis-history', JSON.stringify(hist));
}

// ---- Playback Mode ----
function getPlayMode() {
  return localStorage.getItem('nuvis-playmode') || 'nocookie';
}

function setPlayMode(mode) {
  localStorage.setItem('nuvis-playmode', mode);
}

// ---- Toast ----
function showToast(msg, duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = '0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- Format helpers ----
function formatViews(n) {
  if (!n) return '';
  n = parseInt(n);
  if (n >= 1e8) return (n / 1e8).toFixed(1) + '億';
  if (n >= 1e4) return (n / 1e4).toFixed(1) + '万';
  return n.toLocaleString();
}

function formatDate(published) {
  if (!published) return '';
  const lang = getLang();
  try {
    const d = new Date(typeof published === 'number' ? published * 1000 : published);
    if (lang === 'ja') {
      return d.toLocaleDateString('ja-JP', { year:'numeric', month:'short', day:'numeric' });
    } else if (lang === 'zh') {
      return d.toLocaleDateString('zh-CN', { year:'numeric', month:'short', day:'numeric' });
    }
    return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
  } catch { return ''; }
}

function formatDuration(s) {
  if (!s) return '';
  s = parseInt(s);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${m}:${String(sec).padStart(2,'0')}`;
}

// ---- API endpoints ----
const INV_INSTANCES = [
  'https://invidious.fdn.fr',
  'https://invidious.nerdvpn.de',
  'https://vid.puffyan.us',
  'https://inv.riverside.rocks',
  'https://yt.artemislena.eu',
];

const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://piped-api.garudalinux.org',
];

const STREAM_URLS = [
  'https://yudlp.vercel.app/stream',
  'https://senninytdlp.vercel.app/stream',
  'https://siawaseok.f5.si/api/streams',
  'https://simple-yt-stream.onrender.com/api/video',
];

async function invidiousSearch(query, page = 1) {
  for (const inst of INV_INSTANCES) {
    try {
      const r = await fetch(`${inst}/api/v1/search?q=${encodeURIComponent(query)}&page=${page}&type=video`);
      if (!r.ok) continue;
      const data = await r.json();
      if (Array.isArray(data) && data.length) return { source: 'invidious', data };
    } catch {}
  }
  return null;
}

async function pipedSearch(query) {
  for (const inst of PIPED_INSTANCES) {
    try {
      const r = await fetch(`${inst}/search?q=${encodeURIComponent(query)}&filter=all`);
      if (!r.ok) continue;
      const data = await r.json();
      if (data && data.items && data.items.length) return { source: 'piped', data: data.items };
    } catch {}
  }
  return null;
}

async function pokeTubeSearch(query) {
  try {
    const r = await fetch(`https://poketube.fun/api/search?q=${encodeURIComponent(query)}`);
    if (!r.ok) return null;
    const data = await r.json();
    if (data && data.results) return { source: 'poke', data: data.results };
  } catch {}
  return null;
}

async function searchVideos(query) {
  const results = await Promise.allSettled([
    invidiousSearch(query),
    pipedSearch(query),
    pokeTubeSearch(query),
  ]);
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) return r.value;
  }
  return null;
}

async function getTrending() {
  for (const inst of INV_INSTANCES) {
    try {
      const r = await fetch(`${inst}/api/v1/trending?type=default&region=JP`);
      if (!r.ok) continue;
      const data = await r.json();
      if (Array.isArray(data) && data.length) return { source: 'invidious', data };
    } catch {}
  }
  try {
    const r = await fetch(`${PIPED_INSTANCES[0]}/trending?region=JP`);
    const data = await r.json();
    if (Array.isArray(data) && data.length) return { source: 'piped', data };
  } catch {}
  return null;
}

async function getVideoInfo(videoId) {
  for (const inst of INV_INSTANCES) {
    try {
      const r = await fetch(`${inst}/api/v1/videos/${videoId}`);
      if (!r.ok) continue;
      const data = await r.json();
      if (data && data.videoId) return { source: 'invidious', data };
    } catch {}
  }
  for (const inst of PIPED_INSTANCES) {
    try {
      const r = await fetch(`${inst}/streams/${videoId}`);
      if (!r.ok) continue;
      const data = await r.json();
      if (data && data.title) return { source: 'piped', data };
    } catch {}
  }
  return null;
}

async function getVideoComments(videoId) {
  for (const inst of INV_INSTANCES) {
    try {
      const r = await fetch(`${inst}/api/v1/comments/${videoId}`);
      if (!r.ok) continue;
      const data = await r.json();
      if (data && data.comments) return data.comments;
    } catch {}
  }
  return [];
}

async function getChannelInfo(channelId) {
  for (const inst of INV_INSTANCES) {
    try {
      const r = await fetch(`${inst}/api/v1/channels/${channelId}`);
      if (!r.ok) continue;
      const data = await r.json();
      if (data && data.author) return { source: 'invidious', data };
    } catch {}
  }
  return null;
}

async function getChannelVideos(channelId) {
  for (const inst of INV_INSTANCES) {
    try {
      const r = await fetch(`${inst}/api/v1/channels/${channelId}/videos`);
      if (!r.ok) continue;
      const data = await r.json();
      if (data && data.videos) return data.videos;
    } catch {}
  }
  return [];
}

async function getStreamUrl(videoId, mode) {
  if (mode === 'nocookie') {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
  }
  if (mode === 'edu') {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (mode === 'stream') {
    for (const base of STREAM_URLS) {
      try {
        const r = await fetch(`${base}/${videoId}`);
        if (!r.ok) continue;
        // Check if it's JSON with url or direct stream
        const ct = r.headers.get('content-type') || '';
        if (ct.includes('json')) {
          const d = await r.json();
          const url = d.url || d.stream_url || d.streamUrl || d.videoUrl;
          if (url) return { type: 'direct', url };
        } else {
          return { type: 'direct', url: `${base}/${videoId}` };
        }
      } catch {}
    }
    // fallback to invidious stream
    for (const inst of INV_INSTANCES) {
      try {
        const r = await fetch(`${inst}/api/v1/videos/${videoId}`);
        if (!r.ok) continue;
        const d = await r.json();
        const streams = d.formatStreams || [];
        const best = streams.find(s => s.quality === '720p') || streams[0];
        if (best && best.url) return { type: 'direct', url: best.url };
      } catch {}
    }
    return null;
  }
}

// Normalize video object from various sources
function normalizeVideo(raw, source) {
  if (source === 'invidious') {
    return {
      id: raw.videoId || raw.id,
      title: raw.title,
      thumbnail: raw.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${raw.videoId}/hqdefault.jpg`,
      channelName: raw.author || raw.authorName,
      channelId: raw.authorId,
      channelAvatar: null,
      viewCount: raw.viewCount,
      published: raw.published || raw.publishedText,
      publishedText: raw.publishedText,
      duration: raw.lengthSeconds,
      isShort: raw.lengthSeconds && raw.lengthSeconds < 61,
    };
  }
  if (source === 'piped') {
    const id = raw.url?.replace('/watch?v=','') || raw.videoId;
    return {
      id,
      title: raw.title,
      thumbnail: raw.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      channelName: raw.uploaderName || raw.uploader,
      channelId: raw.uploaderUrl?.replace('/channel/',''),
      channelAvatar: raw.uploaderAvatar || null,
      viewCount: raw.views,
      published: raw.uploaded,
      publishedText: raw.uploadedDate,
      duration: raw.duration,
      isShort: raw.isShort || (raw.duration && raw.duration < 61),
    };
  }
  if (source === 'poke') {
    return {
      id: raw.id || raw.videoId,
      title: raw.title,
      thumbnail: raw.thumbnail || `https://i.ytimg.com/vi/${raw.id}/hqdefault.jpg`,
      channelName: raw.channelName || raw.author,
      channelId: raw.channelId,
      channelAvatar: null,
      viewCount: raw.viewCount,
      published: raw.publishDate || raw.published,
      publishedText: raw.published,
      duration: raw.duration,
      isShort: false,
    };
  }
  return raw;
}

function buildVideoCard(video, onclick) {
  const card = document.createElement('div');
  card.className = 'video-card';
  card.onclick = onclick || (() => navigate(`/watch?v=${video.id}`));

  const thumbSrc = video.thumbnail
    ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
    : '';

  const avatar = video.channelName
    ? `<div class="channel-avatar">${video.channelName.charAt(0).toUpperCase()}</div>`
    : '';

  const durationBadge = video.duration
    ? `<span style="position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,0.8);color:#fff;font-size:0.7rem;padding:2px 6px;border-radius:4px;">${formatDuration(video.duration)}</span>`
    : '';

  card.innerHTML = `
    <div style="position:relative;">
      <img class="video-thumb" src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg" alt="" loading="lazy" onerror="this.style.background='var(--bg3)';this.src=''">
      ${durationBadge}
    </div>
    <div class="video-info">
      ${avatar}
      <div class="video-meta">
        <div class="video-title">${escapeHtml(video.title || '')}</div>
        <div class="video-channel" onclick="event.stopPropagation();navigate('/channel/${video.channelId || ''}')">${escapeHtml(video.channelName || '')}</div>
        <div class="video-stats">
          ${video.viewCount ? `<span>${formatViews(video.viewCount)}${t('views')}</span>` : ''}
          ${video.publishedText ? `<span>・${video.publishedText}</span>` : video.published ? `<span>・${formatDate(video.published)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
  return card;
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Auth check
function requireAuth() {
  if (!localStorage.getItem('nuvis-auth')) {
    window.location.href = '/login';
    return false;
  }
  return true;
}

// Init on load
document.addEventListener('DOMContentLoaded', initTheme);
