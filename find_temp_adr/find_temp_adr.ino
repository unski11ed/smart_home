#include <OneWire.h>
#include <DallasTemperature.h>

#define ONEWIRE_PIN 4

OneWire onewire(ONEWIRE_PIN);
DallasTemperature sensors(&onewire);

void printAddress(DeviceAddress deviceAddress)
{
  for (uint8_t i = 0; i < 8; i++)
  {
    if (deviceAddress[i] < 16) Serial.print("0");
    Serial.print(deviceAddress[i], HEX);
  }
}

void setup() {
  Serial.begin(9600);

  sensors.begin();
}

void loop() {
  DeviceAddress adr;
  
  if(sensors.getAddress(adr, 0)) {
    Serial.print("Device address: ");
    printAddress(adr);
    Serial.println();
  }
  
  delay(10000);
}
