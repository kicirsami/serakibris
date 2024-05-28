#include <EEPROM.h> 
#include <DHT.h> 
#include <Wire.h>
#include <LiquidCrystal_I2C.h> 

LiquidCrystal_I2C lcd(0x27, 16, 2);

#define DHTPIN 6 
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define ArttirButonu 7
#define EksiltButonu 9
#define SecButonu 8 
#define ToprakSensoru A1 
#define IsikSensoru A0 
#define SuMotoru 2
#define Fan 4
#define Lamba 3
#define magnet_switch 11    

// Water Sensor pins
#define sensorPower 10
#define sensorPin A2

char slogan[] = "SERA KIBRIS";
int sloganLength = sizeof(slogan) - 1;

int MenuUstDeger[5] = {100, 100, 100, 1000, 100}; // Değişen eşik değerleri yüzde olarak güncelledim
int MenuDeger[5] = {}; 
int Menu = -1;
bool EkranYaz = false;
unsigned long Zaman = 0, Zaman2 = 0;

// Fonksiyon prototipleri
int calculateSoilMoisturePercentage(int sensorValue);
void writeIntIntoEEPROM(int address, int number);
int readIntFromEEPROM(int address);
int readSensor();

void setup() { 
    pinMode(magnet_switch, INPUT_PULLUP);
    dht.begin();
    lcd.init();
    lcd.backlight();
    pinMode(ArttirButonu, INPUT_PULLUP);
    pinMode(EksiltButonu, INPUT_PULLUP); 
    pinMode(SecButonu, INPUT_PULLUP);
    digitalWrite(ArttirButonu, HIGH); 
    digitalWrite(EksiltButonu, HIGH); 
    digitalWrite(SecButonu, HIGH);
    pinMode(ToprakSensoru, INPUT); 
    pinMode(IsikSensoru, INPUT); 
    pinMode(SuMotoru, OUTPUT); 
    pinMode(Fan, OUTPUT);
    pinMode(Lamba, OUTPUT); 
    digitalWrite(SuMotoru, HIGH); 
    digitalWrite(Fan, HIGH); 
    digitalWrite(Lamba, HIGH);
    pinMode(sensorPower, OUTPUT);
    digitalWrite(sensorPower, LOW);

    Serial.begin(9600);
    MenuDeger[0] = readIntFromEEPROM(0); 
    MenuDeger[1] = readIntFromEEPROM(2); 
    MenuDeger[2] = readIntFromEEPROM(4); 
    MenuDeger[3] = readIntFromEEPROM(6); 
    delay(2000);
    lcd.setCursor(2, 0);
    for (int i = 0; i < sloganLength; i++) {
        lcd.print(slogan[i]);
        delay(200); 
    }
    for (int i = 0; i < sloganLength; i++) {
        lcd.setCursor(i, 0);
        lcd.print(" ");
        delay(200); 
    }
    for (int i = 0; i < sloganLength; i++) {
        lcd.print(" ");
        delay(100); 
    }
    delay(100);
}

