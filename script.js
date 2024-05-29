document.addEventListener('DOMContentLoaded', (event) => {
    var ctx = document.getElementById('temperatureChart').getContext('2d');
    var temperatureChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Temperature (°C)',
          data: [],
          fill: false,
          borderColor: 'rgb(0, 0, 0)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'second'
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });

    function fetchData() {
      fetch('/data')
        .then(response => response.json())
        .then(data => {
          document.getElementById('temperaturereading').textContent = data.temperature + '°C';
          document.getElementById('humidityreading').textContent = data.humidity + '%';
          document.getElementById('time').textContent = data.time;

          temperatureChart.data.labels.push(data.time);
          temperatureChart.data.datasets[0].data.push(data.temperature);

          const maxDataPoints = 10;
          if (temperatureChart.data.labels.length > maxDataPoints) {
            temperatureChart.data.labels.shift();
            temperatureChart.data.datasets[0].data.shift();
          }

          temperatureChart.update();
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    setInterval(fetchData, 1000);
  });
