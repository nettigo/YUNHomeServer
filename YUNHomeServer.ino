	
#include <Process.h>

#define PUMP_ON true
#define PUMP_OFF false
#define MAX_DEVICES  4
Process node;

bool pumpState[MAX_DEVICES];

unsigned long timeLast = millis();

void setupPump(){
  for (int i=0;i<MAX_DEVICES;i++) { pumpState[i] = PUMP_OFF;}
}

void setup() {
  Bridge.begin();
  Console.begin();

  setupPump();  
  node.begin("node");
  node.addParameter("/mnt/sda1/arduino/YUNHomeServer/yuncms.js");
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
    String index = node.readStringUntil(' ');
    Console.print(F("index:"));
    Console.println(index);
    String command = node.readStringUntil('\n');
    Console.print(F("command:"));
    Console.println(command);
    byte idx = index.toInt();
    if (idx >= MAX_DEVICES) { return; }
    if (command == F("true"))
    {
      pumpState[idx] = PUMP_ON;
    }
    
    else if (command == F("false"))
    {
      pumpState[idx] = PUMP_OFF;
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
  for (byte i = 0; i< MAX_DEVICES; i++) {
    if (pumpState[i] == PUMP_ON)
    {
      sendCommand(i,PUMP_ON);
    }
    else
    {
      sendCommand(i,PUMP_OFF);
    }
  }
}
