let temperatureChart, humidityChart;
let currentChart = 'temperature';
let minThreshold = -25.0; 
let maxThreshold = 50.0; 
let audioEnabled = false; 

document.addEventListener('DOMContentLoaded', (event) => {
  initializeCharts(); 
  fetchData(); 
  setInterval(fetchData, 2000); 
});

function initializeCharts() {
  var ctxTemp = document.getElementById('temperatureChart').getContext('2d');
  temperatureChart = new Chart(ctxTemp, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Temperature (°C)',
        data: [],
        fill: false,
        borderColor: 'rgb(255, 0, 0)',
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

  var ctxHumidity = document.getElementById('humidityChart').getContext('2d');
  humidityChart = new Chart(ctxHumidity, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Humidity (%)',
        data: [],
        fill: false,
        borderColor: 'rgb(0, 0, 255)',
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
}

let readingCounter = 0;

function fetchData() {
fetch('/data')
.then(response => response.json())
.then(data => {
  console.log("Data fetched:", data); 
  let roundedTemp = parseFloat(data.temperature).toFixed(2);
  let roundedAvgHum = parseFloat(data.avgHum).toFixed(2);
  let roundedAvgTemp = parseFloat(data.avgTemp).toFixed(2);
  document.getElementById('temperaturereading').textContent = roundedTemp + '°C';
  document.getElementById('humidityreading').textContent = data.humidity + '%';
  document.getElementById('avgTemperatureReading').textContent = roundedAvgTemp + '°C';
  document.getElementById('avgHumidityReading').textContent = roundedAvgHum + '%';
  document.getElementById('time').textContent = data.time;
  
  readingCounter++;

  if (readingCounter >= 5) {
    if (roundedTemp > maxThreshold || roundedTemp < minThreshold) {
      alert('Temperature threshold exceeded!');
      if (audioEnabled) {
        console.log("Audio playing...");
        document.getElementById('audioClip').play();
      }
    }
    readingCounter = 0;
  }

  const timeParts = data.time.split(':');
  const time = new Date();
  time.setHours(parseInt(timeParts[0]));
  time.setMinutes(parseInt(timeParts[1]));
  time.setSeconds(parseInt(timeParts[2]));

  if (currentChart === 'temperature') {
    updateChart(temperatureChart, time, roundedTemp);
  } else {
    updateChart(humidityChart, time, data.humidity);
  }
})
.catch(error => console.error('Error fetching data:', error));
}

function updateChart(chart, time, value) {
  const dataset = chart.data.datasets[0];
  dataset.data.push({ x: time, y: value });

  if (dataset.data.length > 10) {
    dataset.data.shift(); 
  }

  chart.update();
}

function toggleChart(type) {
  if (type === currentChart) return;

  if (type === 'temperature') {
    document.getElementById('temperatureChart').style.display = 'block';
    document.getElementById('humidityChart').style.display = 'none';
  } else if (type === 'humidity') {
    document.getElementById('temperatureChart').style.display = 'none';
    document.getElementById('humidityChart').style.display = 'block';
  }

  currentChart = type;
}

let minValueInput = document.getElementById('minthreshold');
let maxValueInput = document.getElementById('maxthreshold');
let minNumberInput = document.getElementById('minNumber');
let maxNumberInput = document.getElementById('maxNumber');
let minValue = -25; let maxValue = 50;
minValueInput.value = minValue;
maxValueInput.value = maxValue;
maxNumberInput.value = maxValue;
minNumberInput.value = minValue;

function thresholdStuff() {
minValueInput.addEventListener('input', () => {
minValue = parseFloat(minValueInput.value);
maxValue = parseFloat(maxValueInput.value);
if (minValue >= maxValue) {
  minValue = maxValue - 0.1;
}
minValue = Math.max(minValueInput.min, Math.min(minValue, minValueInput.max));
minValueInput.value = minValue.toFixed(1);
minNumberInput.value = minValue.toFixed(1);
});

maxValueInput.addEventListener('input', () => {
minValue = parseFloat(minValueInput.value);
maxValue = parseFloat(maxValueInput.value);
if (maxValue <= minValue) {
  maxValue = minValue + 0.1;
}
maxValue = Math.max(maxValueInput.min, Math.min(maxValue, maxValueInput.max));
maxValueInput.value = maxValue.toFixed(1);
maxNumberInput.value = maxValue.toFixed(1);
});

minNumberInput.addEventListener('input', () => {
minValue = parseFloat(minNumberInput.value);
if (minValue >= maxValue) {
  minValue = maxValue - 0.1;
}
minValue = Math.max(minValueInput.min, Math.min(minValue, minValueInput.max));
minValueInput.value = minValue.toFixed(1);
minNumberInput.value = minValue.toFixed(1);
});

maxNumberInput.addEventListener('input', () => {
maxValue = parseFloat(maxNumberInput.value);
if (maxValue <= minValue) {
  maxValue = minValue + 0.1;
}
maxValue = Math.max(maxValueInput.min, Math.min(maxValue, maxValueInput.max));
maxValueInput.value = maxValue.toFixed(1);
maxNumberInput.value = maxValue.toFixed(1);
});

document.getElementById('setThreshold').addEventListener('click', () => {
minThreshold = parseFloat(document.getElementById('minthreshold').value);
maxThreshold = parseFloat(document.getElementById('maxthreshold').value);
audioEnabled = true; 
playAudio(); 
alert('Thresholds set successfully! Audio alerts are now enabled.');
});
}

function playAudio() {
  if (audioEnabled) {
    document.getElementById('audioClip').play();
  }
}

thresholdStuff();
