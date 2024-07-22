const url = 'https://aniekwechidera.github.io/fireflex/YouTube%20data.json';
const localStorageKey = 'youtubeVideoData';

// Function to save data to localStorage
function saveDataToLocalStorage(data) {
    localStorage.setItem(localStorageKey, JSON.stringify(data));
}

// Function to load data from localStorage
function loadDataFromLocalStorage() {
    const data = localStorage.getItem(localStorageKey);
    return data ? JSON.parse(data) : null;
}

// Function to initialize the page
function initializePage() {
    const data = loadDataFromLocalStorage();
    if (data) {
        renderVideos(data);
    } else {
        fetchDataFromNetwork();
    }
}

// Function to fetch data from the network
function fetchDataFromNetwork() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            saveDataToLocalStorage(data);
            renderVideos(data);
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

// Function to render videos
function renderVideos(data) {
    const exploreContent = document.getElementById('exploreContent');
    exploreContent.innerHTML = ''; // Clear existing content
    const fragment = document.createDocumentFragment();

    data.forEach(video => {
        const videoContainer = document.createElement('div');
        videoContainer.classList.add('small-video');

        const iframe = document.createElement('iframe');
        iframe.width = "200";
        iframe.height = "200";
        iframe.src = "";
        iframe.dataset.src = video["Video Link"].replace("watch?v=", "embed/");
        iframe.loading = "lazy";
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('video-details');

        const videoTitle = document.createElement('h3');
        videoTitle.textContent = video["Video TItle"];

        const additionalDetailsContainer = document.createElement('div');
        additionalDetailsContainer.classList.add('details-container');

        const views = document.createElement('p');
        views.textContent = `Views: ${video["Number of Views"].replace(' views', '')}`;

        const separator = document.createElement('p');
        separator.textContent = '•';

        const timePosted = document.createElement('p');
        timePosted.textContent = video["Time Posted"];

        additionalDetailsContainer.appendChild(views);
        additionalDetailsContainer.appendChild(separator);
        additionalDetailsContainer.appendChild(timePosted);

        detailsContainer.appendChild(videoTitle);
        detailsContainer.appendChild(additionalDetailsContainer);

        videoContainer.appendChild(iframe);
        videoContainer.appendChild(detailsContainer);

        fragment.appendChild(videoContainer);
    });

    exploreContent.appendChild(fragment);

    // Lazy loading iframes using Intersection Observer
    const iframes = document.querySelectorAll('iframe[data-src]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                iframe.src = iframe.dataset.src;
                observer.unobserve(iframe);
            }
        });
    });

    iframes.forEach(iframe => observer.observe(iframe));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializePage();

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(function () {
        const query = searchInput.value.toLowerCase();
        const videoContainers = document.querySelectorAll('.small-video');
        videoContainers.forEach(videoContainer => {
            const title = videoContainer.querySelector('h3').textContent.toLowerCase();
            if (title.includes(query)) {
                videoContainer.style.display = '';
            } else {
                videoContainer.style.display = 'none';
            }
        });
    }, 300)); // Debounce with a 300ms delay
});

// Debounce function to limit the rate of function calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
