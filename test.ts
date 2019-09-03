// tests go here; this will not be compiled when this package is used as a library

CW01_HTTP.begin()
CW01_HTTP.connectToWifi("SSID", "PSK")
CW01_HTTP.connectToATT("TOKEN", "ID")
basic.forever(function () {
    CW01_HTTP.IoTSendStateToATT(true, "ASSET_NAME")
    basic.showString(CW01_HTTP.IoTgetATTAssetValue("ASSET_NAME"))
    CW01_HTTP.IoTSendStateToATT(false, "ASSET_NAME")
})