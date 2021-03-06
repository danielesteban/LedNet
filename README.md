# LedNet

[![Dependency Status](https://david-dm.org/danielesteban/LedNet.svg)](https://david-dm.org/danielesteban/LedNet) [![devDependency Status](https://david-dm.org/danielesteban/LedNet/dev-status.svg)](https://david-dm.org/danielesteban/LedNet?type=dev)

> A centralized network of pixels

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

![Screenshot](screenshot.png)

## Requirements:

* [Node.js](https://nodejs.org/en/download/)
* [MongoDB](https://www.mongodb.com/download-center)
* [Redis](https://redis.io/download) (Optional for faster sessions)
* [PlatformIO](http://docs.platformio.org/en/stable/installation.html)
* A USB to 3.3v TTL dongle (I use Prolific's PL2303).
* As many ESP-01 modules (or ESP8266 compatible) as you want.
* WS2812B LEDs with it's data line connected to each ESP's GPIO0.
* Optional push buttons pulling each ESP's GPIO2 to ground.

## App server:

* Edit server config in: [server/Config.js](server/Config.js)
* Install dependencies: `npm install`
* Run server: `npm start`
* Visit: [http://localhost:8080](http://localhost:8080)
* Login with the default user: `[email]: admin@led.net [pass]: adm!n`

## Firmware:

* Edit server/hardware config in: [firmware/src/config.hpp](firmware/src/config.hpp)
* Pull GPI0 to ground and reset each ESP-01 into UART download mode.
* Flash each ESP-01: `cd firmware && platformio run`
* If you want to automate the network configuration: `echo -e "SSID\nPASSWORD" > firmware/data/config`
* Finally, reset each ESP-01 once again (keeping GPI0 to ground) and upload the SPIFFS: `cd firmware && platformio run --target=uploadfs`
* Once you deploy the hardware, if you want to reset the network configuration: Keep the push button pressed while the ESP-01 boots up and it will start the WiFi setup AP.

## Piwik plugin:

* Download & install: [Piwik](https://piwik.org/download/)
* Copy the plugin into your installation: `cp -R piwik $PIWIK_PATH/plugins/LedNet`
* Configure the 'LedNet server URL' setting at: `https://PIWIK_HOST/index.php?module=CoreAdminHome&action=adminPluginSettings`

---

### License:

The MIT License (MIT)

Copyright (c) 2016 Daniel Esteban Nombela

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
