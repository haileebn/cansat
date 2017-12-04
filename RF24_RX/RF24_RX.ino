#include <SPI.h>
#include "RF24.h"
#include <TimeLib.h>

const uint64_t pipe = 0xE8E8F0F0E1LL; // адрес канала передачи
RF24 radio(9,10);

typedef struct {
  time_t timestamp;
  float lat;
  float lon;
  float pressure;
  float co;
  int temp;
  int hud;
  int pm1;
  int pm25;
  int pm10;
} 
A_t;


A_t data;
 String json_string;
void setup(){
  Serial.begin(9600);
  //============================================================Модуль NRF24
  radio.begin();                      // Включение модуля
  radio.setAutoAck(1);                // Установка режима подтверждения приема;
  radio.setDataRate(RF24_250KBPS);    // Устанавливаем скорость
  radio.setChannel(10);               // Устанавливаем канал
  radio.openReadingPipe(1,pipe);      // Открываем 1 канал приема
  radio.startListening();             // Начинаем слушать эфир
  
}

void loop(){
  if (radio.available()){
    while (radio.available()){
      radio.read(&data, sizeof(data));
       json_string = String("{\"time\":\"" + String(data.timestamp) + "\",") 
                + String("\"values\":{")
                + String("\"LAT\":\"" + String(data.lat,10) + "\",")
                + String("\"LON\":\"" + String(data.lon,10) + "\",")
                + String("\"temp\":\"" + String(data.temp) + "\",")
                + String("\"hud\":\"" + String(data.hud) + "\",")
                + String("\"pressure\":\"" + String(data.pressure) + "\",")
                + String("\"pm1\":\"" + String(data.pm1) + "\",")
                + String("\"pm25\":\"" + String(data.pm25) + "\",")
                + String("\"pm10\":\"" + String(data.pm10) + "\",")
                + String("\"CO\":\"" + String(data.co) + "\"")
                + String("}}");
       Serial.println(json_string);
    }
  }
}

