enum user {
    //% block="Industrial"
    industrial = 1,
    //% block="Educational"
    educational = 2

}

//% groups=["Common",ATT", "Ubidots", "Azure", "others"]
//% weight=6 color=#2699BF icon="\uf110" block="CW01 HTTP"
namespace cw01HTTP {

    let res: string = ""
    let TOKEN: string = ""
    let DEVICE_ID: string = ""
    let asset_name: string = ""
    let NEWLINE: string = "\u000D\u000A"
    let start: boolean = false
    let latitude: number
    let longitude: number
    let select: boolean
    let azureAccess: string

    //% weight=91 color=#ad0303
    //% group="Common"
    //% blockId="begin" block="Begin CW01"
    export function begin(): void {
        start = true
        serial.redirect(SerialPin.P1, SerialPin.P0, 115200)
        serial.setRxBufferSize(200)

        basic.pause(100)
        serial.writeString("ATE0" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+TEST=0" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+TEST" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+TEST=1" + NEWLINE)
        basic.pause(100)
        serial.writeString("AT+CIPRECVMODE=1" + NEWLINE)
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
        basic.pause(400)
        res += serial.readString()
        index1 = res.indexOf("\"value\":") + "\"value\":".length
        index2 = res.indexOf("}", index1)
        value = res.substr(index1, index2 - index1)

        return value
    }

    //% weight=91 color=#f2ca00
    //% group="Ubidots"
    //% blockId="connectToUbidots" block="connect to Ubidots %user| with TOKEN %TKN"
    export function connectToUbidots(User: user, TKN: string): void {
        switch (User) {
            case user.industrial: select = true;
            case user.educational: select = false;
        }
        TOKEN = TKN
        serial.writeString("AT+CIPSTART=\"TCP\",\"things.ubidots.com\",80" + NEWLINE)
        basic.pause(500)
    }

    //% weight=91 color=#f2ca00
    //% group="Ubidots"
    //% blockId="IoTgetValuefromUbidots" block="Get Value from Ubidots Device %device Variable %variable"
    export function IoTgetValuefromUbidots(device: string, variable: string): string {
        res = ""
        let value: string
        let index1: number
        let index2: number
        let industrial: string = "industrial.api.ubidots.com"
        let educational: string = "things.ubidots.com"
        let server: string
        if (select) {
            server = industrial
        } else {
            server = educational
        }
        let request: string = "GET /api/v1.6/devices/" + device + "/" + variable + "/values/?page_size=1 HTTP/1.1" + NEWLINE +
            "Host: " + server + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "X-Auth-Token: " + TOKEN + NEWLINE +
            "Content-Type: application/json" + NEWLINE + NEWLINE
        //"Content-Length: " + (payload.length).toString() + NEWLINE + NEWLINE + payload + NEWLINE



        serial.writeString("AT+CIPSEND=" + (request.length).toString() + NEWLINE)
        basic.pause(400)
        serial.writeString(request)
        basic.pause(1000)

        serial.writeString("AT+CIPRECVDATA=200" + NEWLINE)
        basic.pause(400)
        serial.readString()
        serial.writeString("AT+CIPRECVDATA=100" + NEWLINE)
        basic.pause(400)
        serial.readString()
        basic.pause(100)
        serial.writeString("AT+CIPRECVDATA=200" + NEWLINE)
        basic.pause(400)
        res += serial.readString()
        basic.pause(400)

        index1 = res.indexOf("\"value\": ") + "\"value\": ".length
        index2 = res.indexOf("]", index1)
        value = res.substr(index1, index2 - index1 - 1)

        return value

    }

    //% weight=91 color=#f2ca00
    //% group="Ubidots"
    //% blockId="IoTSendValueToUbidots" block="Send Value %value to Ubidots Device %device Variable %variable , include location %loc"
    export function IoTSendValueToUbidots(value: number, device: string, variable: string, loc: boolean): void {
        let payload: string = "{\"value\": " + value.toString() + "}"
        let industrial: string = "industrial.api.ubidots.com"
        let educational: string = "things.ubidots.com"
        let server: string
        if (select) {
            server = industrial
        } else {
            server = educational
        }
        let request: string = "POST /api/v1.6/devices/" + device + "/" + variable + "/values HTTP/1.1" + NEWLINE +
            "Host: " + server + NEWLINE +
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
    }

    //% weight=91 color=#4B0082
    //% group="Azure"
    //% blockId="connectToAzure" block="connect to Azure with access enpoint %access"
    export function connectToAzure(access: string): void {
        serial.writeString("AT+CIPSTART=\"TCP\",\"proxy.xinabox.cc\",80" + NEWLINE)
        basic.pause(500)
        azureAccess = access
        basic.showString(azureAccess)

    }

    //% weight=91 color=#4B0082
    //% group="Azure"
    //% blockId="IoTSendStringToAzure" block="Update Azure variable %asset with String %value"
    export function IoTSendStringToAzure(value: string, asset: string): void {

    }

    //% weight=91 color=#4B0082
    //% group="Azure"
    //% blockId="IoTSendValueToAzure" block="Update Azure variable %asset with Value %value"
    export function IoTSendValueToAzure(value: number, asset: string): void {

    }

    //% weight=91 color=#4B0082
    //% group="Azure"
    //% blockId="IoTSendStateToAzure" block="Update Azure variable %asset with Boolean state %state"
    export function IoTSendStateToAzure(state: boolean, asset: string): void {
    }

    //% weight=91 color=#f2ca00
    //% group="Ubidots"
    //% blockId="IoTaddLocation" block="Latitude is %lat and Longitude is %lng"
    export function IoTaddLocation(lat: number, lng: number): void {
        latitude = lat
        longitude = lng
    }

    function get_status(): void {

        serial.writeString("AT+CIPRECVDATA=200" + NEWLINE)
        basic.pause(100)
        res = serial.readString()

        if (res.includes("HTTP/1.1 200") || res.includes("HTTP/1.1 201")) {
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