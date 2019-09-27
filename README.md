# XinaBox SW01 MakeCode extension

This library provides functions to access environmental data from the [XinaBox SW01](https://xinabox.cc/products/cw01?_pos=1&_sid=130924612&_ss=r).

![](sw01.jpg)

[Read more about it or purchase one here](https://xinabox.cc/products/cw01?_pos=1&_sid=130924612&_ss=r)

The CW01 uses ESP8266 core to transimit and receive data.
This libray enables you connect to IoT clouds specifically with:
* AllThingsTalk
* Ubidots
* Microsoft Azure

There are functions to:
* Connect to Wi-Fi
* Connect to IoT platforms (ATT, Ubidots or Azure)
* Transmit data
* Receive data

## How-to guides:

A comprehensive set of How-to guides that show you how to use the blocks is available online:


## Core functions: Common:

```blocks
// Connect to WiFi
cw01HTTP.connectToWifi("SSID", "PSK")

```


## Core functions: AllThingsTalk:

```blocks
// Connect
cw01HTTP.connectToATT("TOKEN", "ID")

//Send string data
cw01HTTP.IoTSendStringToATT("string", "asset_name")

//Send numerical data
cw01HTTP.IoTSendValueToATT(0, "asset_name")

//Send boolean data
cw01HTTP.IoTSendStateToATT(false, "asset_name")

//Get data
cw01HTTP.IoTgetATTAssetValue("asset_name")

```

## Core functions: Azure:

```blocks
// Connect
cw01HTTP.connectToAzure("access_endpoint")

//Send string data
cw01HTTP.IoTSendStringToAzure("variable_name", "string")

//Send numerical data
cw01HTTP.IoTSendValueToAzure("variable_name", 0)

//Send boolean data
cw01HTTP.IoTSendStateToAzure("variable_name", false)

//Get data
cw01HTTP.IoTGetValueFromAzure("variable_name")

```

## Core functions: Ubidots:

```blocks
// Connect to Industrial or Education account type
cw01HTTP.connectToUbidots(user.industrial, "TOKEN")

//Send numerical data to variable in device. Select true to enter GPS location
cw01HTTP.IoTSendValueToUbidots(0, "device_api", "variable_api", false)

//Get data
cw01HTTP.IoTgetValuefromUbidots("device_api", "variable_api")

//Add GPS location, latitude and longitude
cw01HTTP.IoTaddLocation(0, 0)

```
  


## License:

MIT

Copyright (c) 2019, XinaBox Limited

## Supported targets:

* PXT/microbit


