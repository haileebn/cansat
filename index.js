// const express = require('express');
const mongoClient = require('mongodb').MongoClient;
let SerialPort = require('serialport');

// const router = express();
const URL_CONNECT="mongodb://localhost:27017/cansat"
const Readline = SerialPort.parsers.Readline;


let serialPort = new SerialPort('COM6', {
  baudRate: 9600
});


// const port = 8080;
const parser = serialPort.pipe(new Readline({ delimiter: '\r\n' }));

mongoClient.connect(URL_CONNECT, (err, db)=>{
	if (err) console.log(err);
	parser.on('data', (result) => {
		let json = JSON.parse(result);
		let values = json["values"];
		let data = {
		    'time_read': json.time*1000,
		    'time_import': new Date().getTime(),
		    'al': Number(values.al),
		    'lat': checkZero(values.LAT),
		    'lon': checkZero(values.LON),
		    'tem': checkZero(values.temp)/10,
		    'hum': checkZero(values.hud)/10,
		    'pres': checkZero(values.pressure),
		    'pm1': checkZero(values.pm1),
		    'pm25': checkZero(values.pm25),
		    'pm10': checkZero(values.pm10),
		    'co': checkZero(values.CO)
		    }

		db.collection('input').insertOne(data, (err, result)=>{
		// // res.setHeader('Content-Type', 'application/json');
			if (err) throw err;

			console.log(data);
		});
	});
});


// console.log(parser)

// router.get('/', (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.send("Hello!!!");
// });

// router.listen(port, () => {
//     console.log(`server:`);
// });

function checkZero(number){
    return number === 0 ? null : Number(number);
}

/**
 * t,p la nhiet do, ap suat o tren cao
 * t0, p0 la nhiet do, ap suat ban dau duoi mat dat
 */
// function getAltitudePressure(t, p, t0, p0){
//     const R = 287.05; // J/Kg°K
//     const g = 9.80665; //m/s 2.

//     if(t === 0 || t0 === 0){
//         return 0;
//     }
//     else {
//         const k = 273.15;
//         const T = t + k;
//         const T0 = t0 + k;
//         if(p === 0) return 0;
//         else {
//             return ((R/g)*((T+ T0)/2)*Math.log10(p0/p));
//         }
//     }
// }
