// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const getButton = document.querySelector('button');
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

// Render gallery items from APOD data
function renderGallery(items) {
  gallery.innerHTML = '';

  items.forEach(item => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    // Handle video entries — embed NASA APOD page so video plays inline
    if (item.media_type === 'video') {
      const apDate = item.date.replace(/-/g, '').substring(2);
      const apUrl = `https://apod.nasa.gov/apod/ap${apDate}.html`;
      galleryItem.innerHTML = `
        <iframe src="${apUrl}" style="width:100%;height:220px;border:none;" loading="lazy"></iframe>
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
    // Embed the NASA APOD page for videos
    const apDate = item.date.replace(/-/g, '').substring(2);
    const apUrl = `https://apod.nasa.gov/apod/ap${apDate}.html`;
    mediaContent = `<iframe src="${apUrl}" style="width:100%;height:450px;border:none;" loading="lazy"></iframe>`;
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
