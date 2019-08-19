//% weight=6 color=#2699BF icon="\uf110" block="CW01 HTTP"
namespace CW01_HTTP {

    let res: string = ""
    let TOKEN: string = ""
    let DEVICE_ID: string = ""
    let asset_name: string = ""
    let NEWLINE: string = "\u000D\u000A"

    serial.redirect(SerialPin.P1, SerialPin.P0, 115200)

    basic.pause(100)
    serial.writeString("AT+TEST=0" + NEWLINE)
    basic.pause(100)
    serial.writeString("AT+TEST" + NEWLINE)
    basic.pause(100)
    serial.writeString("AT+TEST=1" + NEWLINE)

    //% weight=91
    //% blockId="connectToWifi" block="connect to WiFi SSID %SSID, Password %PSK"
    export function connectToWifi(SSID: string, PSK: string): void {
        serial.writeString("AT+CWMODE=1" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+CWJAP=\"" + SSID + "\",\"" + PSK + "\"" + NEWLINE)
        basic.pause(10000)
    }
    //% weight=91
    //% blockId="connectToATT" block="connect to ATT with TOKEN %TKN and DEVICE_ID %ID"
    export function connectToATT(TKN: string, ID: string): void {
        DEVICE_ID = ID
        TOKEN = TKN
        serial.writeString("AT+CIPSTART=\"TCP\",\"api.allthingstalk.io\",80" + NEWLINE)

        basic.pause(500)
    }

    //% weight=91
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
            "Content-Length: "+(payload.length).toString()+ NEWLINE+NEWLINE+payload+NEWLINE
            


        serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request + NEWLINE)
        basic.pause(1000)
    }
} 