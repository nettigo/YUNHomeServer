#YUN Home Server

YHS składa się z dwóch podstawowych elementów:

* szkicu dla Arduino YUN
* aplikacji w Node.JS

Szkic odpowiada za komunikację radiową z gniazdkami (zajrzyj do `YUNHomeServer.ino`). Część działająca na Node.JS 
(`YHS.js` oraz katalog `node_modules`), to jest coś co może być użyte w innych projektach, wszędzie tam gdzie jest
Node.JS. Czyli też np na Raspberry Pi.

W tej chwili YHS.js uruchomiony zwraca polecenia 'on' i 'off' przez linię komend, więc prosty skrypt w Pythonie, który 
kontroluje [moduł przekaźnika - Nettigo Relay](https://nettigo.pl/products/modul-przekaznika-dla-arduino-lub-raspberry-pi)
podłączony do GPIO nr 4 wyglądać może tak:

	import os
	
	import RPi.GPIO
	
	RPi.GPIO.setmode(RPi.GPIO.BCM)
	RPi.GPIO.setup(4, RPi.GPIO.OUT)
	
	node = os.popen('node pompa.js')
	while True:
	    command = node.readline()
	    command = command.strip()
	    if command == 'on':
	        RPi.GPIO.output(4, RPi.GPIO.HIGH)
	        print('Pump ON')
	
	    else if command == 'off':
	        RPi.GPIO.output(4, RPi.GPIO.LOW)
	        print('Pump OFF')


#TODO

* obsługa więcej niż jednego gniazdka
* zmiana sposobu wysyłania komend. Teraz przez ciągłe wysłanie ON lub OFF nie da się zrobić 'ręcznego override' 
czyli naciśnięcie przycisku na gniazdku nie daje rezultatu (tzn zaraz jest gaszone lub zapalane ponownie przez 
szkic w pętli)

