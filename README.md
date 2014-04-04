HandiCopter
===========

Hand controlled helicopter (powered by LeapMotion and Raspberry Pi)


SAP InnoJam 2014
----------------

This project was built in just 3 days of InnoJam at SAP Labs IL.

The Code
--------

We used a LeapMotion device to map hand positions to 3 chopper dimensions: Thrust, Roll and Pitch. Then we send these commands to the Raspberry Pi via UDP socket. 

The raspberry was first used to record the choper's IR remote control and map its commands.
Later we used it to to send these commands to the helicopter.
We used LIRC - a built model for IR and followed the instruction [here] [1].


We used node.js for the UDP server as well and for each message we got (Thrus, Pitch, Roll), we mapped it to one of the recorded IR commands.

This code is now a mess! hopefully we'll sort it out, with time...

What's in it for you?
---------------------

Using this basic concept of this code you can actually map any IR remote control command you want to any hand gesture you like. Any IR control device at your home/work and be controlled with a simple hand motion.

Links:
------

* [VDO] [2]
  

Team Members:
-------------
Erez Neiderman, Saar Dagan, Nadav Nuri, Tal Haviv, Ido Fishler.


[1]: http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/		"here"

[2]: http://youtu.be/F0YWdb6oNDI												"The Making of video"