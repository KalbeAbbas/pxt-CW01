
namespace CW01_HTTP {

    let res: string = ""

    serial.redirect(SerialPin.P1, SerialPin.P0, 115200)

    basic.pause(100)
    serial.writeString("AT+TEST=0\r\n")
    basic.pause(100)
    serial.writeString("AT+TEST\r\n")
    basic.pause(100)
    serial.writeString("AT+TEST=1\r\n")

    //% weight=91
    //% blockId="connectToWifi" block="connect to WiFi SSID %SSID, Password %PSK"
    export function connectToWifi(SSID: string, PSK: string): void {
        serial.writeString("AT+CWMODE=1\r\n")
        basic.pause(100)
        serial.writeString("AT+CWJAP=\"" + SSID + "\",\"" + PSK + "\"\r\n")
        basic.pause(10000)
    }
    //% weight=91
    //% blockId="connectToWifi" block="connect to AllThingsTalk HTTP server"
    export function connectToATT(): void {
        serial.writeString("AT+CIPSTART=\"TCP\",\"api.allthingstalk.io\",80\r\n")
        basic.pause(100)
    }
} 