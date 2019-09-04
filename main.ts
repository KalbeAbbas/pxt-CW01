//% groups=["Common",ATT", "Ubidots", "others"]
//% weight=6 color=#2699BF icon="\uf110" block="CW01 HTTP"
namespace CW01_HTTP {

    let res: string = ""
    let TOKEN: string = ""
    let DEVICE_ID: string = ""
    let asset_name: string = ""
    let NEWLINE: string = "\u000D\u000A"
    let start: boolean = false

    //% weight=91 color=#ad0303
    //% group="Common"
    //% blockId="begin" block="Begin CW01"
    export function begin(): void {
        start = true
        serial.redirect(SerialPin.P1, SerialPin.P0, 115200)
        serial.setRxBufferSize(200)

        basic.pause(100)
        //serial.writeString("ATE0" + NEWLINE)
        //basic.pause(100)
        serial.writeString("AT+TEST=0" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+TEST" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+TEST=1" + NEWLINE)
        basic.pause(100)
    }

    //% weight=91 color=#ad0303
    //% group="Common"
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
        serial.writeString("AT+CIPRECVMODE=1" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+CIPSTART=\"TCP\",\"api.allthingstalk.io\",80" + NEWLINE)
        basic.pause(500)
    }


    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendStringToATT" block="Send String %value to ATT Asset %asset"
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
    //% blockId="IoTSendValueToATT" block="Send Value %value to ATT Asset %asset"
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
    //% blockId="IoTgetATTAssetValue" block="Get ATT Asset %asset value"
    export function IoTgetATTAssetValue(asset: string): string {
        res = ""
        let index1: number
        let index2: number
        let value: string
        asset_name = asset
        basic.pause(100)
        let request: string = "GET /device/" + DEVICE_ID + "/asset/" + asset_name + "/state" + " HTTP/1.1" + NEWLINE +
            "Host: api.allthingstalk.io" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Authorization: Bearer " + TOKEN + NEWLINE + NEWLINE

        serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + NEWLINE)
        basic.pause(400)
        serial.writeString(request + NEWLINE)
        basic.pause(400)
        serial.writeString("AT+CIPRECVDATA=200" + NEWLINE)
        basic.pause(100)
        serial.readString()
        basic.pause(400)
        serial.writeString("AT+CIPRECVDATA=200" + NEWLINE)
        basic.pause(100)
        res += serial.readString()
        index1 = res.indexOf("\"value\":") + "\"value\":".length
        index2 = res.indexOf("}", index1)
        value = res.substr(index1, index2 - index1)

        return value
    }

    //% weight=91 color=#f2ca00
    //% group="Ubidots"
    //% blockId="connectToUbidots" block="connect to Ubidots with TOKEN %TKN"
    export function connectToUbidots(TKN: string): void {
        TOKEN = TKN
        serial.writeString("AT+CIPSTART=\"TCP\",\"things.ubidots.com\",80" + NEWLINE)
        basic.pause(500)
    }

    //% weight=91 color=#f2ca00
    //% group="Ubidots"
    //% blockId="IoTSendValueToUbidots" block="Send Value %value to Ubidots Device %device Variable %variable , include location %loc"
    export function IoTSendValueToUbidots(value: number, device: string, variable: string, loc: boolean): void {
        let payload: string = "{\"value\": " + value.toString() + "}"
        let request: string = "POST /api/v1.6/devices/" + device + "/" + variable + "/values HTTP/1.1" + NEWLINE +
            "Host: things.ubidots.com" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "X-Auth-Token: " + TOKEN + NEWLINE +
            "Content-Type: application/json" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Content-Length: " + (payload.length).toString() + NEWLINE + NEWLINE + payload + NEWLINE



        serial.writeString("AT+CIPSEND=" + (request.length).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        get_status()
    }

    function get_status(): void {

        serial.writeString("AT+CIPRECVDATA=200" + NEWLINE)
        basic.pause(100)
        res = serial.readString()

        if (res.includes("HTTP/1.1 200") || res.includes("HTTP/1.1 201") ) {
            basic.showIcon(IconNames.Yes)
            basic.pause(100)
            basic.showString("")
        } else {
            basic.showIcon(IconNames.No)
            basic.pause(100)
            basic.showString("")
        }
    }

} 