#include <RCSwitch.h>

#define RADIO_PIN  10



RCSwitch mySwitch = RCSwitch();

void setupRadio(){
  mySwitch.setPulseLength(161); // Przepisujemy wartość sczytaną z serial monitora
  pinMode(RADIO_PIN,OUTPUT);
  mySwitch.enableTransmit(RADIO_PIN); 
}

void sendCommand(byte index, bool pumpStatus) {
  if (PUMP_ON == pumpStatus) {
    switch(index) {
      case 1:
        mySwitch.send("010100000100010101010011");
        break;
      case 2:
        mySwitch.send("010100000101000101010011");
        break;
    }

  } else {
    switch(index) {
        case 1:
        mySwitch.send("010100000100010101011100");
        break;
      case 2:
        mySwitch.send("010100000101000101011100");
        break;
    }


  }
}
