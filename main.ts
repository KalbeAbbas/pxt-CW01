enum USER {
    //% block="INDUSTRIAL"
    INDUSTRIAL = 1,
    //% block="EDUCATIONAL"
    EDUCATIONAL = 2
}

//% groups=["Common",ATT", "Ubidots", "Azure", "MQTT", "others"]
//% weight=6 color=#2699BF icon="\uf110" block="CW01"
namespace cw01 {

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
    let mqtt_payload: string = ""
    let prev_mqtt_payload: string = ""

    start = true
    serial.redirect(SerialPin.P1, SerialPin.P0, 115200)
    serial.setRxBufferSize(200)

    basic.showIcon(IconNames.Chessboard)
    basic.pause(2000)
    serial.writeString("ATE0" + NEWLINE)
    basic.pause(300)
    serial.writeString("AT+CWMODE_DEF=3" + NEWLINE)
    basic.pause(300)
    serial.writeString("AT+CIPRECVMODE=1" + NEWLINE)
    basic.pause(300)
    serial.writeString("AT+TEST" + NEWLINE)
    basic.pause(300)
    serial.readString();
    serial.writeString("AT+CWHOSTNAME?" + NEWLINE);

    read_and_set_name();

    function read_and_set_name(): void {
        let name: string = "";
        name = serial.readString()

        if (!(name.includes("CW01"))) {
            serial.writeString("AT+CWHOSTNAME=\"CW01\"" + NEWLINE)
            control.reset()
        }
    }

    /**
    * Connect to W-Fi 
    */
    //% weight=91 color=#ad0303
    //% group="Common"
    //% blockId="connectToWifi" block="CW01 connect to WiFi SSID %SSID, password %PSK"
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
    /**
    * Connect to AllThingsTalk IoT platform
    */
    //% weight=91
    //% group="ATT"
    //% blockId="connectToATT" block="CW01 connect to ATT with token %TKN and device-id %ID"
    export function connectToATT(TKN: string, ID: string): void {
        DEVICE_ID = ID
        TOKEN = TKN
        serial.writeString("AT+CIPSTART=\"TCP\",\"api.allthingstalk.io\",80" + NEWLINE)
        basic.pause(500)
    }


    /**
    * Send string data to AllThingsTalk IoT platform
    */
    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendStringToATT" block="CW01 send string %value to ATT asset %asset"
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

        basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
        `)

        serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request + NEWLINE)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        get_status()

    }

    /**
    * Send numerical data to AllThingsTalk IoT platform
    */
    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendValueToATT" block="CW01 send value %value to ATT asset %asset"
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


        basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
        `)

        serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request + NEWLINE)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        get_status()
    }

    /**
    * Send boolean data to AllThingsTalk IoT platform
    */
    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendStateToATT" block="CW01 send state %state to ATT asset %asset_name"
    export function IoTSendStateToATT(state: boolean, asset: string): void {
        let stateStr: string

        if (state == true) {
            stateStr = "true"
        } else {
            stateStr = "false"
        }

        asset_name = asset
        serial.writeString("AT+CIPMODE=0" + NEWLINE)
        basic.pause(100)
        let payload: string = "{\"value\": " + stateStr + "}"
        let request: string = "PUT /device/" + DEVICE_ID + "/asset/" + asset_name + "/state" + " HTTP/1.1" + NEWLINE +
            "Host: api.allthingstalk.io" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Authorization: Bearer " + TOKEN + NEWLINE +
            "Content-Type:application/json" + NEWLINE +
            "Content-Length: " + (payload.length).toString() + NEWLINE + NEWLINE + payload + NEWLINE


        basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
        `)

        serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request + NEWLINE)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        get_status()
    }


    /**
    * Send button click to AllThingsTalk IoT platform
    */
    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendBtnClkToATT" block="CW01 button click to to ATT asset %asset"
    export function IoTSendBtnClkToATT(asset: string)
    {
        
    }

    /**
    * Get latest value of asset from AllThingsTalk IoT platform. Asset can be string, numerical and boolean
    */
    //% weight=91
    //% group="ATT"
    //% blockId="IoTgetATTAssetValue" block="CW01 get ATT asset %asset value"
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

        basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
        `)

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

    /**
    * Connect to Ubidots IoT platform
    */
    //% weight=91 color=#f2ca00
    //% group="Ubidots"
    //% blockId="connectToUbidots" block="CW01 connect to Ubidots %user| with token %TKN"
    export function connectToUbidots(User: USER, TKN: string): void {
        switch (User) {
            case USER.INDUSTRIAL: select = true;
            case USER.EDUCATIONAL: select = false;
        }
        TOKEN = TKN
        serial.writeString("AT+CIPSTART=\"TCP\",\"things.ubidots.com\",80" + NEWLINE)
        basic.pause(500)
    }

    /**
    * Get latest value of variable from Ubidots IoT platform
    */
    //% weight=91 color=#f2ca00
    //% group="Ubidots"
    //% blockId="IoTgetValuefromUbidots" block="CW01 get value from Ubidots device %device variable %variable"
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

    /**
    * Send numerical value to Ubidots IoT platform. Select loc to true if you want to send GPS
    * location entered with IoTaddLocation block
    */
    //% weight=91 color=#f2ca00
    //% group="Ubidots"
    //% blockId="IoTSendValueToUbidots" block="CW01 send value %value to Ubidots device %device variable %variable , include location %loc"
    export function IoTSendValueToUbidots(value: number, device: string, variable: string, loc: boolean): void {

        let payload: string = "{\"value\": " + value.toString() + "}"

        if (loc) {
            payload = "{\"value\": " + value.toString() + ", \"context\": {\"lat\": " + latitude.toString() + ", \"lng\": " + longitude.toString() + "}}"
        }

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
        basic.pause(1000)

        get_status()

        basic.pause(100)
        serial.writeString("AT+CIPRECVDATA=400" + NEWLINE)
        basic.pause(100)
        serial.readString()
    }

    /**
    * Connect to Microsoft Azure cloud computing platform
    */
    //% weight=91 color=#4B0082
    //% group="Azure"
    //% blockId="connectToAzure" block="CW01 connect to Azure with access enpoint %access"
    export function connectToAzure(access: string): void {
        serial.writeString("AT+CIPSTART=\"TCP\",\"proxy.xinabox.cc\",80" + NEWLINE)
        basic.pause(500)
        azureAccess = access
    }

    /**
    * Send string data to Microsoft Azure cloud computing platform
    */
    //% weight=91 color=#4B0082
    //% group="Azure"
    //% blockId="IoTSendStringToAzure" block="CW01 update Azure variable %asset with string %value"
    export function IoTSendStringToAzure(asset: string, value: string): void {

        let payload: string = "{\"" + asset + "\": " + value + "}"

        let request: string = "POST /135/" + azureAccess + " HTTP/1.1" + NEWLINE +
            "Host: proxy.xinabox.cc" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Content-Type: application/json" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Content-Length: " + (payload.length).toString() + NEWLINE + NEWLINE + payload + NEWLINE



        serial.writeString("AT+CIPSEND=" + (request.length).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        if (!get_status()) {
            connectToAzure(azureAccess)
        }
    }

    /**
    * Send numerical value to Microsoft Azure cloud computing platform
    */
    //% weight=91 color=#4B0082
    //% group="Azure"
    //% blockId="IoTSendValueToAzure" block="CW01 update Azure variable %asset with value %value"
    export function IoTSendValueToAzure(asset: string, value: number): void {
        let payload: string = "{\"" + asset + "\": " + value.toString() + "}"

        let request: string = "POST /135/" + azureAccess + " HTTP/1.1" + NEWLINE +
            "Host: proxy.xinabox.cc" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Content-Type: application/json" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Content-Length: " + (payload.length).toString() + NEWLINE + NEWLINE + payload + NEWLINE



        serial.writeString("AT+CIPSEND=" + (request.length).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        if (!get_status()) {
            connectToAzure(azureAccess)
        }
    }

    //% weight=91
    //% group="MQTT"
    //% blockId="IoTMQTTConnect" block="CW01 connect to MQTT broker URL %broker with Username %Username and Password %Password"
    export function IoTMQTTConnect(broker: string, Username: string, Password: string): void {

        serial.writeString("AT+CIPSTART=\"TCP\",\"" + broker + "\",1883" + NEWLINE)
        basic.pause(2000)

        let protocol_name_prior: Buffer = pins.packBuffer("!H", [4])
        let protocol_name: string = "MQTT"
        let protocol_lvl: Buffer = pins.packBuffer("!B", [4])
        //let msg_part_one: string = protocol_name + protocol_lvl
        let connect_flags: Buffer = (pins.packBuffer("!B", [(1 << 7) | (1 << 6) | (1 << 1)]))
        let keep_alive: Buffer = pins.packBuffer("!H", [200])
        let client_id: string = "CW01/1.1"
        let client_id_len: Buffer = pins.packBuffer("!H", [client_id.length])
        let username: string = Username
        let username_len: Buffer = pins.packBuffer("!H", [username.length])
        let password: string = Password
        let password_len: Buffer = pins.packBuffer("!H", [password.length])
        //let msg_part_two = client_id_len + client_id + username_len + username + password_len + password

        serial.writeString("AT+CIPSEND=" + (1 + 1 + protocol_name_prior.length + protocol_name.length + protocol_lvl.length + connect_flags.length + keep_alive.length + client_id_len.length + client_id.length + username_len.length + username.length + password_len.length + password.length) + NEWLINE)
        basic.pause(1000)
        /*serial.writeBuffer(pins.packBuffer("!B", [4]))
        serial.writeBuffer(pins.packBuffer("!B", [4]))*/

        //Msg part one
        serial.writeBuffer(pins.packBuffer("!B", [1 << 4]))
        serial.writeBuffer(pins.packBuffer("!B", [protocol_name_prior.length + protocol_name.length + protocol_lvl.length + connect_flags.length + keep_alive.length + client_id_len.length + client_id.length + username_len.length + username.length + password_len.length + password.length]))

        //Msg part two
        serial.writeBuffer(protocol_name_prior)
        serial.writeString(protocol_name)
        serial.writeBuffer(protocol_lvl)
        serial.writeBuffer(connect_flags)
        serial.writeBuffer(keep_alive)
        serial.writeBuffer(client_id_len)
        serial.writeString(client_id)
        serial.writeBuffer(username_len)
        serial.writeString(username)
        serial.writeBuffer(password_len)
        serial.writeString(password)

        basic.pause(1000)
    }


    //% weight=91
    //% group="MQTT"
    //% blockId="IoTMQTTSendValue" block="CW01 send JSON %Json to topic %Topic"
    export function IoTMQTTSendValue(Json: string, Topic: string): void {

        //Msg part two
        let topic: string = Topic
        let topic_len: Buffer = pins.packBuffer("!H", [topic.length])
        let value: string = Json

        //Msg part one
        let start_byte: Buffer = pins.packBuffer("!B", [0x30])
        let msg_part_two_len: Buffer = pins.packBuffer("!B", [topic_len.length + topic.length + value.length])

        serial.writeString("AT+CIPSEND=" + (start_byte.length + msg_part_two_len.length + topic_len.length + topic.length + value.length) + NEWLINE)
        basic.pause(1000)

        serial.writeBuffer(start_byte)
        serial.writeBuffer(msg_part_two_len)

        serial.writeBuffer(topic_len)
        serial.writeString(topic)
        serial.writeString(value)

        basic.pause(1000)
    }

    //% weight=91
    //% group="MQTT"
    //% blockId="IoTMQTTSubscribe" block="CW01 subscribe to topic %Topic"
    export function IoTMQTTSubscribe(Topic: string): void {

        //Msg part two
        let pid: Buffer = pins.packBuffer("!H", [0xDEAD])
        let qos: Buffer = pins.packBuffer("!B", [0x00])
        let topic: string = Topic
        let topic_len: Buffer = pins.packBuffer("!H", [topic.length])

        //Msg part one
        let ctrl_pkt: Buffer = pins.packBuffer("!B", [0x82])
        let remain_len: Buffer = pins.packBuffer("!B", [pid.length + topic_len.length + topic.length + qos.length])

        serial.writeString("AT+CIPSEND=" + (ctrl_pkt.length + remain_len.length + pid.length + topic_len.length + topic.length + qos.length) + NEWLINE)

        basic.pause(1000)

        serial.writeBuffer(ctrl_pkt)
        serial.writeBuffer(remain_len)
        serial.writeBuffer(pid)
        serial.writeBuffer(topic_len)
        serial.writeString(topic)
        serial.writeBuffer(qos)

        basic.pause(2000)

        serial.writeString("AT+CIPRECVDATA=200" + NEWLINE)
        basic.pause(100)
        serial.readString()

        serial.onDataReceived("\n", function () {
            if ((serial.readString()).includes("IPD")) {
                IoTMQTTGetData()
            }
        })
    }


    //% weight=91
    //% group="MQTT"
    //% blockId="IoTMQTTGetLatestData" block="CW01 get latest data"
    export function IoTMQTTGetLatestData(): string {

        if (prev_mqtt_payload.compare(mqtt_payload) != 0) {
            prev_mqtt_payload = mqtt_payload
            return mqtt_payload
        } else {
            return ""
        }
    }

    function IoTMQTTGetData(): void {
        basic.pause(500)
        serial.writeString("AT+CIPRECVDATA=4" + NEWLINE)
        basic.pause(300)
        serial.readString()
        serial.writeString("AT+CIPRECVDATA=200" + NEWLINE)
        basic.pause(300)

        mqtt_payload = serial.readString()
        basic.showString("Message received", 80)
        basic.pause(100)
    }


    /**
    * Send boolean state to Microsoft Azure cloud computing platform
    */
    //% weight=91 color=#4B0082
    //% group="Azure"
    //% blockId="IoTSendStateToAzure" block="CW01 update Azure variable %asset with boolean state %value"
    export function IoTSendStateToAzure(asset: string, value: boolean): void {

        let payload: string = "{\"" + asset + "\": " + value + "}"

        let request: string = "POST /135/" + azureAccess + " HTTP/1.1" + NEWLINE +
            "Host: proxy.xinabox.cc" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Content-Type: application/json" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Content-Length: " + (payload.length).toString() + NEWLINE + NEWLINE + payload + NEWLINE



        serial.writeString("AT+CIPSEND=" + (request.length).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request)
        basic.pause(10)
        serial.readString()
        basic.pause(1000)

        if (!get_status()) {
            connectToAzure(azureAccess)
        }
    }

    /**
    * Get value from Microsoft Azure cloud computing platform. Value can be string, numerical and boolean.
    */
    //% weight=91 color=#4B0082
    //% group="Azure"
    //% blockId="IoTGetValueFromAzure" block="CW01 get latest value of Azure variable %asset"
    export function IoTGetValueFromAzure(asset: string): string {

        let value: string
        let index1: number
        let index2: number
        let searchString: string = "\"" + asset + "\":"
        let i: number = 0

        let payload: string = "{}"

        let request: string = "POST /135/" + azureAccess + " HTTP/1.1" + NEWLINE +
            "Host: proxy.xinabox.cc" + NEWLINE +
            "User-Agent: CW01/1.0" + NEWLINE +
            "Content-Type: application/json" + NEWLINE +
            "Accept: */*" + NEWLINE +
            "Content-Length: " + (payload.length).toString() + NEWLINE + NEWLINE + payload + NEWLINE



        serial.writeString("AT+CIPSEND=" + (request.length).toString() + NEWLINE)
        basic.pause(100)
        serial.writeString(request)
        basic.pause(10)
        serial.readString()

        for (; i < 10; i++) {
            if (getDataLen() < 1000) {
                continue
            } else {
                break
            }
        }

        if (i == 10) {
            connectToAzure(azureAccess)
        }


        serial.writeString("AT+CIPRECVDATA=1100" + NEWLINE)
        basic.pause(200)
        serial.readString()
        serial.writeString("AT+CIPRECVDATA=200" + NEWLINE)
        basic.pause(200)
        res = serial.readString()

        if (res.includes(asset)) {
            index1 = res.indexOf(searchString) + searchString.length
            index2 = res.indexOf("}", index1)
            value = res.substr(index1, index2 - index1)
        } else {

            value = ""

        }

        return value

    }

    /**
    * Add your GPS location
    */
    //% weight=91 color=#f2ca00
    //% group="Ubidots"
    //% blockId="IoTaddLocation" block="CW01 latitude is %lat and longitude is %lng"
    export function IoTaddLocation(lat: number, lng: number): void {
        latitude = lat
        longitude = lng
    }

    function getDataLen(): number {

        let index1: number
        let index2: number
        let searchString: string = ":"
        let value: string

        serial.writeString("AT+CIPRECVLEN?" + NEWLINE)
        basic.pause(300)
        res = serial.readString()
        index1 = res.indexOf(searchString) + searchString.length
        index2 = res.indexOf(",", index1)
        value = res.substr(index1, index2 - index1)

        return parseInt(value)

    }

    function get_status(): boolean {

        serial.writeString("AT+CIPRECVDATA=200" + NEWLINE)
        basic.pause(100)
        res = serial.readString()

        if (res.includes("HTTP/1.1 200") || res.includes("HTTP/1.1 201") || res.includes("HTTP/1.0 202")) {
            basic.showIcon(IconNames.Yes)
            basic.pause(100)
            basic.showString("")
            return true
        } else {
            basic.showIcon(IconNames.No)
            basic.pause(100)
            basic.showString("")
            return false
        }
    }

} 
