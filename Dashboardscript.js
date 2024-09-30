// Example dataset
const url = 'https://aniekwechidera.github.io/fireflex/YouTube%20data.json';

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    // Function to convert view counts to numbers
    function convertViews(viewString) {
        viewString = viewString.replace(' views', '');
        if (viewString.includes('K')) {
          viewString = viewString.replace('K', '');
          if (viewString.includes('.')) {
            viewString = parseFloat(viewString) * 1000;
          } else {
            viewString = parseInt(viewString) * 1000;
          }
        } else if (viewString.includes('M')) {
          viewString = viewString.replace('M', '');
          if (viewString.includes('.')) {
            viewString = parseFloat(viewString) * 1000000;
          } else {
            viewString = parseInt(viewString) * 1000000;
          }
        } else {
          viewString = parseInt(viewString);
        }
        return parseInt(viewString);
      }

    // Function to format numbers with suffixes
    function formatViews(number) {
      if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
      } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
      } else {
        return number.toString();
      }
    }

    // Assuming each object in the JSON array represents a video
    const numberOfVideos = data.length;

    // Calculate the total number of views
    const totalViews = data.reduce((sum, video) => {
      return sum + convertViews(video["Number of Views"]);
    }, 0);

    document.getElementById('videoCount').innerText = numberOfVideos;
    // console.log('Total number of views:', totalViews);
    document.getElementById('totalViews').innerText = formatViews(totalViews);
  })
  .catch(error => console.error('Error fetching JSON:', error));



const dataset = {   
    kpis: {
        videos: 310,
        totalViews: '47M',
        subscribers: '472k'
    },
    top10Videos: [
        { title: 'Video 1', views: 1000000, type: 'LF' },
        { title: 'Video 2', views: 900000, type: 'SF' },
        { title: 'Video 3', views: 900088, type: 'SF' },
        { title: 'Video 4', views: 900088, type: 'SF' },
        // ... more data
    ],
    publishedVideos: [
        { time: '1 week ago', count: 10, type: 'LF' },
        { time: '1 month ago', count: 20, type: 'SF' },
        // ... more data
    ],
    videoDistribution: {
        LF: 200,
        SF: 110
    }
};

// Update KPI values


document.getElementById('subscribers').innerText = dataset.kpis.subscribers;

// Top 10 Videos Chart


let top10Chart = null;

function updateChart(videoType) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Function to convert view counts to numbers
            function convertViews(viewString) {
                viewString = viewString.replace(' views', '');
                if (viewString.includes('K')) {
                    viewString = viewString.replace('K', '');
                    if (viewString.includes('.')) {
                        viewString = parseFloat(viewString) * 1000;
                    } else {
                        viewString = parseInt(viewString) * 1000;
                    }
                } else if (viewString.includes('M')) {
                    viewString = viewString.replace('M', '');
                    if (viewString.includes('.')) {
                        viewString = parseFloat(viewString) * 1000000;
                    } else {
                        viewString = parseInt(viewString) * 1000000;
                    }
                } else {
                    viewString = parseInt(viewString);
                }
                return parseInt(viewString);
            }

            // Filter for long-form videos
            const longFormVideos = data.filter(video => video.Type === videoType);

            // Convert view counts to numbers
            longFormVideos.forEach(video => {
                video.views = convertViews(video["Number of Views"]);
            });

            // Sort by views in descending order and take the top 10
            const top10Videos = longFormVideos.sort((a, b) => b.views - a.views).slice(0, 10);

            // Check if a chart instance already exists and destroy it
            if (top10Chart) {
                top10Chart.destroy();
            }

            // Setup the chart
            Chart.defaults.font.size = 10;
            const top10ChartCtx = document.getElementById('top10Chart').getContext('2d');
            top10Chart = new Chart(top10ChartCtx, {
                type: 'bar',
                data: {
                    labels: top10Videos.map(video => video["Video TItle"]),
                    datasets: [{
                        label: 'Views',
                        data: top10Videos.map(video => video.views),
                        backgroundColor: top10Videos.map(video => video.views > 1000000 ? 'rgba(254, 5, 34, 0.582)' : 'rgba(254, 5, 34, 0.582)'),
                        borderColor: top10Videos.map(video => video.views > 1000000 ? 'rgba(254, 5, 34)' : 'rgba(254, 5, 34)'),
                        borderWidth: 1,
                        borderRadius: 10,
                        hoverBackgroundColor: top10Videos.map(video => video.views > 1000000 ? 'rgba(254, 5, 34)' : 'rgba(254, 5, 34)'),
                        hoverBorderColor: top10Videos.map(video => video.views > 1000000 ? 'rgba(254, 5, 34)' : 'rgba(254, 5, 34)')
                    }]
                },
                options: {
                    responsive: true,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const videoTitle = top10Videos[context.dataIndex]["Video TItle"];
                                    const viewCount = context.raw.toLocaleString();
                                    return `${videoTitle}: ${viewCount} views`;
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    const filterBtn = document.getElementById('filterBtnTop10');
    const filterOptions = document.querySelector('#chartContainer .filter-options');
    const radioButtons = document.querySelectorAll('input[name="sort"]');

    // Set default chart to "LF"
    updateChart('LF');

    if (filterBtn) {
        filterBtn.addEventListener('click', function () {
            filterOptions.style.display = filterOptions.style.display === 'block' ? 'none' : 'block';
            filterBtn.classList.toggle('open');
        });
    }

    // Add event listener to radio buttons
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            const selectedSort = document.querySelector('input[name="sort"]:checked');
            if (selectedSort) {
                const videoType = selectedSort.value; // 'LF' or 'SF'
                updateChart(videoType);
                filterOptions.style.display = 'none';
                filterBtn.classList.remove('open');
            } else {
                alert('Please select a sort option.');
            }
        });
    });
});




  

