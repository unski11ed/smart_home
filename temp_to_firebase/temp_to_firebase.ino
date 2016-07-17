#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Arduino.h>

// Set these to run example.
#define FIREBASE_HOST "tempa-98a16.firebaseio.com"
#define FIREBASE_AUTH "lO7qMyw0NpgOREqqgw5XFy4t5wLIc1obA0yoj6GV"
#define WIFI_SSID "dom2"
#define WIFI_PASSWORD "dupajasiu2006"

#define ONEWIRE_PIN 4

#define MAX_TEMPS 10

OneWire onewire(ONEWIRE_PIN);
DallasTemperature sensors(&onewire);

int devicesCount = 0;
float oldTemps[MAX_TEMPS];

String deviceAddrToString(DeviceAddress addr) {
    String outputAddr = "";
    for (uint8_t i = 0; i < 8; i++)
    {
      outputAddr += String(addr[i], HEX);
    }
    return outputAddr;
}

void setup() {
  Serial.begin(9600);

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());

  sensors.begin();

  devicesCount = sensors.getDeviceCount();  

  Serial.print("Znaleziono urządzeń: ");
  Serial.println(sensors.getDeviceCount(), DEC);

  if(devicesCount > 0) {
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);  
  }
}

void loop() {
  if(devicesCount > 0) {
    sensors.requestTemperatures();

    int maxDevices = devicesCount > MAX_TEMPS ? MAX_TEMPS : devicesCount;
    
    for(int i = 0; i < maxDevices; i++) {
      float temp = sensors.getTempCByIndex(i);
      DeviceAddress addr;
      sensors.getAddress(addr, i);
      String str_Address = deviceAddrToString(addr);
      
      String pathValue = "temperatures/" + String(i, DEC);
      String pathAddress = "temperatures/" + String(i, DEC);

      pathValue += "/value";
      pathAddress += "/address";

      if(oldTemps[i] != temp) {
        Firebase.setFloat(pathValue, temp);
  
        if (Firebase.failed()) {
            Serial.print("Failed to set temp value:");
            Serial.println(Firebase.error());  
            return;
        }
  
        Firebase.setString(pathAddress, str_Address);
  
        if (Firebase.failed()) {
            Serial.print("Failed to set temp address:");
            Serial.println(Firebase.error());  
            return;
        }

        oldTemps[i] = temp;
      }
    }

    delay(1000);
  }
}

