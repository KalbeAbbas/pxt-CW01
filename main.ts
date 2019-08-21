//% groups=["ATT", "Ubidots", "others"]
//% weight=6 color=#2699BF icon="\uf110" block="CW01 HTTP"
namespace CW01_HTTP {

    let res: string = ""
    let TOKEN: string = ""
    let DEVICE_ID: string = ""
    let asset_name: string = ""
    let NEWLINE: string = "\u000D\u000A"
    let start: boolean = false
    let buf: Buffer = null

    //% weight=91
    //% group="ATT"
    //% blockId="begin" block="Begin CW01"
    export function begin(): void {
        start = true
        serial.redirect(SerialPin.P1, SerialPin.P0, 115200)
        serial.setRxBufferSize(200)
        basic.pause(100)
        serial.writeString("AT+RST" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+TEST=0" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+TEST" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+TEST=1" + NEWLINE)
    }

    //% weight=91
    //% group="ATT"
    //% blockId="connectToWifi" block="connect to WiFi SSID %SSID, Password %PSK"
    export function connectToWifi(SSID: string, PSK: string): void {
        if (start) {
            serial.writeString("AT+CWMODE=1" + NEWLINE)
            basic.pause(100)
            serial.readString()
            serial.writeString("AT+CWJAP=\"" + SSID + "\",\"" + PSK + "\"" + NEWLINE)
            basic.pause(200)
            serial.readString()
            basic.pause(10000)
            res = serial.readLine()

            if (res.compare("WIFI CONNECTED\r") == 0) {
                basic.showString("C")
                res = ""
            } else {
                basic.showString("D")
            }


        } else {
            basic.showString("Missed begin block!")
        }
    }
    //% weight=91
    //% group="ATT"
    //% blockId="connectToATT" block="connect to ATT with TOKEN %TKN and DEVICE_ID %ID"
    export function connectToATT(TKN: string, ID: string): void {
        DEVICE_ID = ID
        TOKEN = TKN
        serial.writeString("AT+CIPSTART=\"TCP\",\"api.allthingstalk.io\",80" + NEWLINE)

        basic.pause(500)
    }

    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendStringToATT" block="Send String %value to ATT Asset %asset_name"
    export function IoTSendStringToATT(value: string, asset: string): void {
        asset_name = asset
        serial.writeString("AT+CIPMODE=0" + NEWLINE)
        basic.pause(100)
        let payload: string = "{\"value\": " + value + "}"
        let request: string = "PUT /device/" + DEVICE_ID + "/asset/" + asset_name + "/state" + " HTTP/1.1" + NEWLINE +
            "Host: api.allthingstalk.io" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Authorization: Bearer " + TOKEN + NEWLINE +
            "Content-Type:application/json" + NEWLINE +
            "Content-Length: " + (payload.length).toString() + NEWLINE + NEWLINE + payload + NEWLINE



        serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request + NEWLINE)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        get_status()

    }

    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendValueToATT" block="Send Value %value to ATT Asset %asset_name"
    export function IoTSendValueToATT(value: number, asset: string): void {
        asset_name = asset
        serial.writeString("AT+CIPMODE=0" + NEWLINE)
        basic.pause(100)
        let payload: string = "{\"value\": " + value.toString() + "}"
        let request: string = "PUT /device/" + DEVICE_ID + "/asset/" + asset_name + "/state" + " HTTP/1.1" + NEWLINE +
            "Host: api.allthingstalk.io" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Authorization: Bearer " + TOKEN + NEWLINE +
            "Content-Type:application/json" + NEWLINE +
            "Content-Length: " + (payload.length).toString() + NEWLINE + NEWLINE + payload + NEWLINE



        serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request + NEWLINE)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        get_status()
    }

    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendStateToATT" block="Send State %state to ATT Asset %asset_name"
    export function IoTSendStateToATT(state: boolean, asset: string): void {
        asset_name = asset
        serial.writeString("AT+CIPMODE=0" + NEWLINE)
        basic.pause(100)
        let payload: string = "{\"value\": " + state.toString() + "}"
        let request: string = "PUT /device/" + DEVICE_ID + "/asset/" + asset_name + "/state" + " HTTP/1.1" + NEWLINE +
            "Host: api.allthingstalk.io" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Authorization: Bearer " + TOKEN + NEWLINE +
            "Content-Type:application/json" + NEWLINE +
            "Content-Length: " + (payload.length).toString() + NEWLINE + NEWLINE + payload + NEWLINE



        serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request + NEWLINE)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        get_status()
    }

    //% weight=91
    //% group="ATT"
    //% blockId="IoTSubscribeToATTAsset" block="Subscribe to ATT Asset %asset"
    export function IoTSubscribeToATTAsset(asset: string): void {
        asset_name = asset
        basic.pause(100)
        let request: string = "GET /device/" + DEVICE_ID + "/asset/" + asset_name + "/state" + " HTTP/1.1" + NEWLINE +
            "Host: api.allthingstalk.io" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Authorization: Bearer " + TOKEN + NEWLINE + NEWLINE

        serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request + NEWLINE)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        for (let i = 0; i < 3; i++) {
            buf = serial.readBuffer(100);
            serial.writeBuffer(buf)
        }
    }

    function get_status(): void {
        res = serial.readString()

        if (res.includes("HTTP/1.1 200")) {
            basic.showIcon(IconNames.Yes)
        } else {
            basic.showIcon(IconNames.No)
        }
    }

    function get_value(): void {
        serial.writeString(res)
    }

} 