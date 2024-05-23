#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <DHT.h>
#include <FS.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>
#include <time.h>

#define dhtPin 27
#define DHTTYPE DHT11

DHT dht(dhtPin, DHTTYPE);
WebServer server(80);

const char* ssid = "B476";
const char* password = "7CE494FAF5AD";

float temperature = 0;
float humidity = 0;

String ledState = "OFF";
int LEDPIN = 26;

unsigned long previousMillis = 0;
const long interval = 900;

void setup() {
  pinMode(LEDPIN, OUTPUT);
  
  Serial.begin(115200);
  dht.begin();
  pinMode(dhtPin, INPUT_PULLUP);

  if (!SPIFFS.begin(true)) {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  connectToWifi();
  beginServer();

  // Configure time with EST time zone and DST rules
  configTime(-5 * 3600, 3600, "pool.ntp.org", "time.nist.gov");

  Serial.println("Waiting for time synchronization...");
  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    delay(1000);
    Serial.println("...");
  }
  Serial.println("Time synchronized");
}

void loop() {
  server.handleClient();
  
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    getTemperature();
    getHumidity();
    struct tm timeinfo;
    char timeStr[20];
    if (!getLocalTime(&timeinfo)) {
      Serial.println("Failed to obtain time");
      return;
    }
    strftime(timeStr, sizeof(timeStr), "%H:%M:%S", &timeinfo); // Format time as HH:MM:SS
    handleData(timeStr); // Pass timeStr to handleData function
  }
}

void connectToWifi() {
  WiFi.enableSTA(true);
  delay(1500);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void beginServer() {
  server.on("/", HTTP_GET, []() {
    serveFile("/index.html", "text/html");
  });
  server.on("/styles.css", HTTP_GET, []() {
    serveFile("/styles.css", "text/css");
  });
  server.on("/script.js", HTTP_GET, []() {
    serveFile("/script.js", "application/javascript");
  });
  server.on("/data", HTTP_GET, []() { // Handle data request
    struct tm timeinfo;
    char timeStr[20];
    if (!getLocalTime(&timeinfo)) {
      Serial.println("Failed to obtain time");
      return;
    }
    strftime(timeStr, sizeof(timeStr), "%H:%M:%S", &timeinfo); // Format time as HH:MM:SS
    handleData(timeStr);
  });
  
  server.onNotFound([]() {
    server.send(404, "text/plain", "File Not Found");
  });

  server.begin();
  Serial.println("HTTP server started");
}

void serveFile(String path, String contentType) {
  if (SPIFFS.exists(path)) {
    File file = SPIFFS.open(path, "r");
    server.streamFile(file, contentType);
    file.close();
  } else {
    server.send(404, "text/plain", "File Not Found");
  }
}

void handleData(String timeStr) { // Handle data and send JSON response
  getTemperature();
  getHumidity();
  String json;
  StaticJsonDocument<200> doc;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["time"] = timeStr; // Include time in JSON response
  serializeJson(doc, json);

  // Send JSON response
  server.send(200, "application/json", json);
}

float getTemperature() {
  float temp = dht.readTemperature();
  if (isnan(temp)) {
    Serial.println("Failed to read temperature!");
    return 0.0;
  }
  temperature = temp;
  return temperature;
}

float getHumidity() {
  float hum = dht.readHumidity();
  if (isnan(hum)) {
    Serial.println("Failed to read humidity!");
    return 0.0;
  }
  humidity = hum;
  return humidity;
}