// // Dynamically create HTML elements for video titles above the bars
// const chartContainer = document.getElementById('chartContainer'); // Assuming chartContainer is the parent div of the canvas
// top10Videos.forEach((video, index) => {
//     const titleDiv = document.createElement('div');
//     titleDiv.innerText = video.title;
//     titleDiv.style.position = 'absolute';
//     titleDiv.style.left = '0';
//     titleDiv.style.top = `${index * 30}px`; // Adjust this value to position the titles properly
//     titleDiv.style.width = '100%';
//     titleDiv.style.textAlign = 'left'; // Change this to 'center' or 'right' as needed
//     chartContainer.appendChild(titleDiv);
// });

// Published Videos Chart
let allVideos = [];

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    allVideos = data.map(video => ({
      ...video,
      views: convertViews(video["Number of Views"]),
      timePosted: video["Time Posted"]
    }));
    const publishedData = countVideosByTimePosted(allVideos);
    updatePublishedChart(publishedData);
  })
  .catch(error => console.error('Error fetching JSON:', error));

function convertViews(viewString) {
  viewString = viewString.replace(' views', '');
  if (viewString.includes('K')) {
    viewString = viewString.replace('K', '');
    return parseFloat(viewString) * 1000;
  } else if (viewString.includes('M')) {
    viewString = viewString.replace('M', '');
    return parseFloat(viewString) * 1000000;
  } else {
    return parseInt(viewString);
  }
}

function countVideosByTimePosted(videos) {
    const counts = {};
    videos.forEach(video => {
      const time = video.timePosted;
      if (time) {  // Check if timePosted is defined and not empty
        if (counts[time]) {
          counts[time]++;
        } else {
          counts[time] = 1;
        }
      }
    });
  return Object.keys(counts).map(time => ({
    time: time,
    count: counts[time]
  }));
}

function updatePublishedChart(publishedData) {
  const publishedChartCtx = document.getElementById('publishedChart').getContext('2d');
  const publishedChart = new Chart(publishedChartCtx, {
    type: 'bar',
    data: {
      labels: publishedData.map(video => video.time),
      datasets: [{
        label: 'Videos Published',
        data: publishedData.map(video => video.count),
        backgroundColor: 'rgba(254, 5, 34, 0.582)',
        borderColor: 'rgba(254, 5, 34)',
        borderWidth: 1,
        borderRadius: 50,
        hoverBackgroundColor: 'rgba(254, 5, 34)',
        hoverBorderColor: 'rgba(254, 5, 34)'
      }]
    },
    options: {
      
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.raw.toLocaleString()} videos`;
            }
          }
        }
      }
    }
  });
}





// Video Distribution Chart
fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Process the data to count the number of 'SF' and 'LF' videos
                const videoCount = { SF: 0, LF: 0 };

                data.forEach(video => {
                    if (video.Type === 'SF') {
                        videoCount.SF++;
                    } else if (video.Type === 'LF') {
                        videoCount.LF++;
                    }
                });

                // Create the chart
                const distributionChartCtx = document.getElementById('distributionnChart').getContext('2d');
                const distributionChart = new Chart(distributionChartCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Long Form', 'Short Form'],
                        datasets: [{
                            label: 'Video Distribution',
                            data: [videoCount.LF, videoCount.SF],
                            backgroundColor: ['rgba(254, 5, 34, 0.582)', 'rgba(180, 235, 234, 0.582'],
                            borderColor: ['rgba(231, 76, 60, 1)', 'rgba(235, 235, 234, 1)'],
                            borderWidth: 1,
                            hoverBackgroundColor: ['rgba(254, 5, 34)', 'rgba(150, 210, 234, 1)']
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right', // Move the legend to the right
                                labels: {
                                    boxWidth: 20,
                                    padding: 20,
                                    usePointStyle: true, // Use point style to reduce legend size
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${context.raw.toLocaleString()} videos`;
                                    }
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching JSON:', error));


// Views Distribution Chart
// Function to convert view counts from string to number
function convertViews(viewString) {
  viewString = viewString.replace(' views', '');
  if (viewString.includes('K')) {
      viewString = viewString.replace('K', '');
      return parseFloat(viewString) * 1000;
  } else if (viewString.includes('M')) {
      viewString = viewString.replace('M', '');
      return parseFloat(viewString) * 1000000;
  } else {
      return parseInt(viewString);
  }
}

fetch(url)
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
  })
  .then(data => {
      let curiosityViews = 0;
      let otherViews = 0;

      data.forEach(video => {
          const views = convertViews(video["Number of Views"]);
          if (video["Video TItle"].toUpperCase().includes("CURIOSITY")) {
              curiosityViews += views;
          } else {
              otherViews += views;
          }
      });

      // Create the chart
      const viewsDistributionChartCtx = document.getElementById('viewsDistributionnChart').getContext('2d');
      new Chart(viewsDistributionChartCtx, {
          type: 'doughnut',
          data: {
              labels: ['Curiosity Series', 'Other Videos'],
              datasets: [{
                  label: 'Views Distribution',
                  data: [curiosityViews, otherViews],
                  backgroundColor: ['rgba(180, 235, 234, 0.582', 'rgba(254, 5, 34, 0.582)'],
                  borderColor: ['rgba(235, 235, 234, 1)', 'rgba(231, 76, 60, 1)'],
                  borderWidth: 1,
                  hoverBackgroundColor: ['rgba(150, 210, 234, 1)', 'rgba(254, 5, 34)']
              }]
          },
          options: {
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                  legend: {
                      display: true,
                      position: 'right',
                      labels: {
                          boxWidth: 20,
                          padding: 20,
                          usePointStyle: true,
                      }
                  },
                  tooltip: {
                      callbacks: {
                          label: function (context) {
                              return `${context.raw.toLocaleString()} views`;
                          }
                      }
                  }
              }
          }
      });
  })
  .catch(error => console.error('Error fetching JSON:', error));

