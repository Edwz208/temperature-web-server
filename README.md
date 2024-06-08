Edwin Zeng and Jeevan Sanchez
Temperature web server project
Displays 

download and use arduino legacy
Place the ding, html, css, and js file in a folder called data
Place the data folder into the sketch folder where the ino file is located, within Documents/Arduino/temperaturewebserverfolder

https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json place this under the legacy preferences, this is for selecting an esp board 

extract the ESP32FS-1.1.zip folder and place it under a fill in documents/arduino/tools the total address should be Documents/Arduino/tools/ESP32FS/tool/esp32fs
The ESP32FS is for SPIFFS, allowing for a sketch data upload. After doing the ESP32FS step you may have to restart arduino legacy to make sure it worked
![image](https://github.com/Edwz208/temperature-web-server/assets/147886945/c9f27031-3073-4209-872b-909bf2d7f34c)
it should have the sketch data upload option now, only works on 1.x, not newer versions of arduino 
unfortunately, there are some minor glitches involving the SPIFFS upload and an issue with playing an audio alert until after the text alert due to browser autoplay protocol
