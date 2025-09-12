document.addEventListener('DOMContentLoaded', () => {
  SWM.initCommonUI();
  initCommunityPage();
});

function initCommunityPage() {
  const user = SWM.requireAuth();
  if (!user) return;

  const postForm = document.getElementById('postForm');
  const postText = document.getElementById('postText');
  const postImageInput = document.getElementById('postImage');
  const fileNameSpan = document.getElementById('fileName');
  const postMessage = document.getElementById('postMessage');
  const feed = document.getElementById('feed');
  const imagePreviewContainer = document.createElement('div');
  imagePreviewContainer.classList.add('mt-4', 'flex', 'justify-center');
  postForm.insertBefore(imagePreviewContainer, postForm.querySelector('div.flex.items-center.justify-between.gap-3'));

  let imageDataUrl = '';

  postImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      fileNameSpan.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        imageDataUrl = e.target.result;
        imagePreviewContainer.innerHTML = `<img src="${imageDataUrl}" alt="Image preview" class="image-preview" />`;
      };
      reader.readAsDataURL(file);
    } else {
      fileNameSpan.textContent = '';
      imageDataUrl = '';
      imagePreviewContainer.innerHTML = '';
    }
  });

  postForm.addEventListener('submit', handlePostSubmit);

  function handlePostSubmit(event) {
    event.preventDefault();

    const content = postText.value.trim();
    if (!content && !imageDataUrl) {
      postMessage.textContent = 'Please write something or upload an image.';
      postMessage.className = 'text-sm text-red-600';
      return;
    }

    const newPost = {
      id: SWM.uid(),
      authorEmail: user.email,
      authorName: user.name || SWM.shortName(user),
      content,
      imageDataUrl,
      likes: [],
      comments: [],
      createdAt: Date.now(),
    };

    const posts = SWM.getPosts();
    posts.unshift(newPost);
    SWM.setPosts(posts);

    // Add points for creating a post
    SWM.addPoints(user.email, 5, 'Created a post');

    postText.value = '';
    postImageInput.value = '';
    fileNameSpan.textContent = '';
    imageDataUrl = '';
    imagePreviewContainer.innerHTML = '';
    postMessage.textContent = 'Posted!';
    postMessage.className = 'text-sm text-eco';

    renderFeed();
  }

  function renderFeed() {
    const posts = SWM.getPosts();
    if (!posts.length) {
      feed.innerHTML = '<p class="text-slate-500 text-center">No posts yet.</p>';
      return;
    }
    feed.innerHTML = posts
      .map(
        (post) => `
        <div class="post-card fade-in">
          <div class="flex items-center gap-2 mb-2">
            <span class="font-semibold">${post.authorName}</span>
            <span class="text-xs text-slate-400">${SWM.formatDateTime(post.createdAt)}</span>
          </div>
          <div class="mb-2">${post.content ? post.content.replace(/\n/g, '<br>') : ''}</div>
          ${post.imageDataUrl ? `<img src="${post.imageDataUrl}" alt="Post image" class="image-preview mb-2" />` : ''}
        </div>
      `
      )
      .join('');
  }

  renderFeed();

  // Optionally, render leaderboard if you want
  if (document.getElementById('leaderboardList')) {
    renderLeaderboard(document.getElementById('leaderboardList'));
  }
}

function renderLeaderboard(listEl) {
  if (!listEl) return;
  const me = SWM.getCurrentUser();
  const leaders = SWM.computeLeaderboard(5);
  listEl.innerHTML = leaders
    .map(
      (u, i) => `
    <li class="flex items-center justify-between rounded-lg border border-emerald-100 px-3 py-2 ${me && me.email === u.email ? 'bg-emerald-50' : 'bg-white'}">
      <span class="flex items-center gap-2">
        <span class="w-6 text-slate-500">#${i + 1}</span>
        <span class="font-medium">${SWM.shortName(u)}</span>
      </span>
      <span class="text-eco font-semibold">${u.points || 0} pts</span>
    </li>`
    )
    .join('');
}


