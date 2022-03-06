# FreeSO Launcher
The official FreeSO Launcher available for Windows and Mac OS X.

![image](https://i.imgur.com/1bwlURh.png)
![image](https://i.imgur.com/7teAdLL.png)
![image](https://i.imgur.com/7WWBpbW.png)
![image](https://i.imgur.com/FvYgpHk.png)
![image](https://i.imgur.com/u5iJ0qD.png)
![image](https://i.imgur.com/lh5xDig.png)
<!--![image](https://i.imgur.com/hWXan8k.png)
![image](https://i.imgur.com/UPqQgBZ.png)
![image](https://i.imgur.com/JLznCnv.png)
![image](https://i.imgur.com/cEV2qqs.png)-->
<!--![image](https://i.imgur.com/yCUFHhE.png)-->
<!--![image](https://i.imgur.com/86vaK8l.png)-->
<!--![image](https://i.imgur.com/1h6OPE2.png)-->
<!--![image](https://i.imgur.com/aF5RX5n.png)--><!-- ![image](https://i.imgur.com/dPRDgHh.jpg) -->

### Prerequisites for development
* You must have `Node 14.16` installed on your system.
* It’s recommended to build the launcher on the target OS. If you’re building for Mac, use a Mac. If you’re building for Windows, use a PC. I have not tested building both on one single OS, so I’m not sure if it works.
* You might have to install the vendor dependencies (inside the /vendor/ folder) using `npm` before running or building the project: 
  - Enter each folder inside vendor and run `npm i --production`.

## How to run
Clone the repo and then:
```
cd src
npm i 
npm run start
```
## How to build
After cloning and `npm i` the repo, run from the `src` folder:
* For Windows:
```
npm run buildwin
```
* For Mac:
```
npm run builddarwin
```
Built binaries are generated in the `release` folder (`FreeSO Launcher.dmg` for Mac and `FreeSO Launcher Setup.exe` for Windows)

## Latest Releases
[Microsoft Windows 7 or later](https://beta.freeso.org/FreeSO%20Launcher%20Setup.exe) <br/>
[Mac OS X 10.10 (Yosemite) or later](https://beta.freeso.org/fsolauncher.dmg)

## On Linux support
I do not think it’s worth it to have linux support at this time.

A Lutris script exists that should install FreeSO and all of its dependencies: https://lutris.net/games/freeso/

## Visit the FreeSO Launcher wiki
Visit the [wiki](https://github.com/ItsSim/fsolauncher/wiki) for documentation, [user guides](https://github.com/ItsSim/fsolauncher/wiki/Using-FreeSO-Launcher) and [FAQs](https://github.com/ItsSim/fsolauncher/wiki/FAQ).

Developer guides: https://github.com/ItsSim/fsolauncher/wiki/Development-guide
