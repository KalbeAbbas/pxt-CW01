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
    let resBuf: Buffer = null

    //% weight=91
    //% group="ATT"
    //% blockId="begin" block="Begin CW01"
    export function begin(): void {
        start = true
        serial.redirect(SerialPin.P1, SerialPin.P0, 115200)
        serial.setRxBufferSize(200)

        serial.onDataReceived("{", function () {
            resBuf = serial.readBuffer(100)
            basic.showString("Hello")
            basic.showString(resBuf.toString())

        })

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
        //serial.writeString("AT+CIPSTART=\"TCP\",\"api.allthingstalk.io\",80" + NEWLINE)

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

        asset_name = asset

        serial.writeString("AT+CIPSTART=\"TCP\",\"api.allthingstalk.io\",1883" + NEWLINE)
        basic.pause(1000)

        //Packet for connecting with MQTT broker
        let connect_flags: Buffer = (pins.packBuffer("!B", [(1 << 7) | (1 << 6) | (1 << 1)]))
        let keep_alive: Buffer = pins.packBuffer("!H", [200])
        let client_id: string = "CW01/1.1"
        let client_id_len: Buffer = pins.packBuffer("!H", [client_id.length])
        let username: string = TOKEN
        let username_len: Buffer = pins.packBuffer("!H", [username.length])
        let password: string = "c770b0220c"
        let password_len: Buffer = pins.packBuffer("!H", [password.length])

        //Packet for subscribing to MQTT broker
        let pid: Buffer = pins.packBuffer("!H", [0xDEAD])
        let topic: string = "device/" + DEVICE_ID + "/asset/" + asset_name + "/command"
        let topic_len: Buffer = pins.packBuffer("!H", [topic.length])
        let qos: Buffer = pins.packBuffer("!B", [0x00])
        let ctrl_pkt: Buffer = pins.packBuffer("!B", [0x82])
        let remain_len: Buffer = pins.packBuffer("!B", [pid.length + (topic_len.length + topic.length + qos.length)])

        //Serial Transmission to connect with MQTT broker
        serial.writeString("AT+CIPSEND=" + (9 + connect_flags.length + keep_alive.length + 2 + client_id.length + 2 + username.length + 2 + password.length).toString() + NEWLINE)
        basic.pause(1000)

        serial.writeBuffer(pins.packBuffer("!B", [1 << 4]))
        serial.writeBuffer(pins.packBuffer("!B", [7 + connect_flags.length + keep_alive.length + 2 + client_id.length + 2 + username.length + 2 + password.length]))
        serial.writeBuffer(pins.packBuffer("!H", [4]))
        serial.writeString("MQTT")
        serial.writeBuffer(pins.packBuffer("!B", [4]))
        serial.writeBuffer(connect_flags) // flags
        serial.writeBuffer(keep_alive) //keep alive
        serial.writeBuffer(client_id_len)
        serial.writeString(client_id)
        serial.writeBuffer(username_len)
        serial.writeString(username)
        serial.writeBuffer(password_len)
        serial.writeString(password)
        basic.pause(2000)

        //Serial Transmission to subscribe with MQTT broker
        serial.writeString("AT+CIPSEND=" + (ctrl_pkt.length + remain_len.length + pid.length + topic_len.length + topic.length + qos.length).toString() + NEWLINE)
        basic.pause(1000)

        serial.writeBuffer(ctrl_pkt)
        serial.writeBuffer(remain_len)
        serial.writeBuffer(pid)
        serial.writeBuffer(topic_len)
        serial.writeString(topic)
        serial.writeBuffer(qos)
        basic.pause(2000)

        serial.readString()

    }

    //% weight=91
    //% group="ATT"
    //% blockId="GetValueFromAsset" block="Get Value from Asset %asset"
    export function GetVAlueFromAsset(asset: string): void {

        asset_name = asset

        let startIndex: number = null
        let endIndex: number = null
        let index2: number = null
        let value: string = null

        /*res = serial.readString()
        basic.showString(res)*/
        /*serial.onDataReceived("true", function () {
            res = serial.readString()
            basic.showString("Hello!")
            basic.showString(res)
        })*/

        basic.pause(100)

        /* if (res.includes("/device/" + DEVICE_ID + "/asset/" + asset_name + "/command")) {
             startIndex = res.indexOf("\"value\":")
             endIndex = res.indexOf("\"", startIndex + "\"value\":".length + 1)
             value = res.slice(startIndex, endIndex)
             basic.showString(value)*/


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