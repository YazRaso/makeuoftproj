#include <Servo.h>
#define TRIG_PIN 9
#define ECHO_PIN 10
#define BIN_FULL_THRESHOLD 6
#include <Servo.h>
#define IR_SENSOR_PIN 7

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1 
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

Servo myServo;  // Create servo object

float maxBinDistance;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  myServo.attach(8); // Attach servo to digital pin 8
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(IR_SENSOR_PIN, INPUT);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    while (true);
  }
  display.clearDisplay();
  display.display();
  float sum = 0;
  for(int i=0; i<10; i++){
    float maxBinDistance = getDistance();
    sum += maxBinDistance;
  }
  maxBinDistance = sum/10;
}

void openBin(){
    for (int pos = 0; pos <= 90; pos += 1) { 
        myServo.write(pos); 
        delay(15); // Smooth motion delay
    }
    delay(1000); 
}

float getDistance() {
    digitalWrite(TRIG_PIN, LOW);
    delay(2);
    digitalWrite(TRIG_PIN, HIGH);
    delay(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH);
    float distance = (duration * 0.034) / 2;  // Convert to cm
    return distance;
}

void loop() {
  
  // put your main code here, to run repeatedly:
  String command = Serial.readStringUntil('\n'); // PYTHON open/close command

    float distance = getDistance();
    Serial.print("Trash Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
    Serial.println(maxBinDistance);

    int percentageFull = ((maxBinDistance-distance)/20) * 100;
    if (distance < BIN_FULL_THRESHOLD) {
        Serial.println("Bin is full!");
    }
    else if (distance >= BIN_FULL_THRESHOLD && distance <= maxBinDistance){
        Serial.println("Bin is " + String(percentageFull) + "% full!");
        if(command == "OPEN"){
          openBin();
        }
    }
    else if (distance > maxBinDistance){
        Serial.println("Bin is opened!");  // Keep lid open
    }

    display.clearDisplay();
    display.setTextSize(2);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(10, 25);
    if (percentageFull < 100 && percentageFull >= 0) {
      display.print("Capacity: ");
      display.print(percentageFull);
      display.print("%");
    
    } 
    else if (percentageFull >= 100){
      display.print("ITS FULL :(");
    }
    else{
      display.print("Opened");
    }
  display.display();
  delay(100);
}
