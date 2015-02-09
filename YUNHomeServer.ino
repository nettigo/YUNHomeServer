	
#include <Process.h>

#define PUMP_ON true
#define PUMP_OFF false

Process node;

bool pumpState = PUMP_OFF;
unsigned long timeLast = millis();

void setup() {
  Bridge.begin();
  
  node.begin("node");
  node.addParameter("/mnt/sda1/arduino/YUNHomeServer/YHS.js");
  node.runAsynchronously();
  
  setupRadio();
}

void loop() {
  commandDecoder();
  bool timeOut = timerProcess();
  if (timeOut)
  {
    pumpControl();
  }
}

void commandDecoder()
{
  if (node.available())
  {
    String command = node.readStringUntil('\n');
    if (command == F("on"))
    {
      pumpState = PUMP_ON;
    }
    
    else if (command == F("off"))
    {
      pumpState = PUMP_OFF;
    }
  }
}

bool timerProcess()
{
  unsigned long timeNow = millis();
  unsigned long timeDelta = timeNow - timeLast;
  if (timeDelta >= 500)
  {
    timeLast = timeNow;
    return true;
  }
  
  return false;
}

void pumpControl()
{
  if (pumpState == PUMP_ON)
  {
    sendCommand(PUMP_ON);
  }
  
  else
  {
    sendCommand(PUMP_OFF);
  }
}
