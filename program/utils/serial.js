const SerialPort = require("serialport").SerialPort
const { ReadlineParser } = require('@serialport/parser-readline')
const db = require("./db");
let serialPort = new SerialPort({
      path:'COM5',
      baudRate:9600,
      parser: new ReadlineParser("\n"),
      autoOpen: true,
    }).setEncoding('utf8');

    if (serialPort){
        serialPort.on('data',async function(data) {
            var chunks = (data.split(','));
            let nowTime = new Date().getTime();
            let diff = Math.abs(tempTime - nowTime);

            if(chunks.length === 8 && diff > 1000){
                let query = `
                    INSERT INTO sensor_data 
                        (site_id,soil_humidity,temperature,humidity,fan,water_motor,light,water_level,magnet,createdAt) 
                    VALUES 
                        (:site_id,:soil_humidity,:temperature,:humidity,:fan,:water_motor,:light,:water_level,:magnet,:createdAt)
                `;
                let data = {
                    site_id: 1,
                    soil_humidity: chunks[2],
                    temperature:chunks[0],
                    humidity:chunks[1],
                    fan:chunks[6],
                    water_motor:chunks[5],
                    light:chunks[4],
                    water_level:chunks[3],
                    magnet:chunks[7]
                }
                let db_query = await db.query(query, data);
            }
        });

        serialPort.on('error', function(err) {
            console.log('Error: ', err.message)
        })
    }
    async function sendCommand(command) {
        try {
            if (serialPort){
                let write = await serialPort.write(command);
                console.log('Komut Gönderildi:', write)
            }else {
                console.log('Komut Gönderilemdi: Cihaz baglantisi yok')
            }
        }catch (e) {
            console.log('SerialPort Problem;',e)
        }

    }

module.exports = {
        port:serialPort,
        sendCommand
    };