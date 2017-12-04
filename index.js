const express = require('express');
const router = express();

var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

var serialPort = new SerialPort('COM6', {
  baudRate: 9600
});


const port = 8080;
const parser = serialPort.pipe(new Readline({ delimiter: '\r\n' }));
    parser.on('data', (result) => {
    	let json = JSON.parse(result);
    	console.log(json);
    });
// console.log(parser)


router.get('/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send("Hello!!!");
});

router.listen(port, () => {
    console.log(`server:`);
});