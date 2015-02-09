#include <RCSwitch.h>

#define RADIO_PIN  2

RCSwitch mySwitch = RCSwitch();

void setupRadio(){
  mySwitch.setPulseLength(161); // Przepisujemy wartość sczytaną z serial monitora
  pinMode(RADIO_PIN,OUTPUT);
  mySwitch.enableTransmit(RADIO_PIN); 
}

void sendCommand(bool pumpStatus) {
  if (PUMP_ON == pumpStatus) {
    mySwitch.send("010100000100010101010011");
  } else {
    mySwitch.send("010100000100010101011100");
  }
}
