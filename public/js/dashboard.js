const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/auth';
}

const profileForm = document.getElementById('profileForm');
const projectForm = document.getElementById('projectForm');
const projectsGrid = document.getElementById('projectsGrid');
const copyLinkBtn = document.getElementById('copyLink');
const logoutBtn = document.getElementById('logoutBtn');

let portfolioLink = '';

const authHeaders = {
  Authorization: `Bearer ${token}`
};

const renderProjects = (projects) => {
  projectsGrid.innerHTML = projects
    .map(
      (project) => `
      <article class="rounded-xl border border-border bg-card/80 p-4 space-y-2">
        <img src="${project.imageUrl}" class="h-40 w-full rounded-lg object-cover" alt="${project.title}" />
        <h3 class="font-bold">${project.title}</h3>
        <p class="text-sm text-textSub">${project.description}</p>
        <p class="text-xs text-textSub">${project.tags.join(', ')}</p>
        <div class="flex gap-2">
          <a href="${project.externalLink}" target="_blank" class="text-accent text-sm">Open</a>
          <button data-id="${project._id}" class="delete-btn text-red-400 text-sm">Delete</button>
        </div>
      </article>
    `
    )
    .join('');

  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      await fetch(`/api/dashboard/projects/${button.dataset.id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      await loadDashboard();
    });
  });
};

const loadDashboard = async () => {
  const response = await fetch('/api/dashboard/overview', { headers: authHeaders });
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/auth';
    return;
  }

  const data = await response.json();
  portfolioLink = data.portfolioLink;

  profileForm.fullName.value = data.user.fullName || '';
  profileForm.bio.value = data.user.bio || '';
  profileForm.skills.value = (data.user.skills || []).join(', ');
  profileForm.github.value = data.user.socialLinks?.github || '';
  profileForm.linkedin.value = data.user.socialLinks?.linkedin || '';
  profileForm.twitter.value = data.user.socialLinks?.twitter || '';
  profileForm.website.value = data.user.socialLinks?.website || '';
  profileForm.email.value = data.user.socialLinks?.email || '';

  renderProjects(data.projects);
};

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const body = new FormData(profileForm);

  await fetch('/api/dashboard/profile', {
    method: 'PUT',
    headers: authHeaders,
    body
  });

  await loadDashboard();
});

projectForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const body = new FormData(projectForm);

  await fetch('/api/dashboard/projects', {
    method: 'POST',
    headers: authHeaders,
    body
  });

  projectForm.reset();
  await loadDashboard();
});

copyLinkBtn.addEventListener('click', async () => {
  if (portfolioLink) {
    await navigator.clipboard.writeText(portfolioLink);
    copyLinkBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyLinkBtn.textContent = 'Copy Portfolio Link';
    }, 1600);
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '/auth';
});

loadDashboard();