void loop() {
    if (digitalRead(magnet_switch) == HIGH){
        lcd.clear();
        lcd.print("Alarm");
        delay(200);
    }

    int level = readSensor();
    float h = dht.readHumidity(); 
    float t = dht.readTemperature(); 

    if (digitalRead(SecButonu) == 1) {
        delay(50);
        Menu++; 
        if (Menu > 4) Menu = 0; 
        while (digitalRead(SecButonu) == 1); 
        EkranYaz = true;
        Zaman = millis();
    }

    if (digitalRead(EksiltButonu) == 1 && millis() - Zaman < 7000) {
        delay(50);
        MenuDeger[Menu] -= 5;
        if (MenuDeger[Menu] < 0) MenuDeger[Menu] = 0; 
        while (digitalRead(EksiltButonu) == 1);
        EkranYaz = true; 
        Zaman = millis();
    }

    if (digitalRead(ArttirButonu) == 1 && millis() - Zaman < 7000) {
        delay(50);
        MenuDeger[Menu] += 5;
        if (MenuDeger[Menu] > MenuUstDeger[Menu]) MenuDeger[Menu] = MenuUstDeger[Menu];
        while (digitalRead(ArttirButonu) == 1); 
        EkranYaz = true;
        Zaman = millis();
    }

    if (millis() - Zaman < 7000) {
        if (EkranYaz) {
            lcd.clear();
            if (Menu == 0) {
                lcd.setCursor(4, 0); 
                lcd.print("SICAKLIK"); 
            } else if (Menu == 1) {
                lcd.setCursor(3, 0); 
                lcd.print("ORTAM NEMI"); 
            } else if (Menu == 2) {
                lcd.setCursor(2, 0); 
                lcd.print("TOPRAK NEMI"); 
            } else if (Menu == 3) {
                lcd.setCursor(1, 0); 
                lcd.print("ISIK SEVIYESI"); 
            } else if (Menu == 4) {
                lcd.setCursor(0, 0); 
                lcd.print("Degisiklikleri"); 
                lcd.setCursor(0, 1);
                lcd.print("kaydet"); 
                if (MenuDeger[Menu] < 0) {
                    MenuDeger[Menu] = 0; 
                }
            }
            lcd.setCursor(7, 1);
            lcd.print(MenuDeger[Menu]);
            EkranYaz = false;
        }
    } else if (millis() - Zaman2 > 4000) {
        lcd.clear(); 
        lcd.setCursor(0, 0); 
        lcd.print("SICAKLIK:"); 
        lcd.print(t); 
        lcd.print(" "); 
        lcd.setCursor(0, 1); 
        lcd.print("NEM:"); 
        lcd.print(h); 
        Zaman2 = millis(); 
        Menu = -1; 
        delay(1000);
    } else if (millis() - Zaman2 > 2000 && millis() - Zaman2 < 2100) {
        lcd.clear(); 
        lcd.setCursor(0, 0); 
        lcd.print("T. NEM:");
        int soilMoistureValue = analogRead(ToprakSensoru); 
        int soilMoisturePercentage = calculateSoilMoisturePercentage(soilMoistureValue); 
        lcd.setCursor(7, 0); 
        lcd.print(soilMoisturePercentage);
        lcd.print("%");
        lcd.setCursor(0, 1);
        lcd.print("SU SEVIYESI:");
        int waterLevelPercentage = map(level, 0, 530, 0, 100); 
        lcd.print(waterLevelPercentage); 
        lcd.print("%");
        Menu = -1;
        delay(1000);
    } 
    

    if (MenuDeger[4] > 0) {
        writeIntIntoEEPROM(0, MenuDeger[0]); 
        writeIntIntoEEPROM(2, MenuDeger[1]); 
        writeIntIntoEEPROM(4, MenuDeger[2]);
        writeIntIntoEEPROM(6, MenuDeger[3]); 
        lcd.clear();
        lcd.setCursor(0, 0); 
        lcd.print("Veriler");
        lcd.setCursor(0, 1);
        lcd.print("Kaydedildi...");  
        MenuDeger[4] = 0; 
        delay(1000);
        Zaman = Zaman - 7000;
    }

    if (t < MenuDeger[0]) {
        digitalWrite(Lamba, HIGH); 
    } else {
        digitalWrite(Lamba, LOW); 
    }
   
    if (h > MenuDeger[1]) {
        digitalWrite(Fan, LOW); 
    } else {
        digitalWrite(Fan, HIGH); 
    }

    if (calculateSoilMoisturePercentage(analogRead(ToprakSensoru)) < 30 || Menu == 2 && MenuDeger[2] < 40) {
        digitalWrite(SuMotoru, LOW); 
    } else {
        digitalWrite(SuMotoru, HIGH); 
    }

  Serial.print(String(t) + ",");
  Serial.print(String(h) + ",");
  Serial.print(String(calculateSoilMoisturePercentage(analogRead(ToprakSensoru))) + ",");
  Serial.print(String(map(readSensor(), 0, 510, 0, 100)) + ",");
  Serial.print(String(digitalRead(Lamba) == LOW) + ",");
  Serial.print(String(digitalRead(SuMotoru) == LOW) + ",");
  Serial.print(String(digitalRead(Fan) == LOW) + ",");
  Serial.println(String(digitalRead(magnet_switch) == HIGH));
}

int calculateSoilMoisturePercentage(int sensorValue) {
    return map(sensorValue, 0, 1023, 100, 0);
}


void writeIntIntoEEPROM(int address, int number) {
    EEPROM.write(address, number >> 8); 
    EEPROM.write(address + 1, number & 0xFF);
}

int readIntFromEEPROM(int address) {
    return (EEPROM.read(address) << 8) + EEPROM.read(address + 1);
}

int readSensor() {
    digitalWrite(sensorPower, HIGH);
    delay(10);                           
    int val = analogRead(sensorPin);        
    digitalWrite(sensorPower, LOW);        
    return val;                            
}



