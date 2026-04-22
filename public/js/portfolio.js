const username = window.location.pathname.replace('/', '');
const profileHeader = document.getElementById('profileHeader');
const projectGrid = document.getElementById('projectGrid');
const token = localStorage.getItem('token');

const getLink = (value, label) =>
  value ? `<a href="${value.includes('@') ? `mailto:${value}` : value}" target="_blank" class="text-accent text-sm">${label}</a>` : '';

const loadPortfolio = async () => {
  const response = await fetch(`/api/portfolios/${username}`);
  if (!response.ok) {
    profileHeader.innerHTML = '<p class="text-textSub">Portfolio not found.</p>';
    return;
  }

  const data = await response.json();

  profileHeader.innerHTML = `
    <div class="flex flex-col md:flex-row gap-5 md:items-center justify-between">
      <div class="flex gap-4 items-start">
        <img src="${data.user.profileImage}" class="h-20 w-20 rounded-full object-cover" alt="avatar" />
        <div>
          <h1 class="text-3xl font-extrabold">${data.user.fullName}</h1>
          <p class="text-textSub">@${data.user.username}</p>
          <p class="mt-2 text-textSub max-w-2xl">${data.user.bio || 'No bio added yet.'}</p>
          <div class="flex flex-wrap gap-2 mt-3">${(data.user.skills || []).map((skill) => `<span class="px-2 py-1 rounded-md text-xs bg-bg border border-border">${skill}</span>`).join('')}</div>
        </div>
      </div>
      <div class="text-right space-y-2">
        <p class="text-sm text-textSub">Views: ${data.user.viewCount} · Likes: <span id="likesCount">${data.likesCount}</span></p>
        <div class="space-x-2">
          <button id="likeBtn" class="px-3 py-2 bg-accent rounded-lg">Like</button>
          <button id="shareBtn" class="px-3 py-2 border border-border rounded-lg">Share</button>
        </div>
        <div class="flex flex-wrap justify-end gap-2">
          ${getLink(data.user.socialLinks?.github, 'GitHub')}
          ${getLink(data.user.socialLinks?.linkedin, 'LinkedIn')}
          ${getLink(data.user.socialLinks?.twitter, 'Twitter')}
          ${getLink(data.user.socialLinks?.website, 'Website')}
          ${getLink(data.user.socialLinks?.email, 'Contact')}
        </div>
      </div>
    </div>
  `;

  projectGrid.innerHTML = data.projects
    .map(
      (project) => `
      <article class="rounded-xl border border-border bg-card/80 p-4 hover:border-accent transition">
        <img src="${project.imageUrl}" alt="${project.title}" class="h-40 w-full object-cover rounded-lg mb-3" />
        <h3 class="font-bold">${project.title}</h3>
        <p class="text-sm text-textSub mt-2">${project.description}</p>
        <p class="text-xs text-textSub mt-2">${project.tags.join(', ')}</p>
        ${project.externalLink ? `<a href="${project.externalLink}" target="_blank" class="text-accent text-sm mt-2 inline-block">Visit project</a>` : ''}
      </article>
    `
    )
    .join('');

  document.getElementById('shareBtn').addEventListener('click', async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert('Portfolio link copied');
  });

  document.getElementById('likeBtn').addEventListener('click', async () => {
    if (!token) {
      window.location.href = '/auth';
      return;
    }

    const likeResponse = await fetch(`/api/portfolios/${username}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const likeData = await likeResponse.json();
    if (likeResponse.ok) {
      document.getElementById('likesCount').textContent = likeData.likesCount;
    }
  });
};

loadPortfolio();
