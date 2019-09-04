// tests go here; this will not be compiled when this package is used as a library

CW01_HTTP.begin()
CW01_HTTP.connectToWifi("INTERACTIVE-BRAINS3", "AllahMohammad110")
CW01_HTTP.connectToATT("maker:4OFo7FMIqoIOW1VeVsn87ckz2OyDoR1rXKd23sT", "E3pee2icRLE1wDXArfJsdmtA")
basic.forever(function () {
    CW01_HTTP.IoTSendStateToATT(true, "boolTest")
    basic.showString(CW01_HTTP.IoTgetATTAssetValue("6"))
    CW01_HTTP.IoTSendStateToATT(false, "boolTest")
})