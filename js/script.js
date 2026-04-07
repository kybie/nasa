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

// ─── Random Space Fact on Load ───────────────────────────────────────────────
const spaceFacts = [
  "A day on Venus is longer than its year — Venus takes 243 Earth days to rotate once but only 225 days to orbit the Sun.",
  "Neutron stars are so dense that a single teaspoon of their material would weigh about 6 billion tons on Earth.",
  "The Sun accounts for 99.86% of all the mass in our entire solar system.",
  "There are more trees on Earth (~3 trillion) than stars in the Milky Way (~100–400 billion).",
  "Olympus Mons on Mars is the largest volcano in the solar system — roughly 3 times the height of Mount Everest.",
  "The largest known structure in the universe is the Hercules-Corona Borealis Great Wall, spanning 10 billion light-years.",
  "One million Earths could fit inside the Sun.",
  "Saturn would float in water — its density is less than that of water (0.687 g/cm³ vs 1 g/cm³).",
  "The footprints left by Apollo astronauts on the Moon will last millions of years because there is no wind or water to erode them.",
  "A black hole the mass of a coin would have stronger gravity than Earth — it would sink straight through the planet.",
  "The International Space Station travels at about 17,500 mph and orbits Earth 16 times per day.",
  "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years and is larger than Earth.",
  "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.",
  "Mars has the largest dust storms in the solar system, sometimes covering the entire planet for months.",
  "The core of the Sun reaches temperatures of about 27 million°F — hot enough to fuse hydrogen into helium.",
  "Europa, one of Jupiter's moons, is believed to have a subsurface ocean with more water than all of Earth's oceans combined.",
  "The Voyager 1 spacecraft is the most distant human-made object, over 15 billion miles from Earth — and still sending data.",
  "A year on Mercury (88 Earth days) is shorter than its day (59 Earth days).",
  "The observable universe contains roughly 200 billion galaxies.",
  "Pluto's heart-shaped glacier (Tombaugh Regio) is made of nitrogen ice and is bigger than Texas."
];

// Pick one random fact and display it in the placeholder area
function showRandomFact() {
  const factEl = document.getElementById('spaceFact');
  if (!factEl) return;
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  factEl.textContent = `💡 Did you know? ${spaceFacts[randomIndex]}`;
  factEl.style.display = 'block';
}

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
  // YouTube video — extract video ID and build thumbnail URL
  if (item.url && item.url.includes('youtube')) {
    const videoId = item.url.split('v=')[1]?.split('&')[0] || item.url.split('/').pop();
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  // Vimeo video — use NASA embedded image as fallback
  if (item.url && item.url.includes('vimeo')) {
    return 'https://apod.nasa.gov/apod/image/2604/Artemis_II_Jack_hd_1080.jpg';
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

// ─── Init ──────────────────────────────────────────────────────────────────
showRandomFact();
