// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const getButton = document.querySelector('button');

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

    // Handle video entries (show thumbnail with reduced opacity)
    if (item.media_type === 'video') {
      galleryItem.innerHTML = `
        <img src="${item.thumbnail_url || item.url}" alt="${item.title}" style="opacity: 0.5;" />
        <p><strong>${item.title}</strong><br/>${item.date}</p>
      `;
    } else {
      galleryItem.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <p><strong>${item.title}</strong><br/>${item.date}</p>
      `;
    }

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
