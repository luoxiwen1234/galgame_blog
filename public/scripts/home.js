const characters = [
  { id: 'luna', name: '樱小路露娜', ruby: '桜小路 ルナ', series: '近月少女的礼仪', group: 'moon', image: '/assets/navel-luna.jpg', color: '#e99ab7', wiki: 'https://zh.moegirl.org.cn/zh-hans/%E6%A8%B1%E5%B0%8F%E8%B7%AF%E9%9C%B2%E5%A8%9C', quote: '才华若值得被承认，就把它完整地呈现在我面前。', note: '樱公馆的主人，也是服装设计学院备受瞩目的学生。' },
  { id: 'asahi', name: '小仓朝日', ruby: '小倉 朝日', series: '近月少女的礼仪', group: 'moon', image: '/assets/navel-asahi.jpg', color: '#8d79c6', wiki: 'https://zh.moegirl.org.cn/zh-hans/%E5%B0%8F%E4%BB%93%E6%9C%9D%E6%97%A5', quote: '为了追寻服装设计的梦想，我来到了这里。', note: '以女仆身份在樱公馆工作，并进入服装专修学院学习。' },
  { id: 'resona', name: '大藏里想奈', ruby: '大蔵 りそな', series: '近月少女的礼仪', group: 'moon', image: '/assets/navel-resona.jpg', color: '#b18bd4', wiki: 'https://zh.moegirl.org.cn/zh-hans/%E5%A4%A7%E8%97%8F%E9%87%8C%E6%83%B3%E5%A5%88', quote: '我会帮助哥哥，因为那是我自己做出的选择。', note: '游星的异母妹妹，也是将哥哥引向新生活的重要之人。' },
  { id: 'saika', name: '樱小路才华', ruby: '桜小路 才華', series: '近月少女的礼仪', group: 'moon', image: '/assets/navel-saika.jpg', color: '#d58ba8', wiki: 'https://zh.moegirl.org.cn/zh-hans/%E5%B0%8F%E4%BB%93%E6%9C%9D%E9%98%B3', quote: '即使背负耀眼的名字，也要亲手完成自己的作品。', note: '以小仓朝日的身份进入服装设计科，认真面对自己的才能。' },
  { id: 'shiroha', name: '鸣濑白羽', ruby: '鳴瀬 しろは', series: 'Summer Pockets RB', group: 'summer', image: '/assets/summer-shiroha.png', color: '#78bde3', wiki: 'https://zh.moegirl.org.cn/zh-hans/%E9%B8%A3%E6%BF%91%E7%99%BD%E7%BE%BD', quote: '我不太擅长和人相处，也许这样反而更轻松。', note: '住在鸟白岛上的少女，安静而略显疏离。' },
  { id: 'ao', name: '空门苍', ruby: '空門 蒼', series: 'Summer Pockets RB', group: 'summer', image: '/assets/summer-ao.png', color: '#8d86d4', wiki: 'https://zh.moegirl.org.cn/zh-hans/%E7%A9%BA%E9%97%A8%E8%8B%8D', quote: '岛上的夏天很短，所以才不能浪费每一天。', note: '在岛上寻找特殊蝴蝶的少女，爽朗中藏着细腻心绪。' },
  { id: 'kamome', name: '久岛鸥', ruby: '久島 鴎', series: 'Summer Pockets RB', group: 'summer', image: '/assets/summer-kamome.png', color: '#ef9cae', wiki: 'https://zh.moegirl.org.cn/zh-hans/%E4%B9%85%E5%B2%9B%E9%B8%A5', quote: '去寻找宝藏吧，在这个只属于我们的夏天。', note: '带着行李箱来到岛上的少女，喜欢冒险与藏宝图。' },
  { id: 'tsumugi', name: '紬文德斯', ruby: '紬 ヴェンダース', series: 'Summer Pockets RB', group: 'summer', image: '/assets/summer-tsumugi.png', color: '#f3c366', wiki: 'https://zh.moegirl.org.cn/zh-hans/%E4%8C%B7%E6%96%87%E5%BE%B7%E6%96%AF', quote: '我正在寻找想要做的事情，也寻找这个夏天的答案。', note: '在岛上寻找自我的少女，举止天然又认真。' },
];

const rail = document.querySelector('#characterRail');
const detail = document.querySelector('#characterDetail');
let filter = 'all';
let selectedId = 'luna';

function renderCharacters() {
  if (!rail || !detail) return;
  const visible = filter === 'all' ? characters : characters.filter((item) => item.group === filter);
  if (!visible.some((item) => item.id === selectedId)) selectedId = visible[0].id;
  const selected = characters.find((item) => item.id === selectedId);
  const relatedTag = selected.group === 'moon' ? '近月少女的礼仪' : 'Summer Pockets';
  detail.style.setProperty('--character-color', selected.color);
  detail.innerHTML = `<div class="detail-image ${selected.group}"><img src="${selected.image}" alt="${selected.name}角色图"></div><div class="detail-copy"><span>${selected.series}</span><h3>${selected.name}</h3><p class="ruby">${selected.ruby}</p><blockquote>“${selected.quote}”</blockquote><p>${selected.note}</p><div class="detail-links"><a class="wiki-link" href="/tags/${encodeURIComponent(relatedTag)}/">阅读相关文章 <span aria-hidden="true">→</span></a><a class="wiki-link" href="${selected.wiki}" target="_blank" rel="noreferrer" aria-label="在萌娘百科查看${selected.name}">前往萌娘百科 <span aria-hidden="true">↗</span></a></div></div>`;
  rail.innerHTML = visible.map((item, index) => `<button class="character-thumb ${item.group} ${item.id === selectedId ? 'active' : ''}" data-id="${item.id}"><span class="thumb-index">0${index + 1}</span><span class="thumb-image"><img src="${item.image}" alt=""></span><span class="thumb-name"><strong>${item.name}</strong><small>${item.series}</small></span></button>`).join('');
}

document.querySelector('#filters')?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach((item) => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-selected', item === button ? 'true' : 'false');
  });
  renderCharacters();
});

rail?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-id]');
  if (!button) return;
  selectedId = button.dataset.id;
  renderCharacters();
});

const lightbox = document.querySelector('#lightbox');
const closeLightbox = () => { if (lightbox) lightbox.hidden = true; document.body.style.overflow = ''; };
document.querySelectorAll('.memory').forEach((item) => item.addEventListener('click', () => {
  document.querySelector('#lightboxImage').src = item.dataset.image;
  document.querySelector('#lightboxImage').alt = item.dataset.title;
  document.querySelector('#lightboxTitle').textContent = item.dataset.title;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}));
document.querySelector('#lightboxClose')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
renderCharacters();
