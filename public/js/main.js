const featuredGrid = document.getElementById('featuredGrid');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const portfolioCard = (item) => `
  <a href="/${item.username}" class="group rounded-xl border border-border bg-card/80 p-4 hover:border-accent transition duration-300">
    <img src="${item.profileImage}" alt="${item.username}" class="h-16 w-16 rounded-full object-cover mb-3" />
    <h3 class="font-bold group-hover:text-accent">${item.fullName}</h3>
    <p class="text-sm text-textSub">@${item.username}</p>
    <p class="text-sm text-textSub mt-2 line-clamp-2">${item.bio || 'No bio yet.'}</p>
    <div class="flex flex-wrap gap-2 mt-3">${(item.skills || []).slice(0, 4).map((skill) => `<span class="text-xs px-2 py-1 bg-bg border border-border rounded-md">${skill}</span>`).join('')}</div>
  </a>`;

const loadFeatured = async () => {
  const response = await fetch('/api/portfolios/featured');
  const data = await response.json();
  featuredGrid.innerHTML = data.map(portfolioCard).join('');
};

const searchPortfolios = async () => {
  const q = searchInput.value.trim();
  if (!q) {
    searchResults.innerHTML = '';
    return;
  }

  const response = await fetch(`/api/portfolios/search?q=${encodeURIComponent(q)}`);
  const data = await response.json();
  searchResults.innerHTML = data.length ? data.map(portfolioCard).join('') : '<p class="text-textSub">No results found.</p>';
};

searchBtn.addEventListener('click', searchPortfolios);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchPortfolios();
  }
});

loadFeatured();
