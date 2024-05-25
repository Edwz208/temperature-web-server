document.addEventListener('DOMContentLoaded', (event) => {
    setInterval(fetchData, 1000);
  
    function fetchData() {
      fetch('/data')
        .then(response => response.json())
        .then(data => {
          document.getElementById('temperaturereading').textContent = data.temperature;
          document.getElementById('humidityreading').textContent = data.humidity;
          document.getElementById('time').textContent = data.time;
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  });
  
