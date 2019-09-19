// tests go here; this will not be compiled when this package is used as a library

cw01HTTP.connectToWifi("SSID", "PSK")
cw01HTTP.connectToATT("DEVICE_TOKEN", "DEVICE_ID")
basic.forever(function () {
    cw01HTTP.IoTSendStateToATT(true, "boolTest")
    basic.showString(cw01HTTP.IoTgetATTAssetValue("6"))
    cw01HTTP.IoTSendStateToATT(false, "boolTest")
})