document.addEventListener('DOMContentLoaded', (event) => {
    setInterval(fetchData, 1000); // Fetch data every second
  
    function fetchData() {
      fetch('/data')
        .then(response => response.json())
        .then(data => {
          document.getElementById('temperature').textContent = data.temperature;
          document.getElementById('humidity').textContent = data.humidity;
          document.getElementById('time').textContent = data.time;
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  });
  