// const filterBtn = document.getElementById('filterBtnDistribution');
// const filterOptions = document.querySelector('body > div > main > div.main-container > div:nth-child(2) > div.Douchnut-chart-box > div > div > div > div');
// const applyFilter = document.getElementById('applyFilter');


//     // Open filter options for video distribution chart
//     if (filterBtn) { // Check if the element exists before adding event listeners
//         filterBtn.addEventListener('click', function () {
//             filterOptions.style.display = filterOptions.style.display === 'block' ? 'none' : 'block';
//             filterBtn.classList.toggle('open');
            
//         });
//     }

//     if (applyFilter) { // Check if the element exists before adding event listeners
//         applyFilter.addEventListener('click', function () {
//             const selectedSort = document.querySelector('input[name="sort"]:checked');
//             if (selectedSort) {
//                 sortThumbnails(selectedSort.value);
//                 filterOptions.style.display = 'none';
//                 filterBtn.classList.remove('open');
//             } else {
//                 alert('Please select a sort option.');
//             }
//         });
//     };



// console.log('buttons');

const menuBtn = document.getElementById('menuBtn');
const sideBar = document.querySelector('.sidebar');
const closeBtn = document.getElementById('close-btn')

  menuBtn.addEventListener('click', function () {
   sideBar.style.display = 'flex'

  });

  closeBtn.addEventListener('click', function(){
    sideBar.style.display = 'none'
  });


  
 // Update with your data source URL

// Function to fetch data
async function fetchData() {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Function to parse view count
function parseViews(views) {
    if (views.includes('M')) {
        return parseFloat(views.replace('M views', '')) * 1000000;
    } else if (views.includes('K')) {
        return parseFloat(views.replace('K views', '')) * 1000;
    } else {
        return parseFloat(views.replace(' views', ''));
    }
}

// Function to render videos
function renderVideos(videos) {
    const episodeBox = document.getElementById('episodeBox');
    episodeBox.innerHTML = ''; // Clear existing content

    videos.forEach(video => {
        const episodeCard = document.createElement('div');
        episodeCard.classList.add('episode-card');

        episodeCard.innerHTML = `
          <div class="thumbnail-vid">
            <img src="${video["Thumbnail Link"]}" alt="thumbnail">
            <h3>${video["Video TItle"]}</h3>
          </div>
          <div class="ep-stats">
              <p>Views: ${video["Number of Views"]}</p>
              <p>•</p>
              <p>${video["Time Posted"]}</p>
          </div>
        `;

        episodeBox.appendChild(episodeCard);
    });
}

// Function to initialize the page
async function initializePage() {
    const data = await fetchData();

    const filteredVideos = data.filter(video => video["Video TItle"].includes("CURIOSITY"));

    // Sort videos by views in descending order and take the top 10
    const sortedVideos = filteredVideos.sort((a, b) => {
        const aViews = parseViews(a["Number of Views"]);
        const bViews = parseViews(b["Number of Views"]);
        return bViews - aViews;
    }).slice(0, 10);

    renderVideos(sortedVideos);
}

// Event listener for the "View More" button
document.getElementById('viewMoreBtn').addEventListener('click', () => {
    window.location.href = 'https://www.youtube.com/@Isbae_u';
});

// Initialize the page on DOM content loaded
document.addEventListener('DOMContentLoaded', initializePage);
  
