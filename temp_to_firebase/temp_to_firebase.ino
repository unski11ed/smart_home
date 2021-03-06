#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>										  //Obsługa FireBase
#include <OneWire.h>												      //Obsługa 1Wire
#include <DallasTemperature.h>										//Obsługa DS18B20
#include <Arduino.h>
#include <TimeLib.h>												      //Biblioteka czasu
#include <NtpClientLib.h>											    //Biblioteka czasu z internetu

#include <DNSServer.h>												    //AP konfiguracja
#include <ESP8266WebServer.h>										  //konfiguracja WIFI
#include <WiFiManager.h>                          //https://github.com/tzapu/WiFiManager


// Set these to run example.
#define FIREBASE_HOST "temperatury-870d5.firebaseio.com"					//Projekt FireBase
#define FIREBASE_AUTH "<<<<<WPISAC TU KLUCZ Z FIREBASE>>>>>"    	//klucz
#define BOARD_ID "TEMPY_DOL"										                  //Unikalne ID Płytki. UWAGA: Inne dla każdej płytki!!!

#define ONEWIRE_PIN 4												                      //Pin do którego podłączony jest DS18B20
#define MAX_TEMPS 10												                      //Ile czujników maksymalnie

OneWire onewire(ONEWIRE_PIN);										                  //Konfiguracja 1Wire
DallasTemperature sensors(&onewire);								              //Konfiguracja sensorów

String rootPath = String("/boards/") + String(BOARD_ID);
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
Serial.begin(115200);												                      //Start Rs232
 
	//WiFiManager
	//Local intialization. Once its business is done, there is no need to keep it around
	WiFiManager wifiManager;
	//reset saved settings
	//wifiManager.resetSettings();
	
	//set custom ip for portal
	//wifiManager.setAPConfig(IPAddress(10,0,1,1), IPAddress(10,0,1,1), IPAddress(255,255,255,0));

	//fetches ssid and pass from eeprom and tries to connect
	//if it does not connect it starts an access point with the specified name
	//here  "AutoConnectAP"
	//and goes into a blocking loop awaiting configuration
	String configSSID = String("Board ID:") + String(BOARD_ID);
	wifiManager.autoConnect(configSSID.c_str());
	//or use this for auto generated name ESP + ChipID
	//wifiManager.autoConnect();

	sensors.begin();													                    //Start DS18b20
	devicesCount = sensors.getDeviceCount();							        //Ile podłaczonych DS18B20
	
	Serial.print(F("Znaleziono termometr: "));
	Serial.println(devicesCount, DEC);
	
	
	
	NTP.onNTPSyncEvent([](NTPSyncEvent_t error) {					        //Podłaczenie sysnchronizacji czasu
		if (error) {													                      //Bład
			Serial.print("Time Sync error: ");
			if (error == noResponse)
			Serial.println("NTP server not reachable");
			else if (error == invalidAddress)
			Serial.println("Invalid NTP server address");
		}
		else {																                      //Synchronizacja ok
			Serial.print("Got NTP time: ");
			Serial.println(NTP.getTimeDateString(NTP.getLastNTPSync()));
			Firebase.setString(rootPath + F("/accessTime"), NTP.getTimeDateString());
		}
	});
	NTP.begin("pl.pool.ntp.org", 1, true);								        //start odzcytu czasu i daty z serwera
	NTP.setInterval(1800);												                //co jaki czas powtórzać
	
	Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
	Firebase.setInt(rootPath + F("/devicesCount"), devicesCount);
	Firebase.setString(rootPath + F("/boardId"), BOARD_ID);
	Firebase.setString(rootPath + F("/connectedIp"), String(WiFi.localIP().toString()));
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
			
			String deviceBasePath = rootPath + String("/temparatures/") + String(i, DEC);

			String pathValue = deviceBasePath + "/value";
			String pathAddress = deviceBasePath + "/address";
			String pathTime = deviceBasePath + "/time";
			
			if(oldTemps[i] != temp) {
				Firebase.setFloat(pathValue, temp);
				
				if (Firebase.failed()) {
					Serial.println(F("Failed to set temp value:"));
					Serial.println(Firebase.error());
					return;
				}
				
				Firebase.setString(pathAddress, str_Address);
				
				if (Firebase.failed()) {
					Serial.println(F("Failed to set temp address:"));
					Serial.println(Firebase.error());
					return;
				}
				
				
				Firebase.setString(pathTime, NTP.getTimeDateString());
				if (Firebase.failed()) {
					Serial.println(F("Failed to set CZAS POM:"));
					Serial.println(Firebase.error());
					return;
				}
				
				oldTemps[i] = temp;
			}
		}

		delay(1000);
	}
}


