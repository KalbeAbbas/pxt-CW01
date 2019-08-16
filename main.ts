//% weight=6 color=#2699BF icon="\uf110" block="CW01_MQTT"
namespace CW01_MQTT {

    let res: string = ""

    serial.redirect(SerialPin.P1, SerialPin.P0, 115200)

    //% weight=91
    //% blockId="connectToWifi" block="connect to WiFi SSID %SSID, Password %PSK"
    export function connectToWifi(SSID: string, PSK: string): boolean {
        serial.writeString("AT+CWMODE=1\r\n")
        basic.pause(100)
        serial.writeString("AT+CWJAP=\"" + SSID + "\",\"" + PSK + "\"\r\n")
        basic.pause(5000)
        res = serial.readString()
        console.log(res)
        return true
    }
} 