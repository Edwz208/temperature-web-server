document.addEventListener('DOMContentLoaded', (event) => {
  setInterval(fetchData, 1000);
  setInterval(anotherFunction, 1000);
  function fetchData() {
      fetch('/data')
          .then(response => response.json())
          .then(data => {
              document.getElementById('temperaturereading').textContent = data.temperature + '°C';
              document.getElementById('humidityreading').textContent = data.humidity + '%';
              document.getElementById('time').textContent = data.time;
          })
          .catch(error => console.error('Error fetching data:', error));
  }
  function anotherFunction() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            // Update time label
            temperatureChart.data.labels.push(data.time);
            // Update temperature data
            temperatureChart.data.datasets[0].data.push(data.temperature);
            // Limit the number of data points to display
            const maxDataPoints = 10;
            if (temperatureChart.data.labels.length > maxDataPoints) {
                temperatureChart.data.labels.shift();
                temperatureChart.data.datasets[0].data.shift();
            }
            // Update the chart
            temperatureChart.update();
        })
        .catch(error => console.error('Error fetching data:', error));
}

});
