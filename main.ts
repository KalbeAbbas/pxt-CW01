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
        serial.setRxBufferSize(300)
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

    //% weight=91
    //% group="ATT"
    //% blockId="IoTSubscribeToATTMQTT" block="Subscribe to ATT MQTT Asset %asset"
    export function IoTSubscribeToATTMQTT(asset: string): void {
        serial.writeString("AT+CIPMODE=1" + NEWLINE)
        basic.pause(1000)
        serial.writeString("AT+CIPSTART=\"TCP\",\"api.allthingstalk.io\",1883" + NEWLINE)
        basic.pause(1000)
        serial.writeString("AT+CIPSEND" + NEWLINE)
        basic.pause(1000)

        let protocol_name: string = pins.packBuffer("!H", [4]).toString() + "MQTT"
        let protocol_lvl: string = (pins.packBuffer("!B", [4])).toString()
        let msg_part_one: string = protocol_name + protocol_lvl


        let connect_flags: Buffer = (pins.packBuffer("!B", [(1 << 7) | (1 << 6) | (1 << 1)]))

        let keep_alive: Buffer = pins.packBuffer("!H", [200])


        let client_id: string = "CW01/1.1"
        let client_id_len: string = (pins.packBuffer("!H", [client_id.length])).toString()
        let username: string = "maker:4TBZDG1N8fWRW1VeVm2yIZG9wr7UYBVLpMR3OY6"
        let username_len: string = (pins.packBuffer("!H", [username.length])).toString()
        let password: string = "c770b0220c"
        let password_len: string = (pins.packBuffer("!H", [password.length])).toString()
        let msg_part_two = client_id_len + client_id + username_len + username + password_len + password

        serial.writeBuffer(pins.packBuffer("!B", [1 << 4]))
        serial.writeBuffer(pins.packBuffer("!B", [msg_part_one.length + connect_flags.length + keep_alive.length + msg_part_two.length]))
        serial.writeString(msg_part_one) //protocol name
        serial.writeBuffer(connect_flags) // flags
        serial.writeBuffer(keep_alive) //keep alive
        serial.writeString(msg_part_two) //string data

        serial.writeString("+++")
        basic.pause(1000)
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