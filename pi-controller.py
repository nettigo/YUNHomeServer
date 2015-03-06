import os
import subprocess

binaryCode = {	
	"1": {"true": "010100000100010101010011", "false": "010100000100010101011100"},
	"2": {"true": "010100000101000101010011", "false": "010100000101000101011100"},
	"3": {"true": "010100000101010001010011", "false": "010100000101010001011100"},
	"4": {"true": "010100000101010100010011", "false": "010100000101010100011100"} 
	}

node = os.popen('node yuncms.js')
while True:
	command = node.readline()
	command = command.strip()
	idx = command.split()[0]
	action = command.split()[1]
	str = binaryCode[idx][action]
	subprocess.call(["./send",str]) 
