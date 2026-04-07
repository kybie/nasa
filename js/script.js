// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const getButton = document.getElementById('getImages');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// NASA API key and OMDb API key are loaded from config.js

// Show a loading message while fetching
function showLoading() {
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔭</div>
      <p>🔄 Loading space photos…</p>
    </div>
  `;
}

// Fetch APOD data for the selected date range
async function fetchAPOD(startDate, endDate) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Get the best thumbnail URL for a video APOD item
function getVideoThumbnail(item) {
  // Prefer the dedicated thumbnail_url field if available
  if (item.thumbnail_url) {
    return item.thumbnail_url;
  }
  // Fall back to the HD image from NASA (commonly available for video APODs)
  // Extract the image URL from the item if available
  if (item.url && item.url.includes('youtube')) {
    // YouTube video — extract video ID and build thumbnail URL
    const videoId = item.url.split('v=')[1]?.split('&')[0] || item.url.split('/').pop();
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  if (item.url && item.url.includes('vimeo')) {
    // Vimeo video — can't easily get thumbnail without extra API call
    // Use NASA's embedded image as fallback
    return item.url.replace('/vimeo.com/', '/vimeo.com/video/') + '/thumbnail.jpg';
  }
  // Default fallback
  return 'https://apod.nasa.gov/apod/image/2604/Artemis_II_Jack_hd_1080.jpg';
}

// Render gallery items from APOD data
function renderGallery(items) {
  gallery.innerHTML = '';

  items.forEach(item => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    // Handle video entries — show thumbnail with play icon and link
    if (item.media_type === 'video') {
      const thumbUrl = getVideoThumbnail(item);
      galleryItem.innerHTML = `
        <div class="video-thumbnail" style="position:relative; background:#000;height:200px;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;">
          <img src="${thumbUrl}" alt="${item.title}" style="width:100%;height:200px;object-fit:cover;opacity:0.6;" />
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:40px;color:white;text-align:center;padding:10px;">▶<br><span style="font-size:12px;">Click to play</span></div>
        </div>
        <p><strong>${item.title}</strong><br/>${item.date}</p>
      `;
    } else {
      galleryItem.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <p><strong>${item.title}</strong><br/>${item.date}</p>
      `;
    }

    galleryItem.addEventListener('click', () => openModal(item));

    gallery.appendChild(galleryItem);
  });
}

// Handle button click
getButton.addEventListener('click', async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert('Please select a date range.');
    return;
  }

  showLoading();

  try {
    const data = await fetchAPOD(startDate, endDate);
    renderGallery(data);
  } catch (error) {
    console.error('Failed to fetch APOD data:', error);
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">⚠️</div>
        <p>Failed to load space photos. Please try again.</p>
      </div>
    `;
  }
});

// Open modal with full APOD details
function openModal(item) {
  let mediaContent = '';

  if (item.media_type === 'video') {
    // For videos: use the correct thumbnail and link to open the video
    const thumbUrl = getVideoThumbnail(item);
    const thumbImg = `<img src="${thumbUrl}" alt="${item.title}" style="width:100%;display:block;" />`;
    const videoLink = `<a href="${item.url}" target="_blank" style="display:block;padding:10px;background:#0b3d91;color:white;text-align:center;text-decoration:none;font-weight:bold;">▶ Watch Video</a>`;
    mediaContent = thumbImg + videoLink;
  } else {
    mediaContent = `<img src="${item.url}" alt="${item.title}" />`;
  }

  modalBody.innerHTML = `
    ${mediaContent}
    <div class="modal-info">
      <div class="modal-title">${item.title}</div>
      <div class="modal-date">${item.date}</div>
      <div class="modal-explanation">${item.explanation}</div>
    </div>
  `;
  modal.classList.add('show');
}

// Close modal
modalClose.addEventListener('click', () => {
  modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('show')) {
    modal.classList.remove('show');
  }
});
