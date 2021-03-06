# Scriptable-Widget zur Anzeige von Wasserstandsmeldungen in Deutschland

**Lizenz: MIT-Lizenz**

<kbd><img src="/images/waterlevelScreenshot1.png" height="695" width="321"></kbd> <kbd><img src="/images/waterlevelScreenshot2.png" height="695" width="321"></kbd></kbd> <kbd><img src="/images/waterlevelScreenshot3.png" height="695" width="321"></kbd><kbd><img src="/images/stationsScreenshot.png" height="695" width="413"></kbd>

Dieses Projekt enthält ein Skript (**WaterLevel.js**) zum Anzeigen von aktuellen Wasserstandsmeldungen in Deutschland (siehe Screenshots).

Es werden dafür die WebServices von [PEGELONLINE](https://www.pegelonline.wsv.de/webservice/guideRestapi) aus Deutschland genutzt.

**Hinweise**
- Wird kein Parameter angegeben, versucht das Skript über die Standardortermittlung die nächstliegende Station zu finden und anzuzeigen. Ist die Standardortermittlung deaktiviert, kann über den Widget-Parameter ein Standort per eindeutiger Uuid festgelegt werden.
- Ein kleiner Pfeil neben dem Messwert zeigt den Trend an. 
- Es gibt Stationen zu denen keine Messwerte von Pegelonline vorliegen. In diesem Fall einfach eine naheliegende andere Station auswählen.
- Wird bei der Widget Einstellung **When Interacting** -> **Run Script** ausgewählt (siehe Bild), wird bei einem Klick auf das Widget eine Karte geöffnet, die den Standort der Messstation anzeigt. 

Eine **uuid** lässte sich über eine WebService Abfrage von PEGELONLINE ermitteln.

[PEGELONLINE Messstellen](https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json)

Dort einfach nach dem Ort suchen und die jeweilige **uuid** kopieren und als Parameter eintragen.

## Installation

- Zunächst muss im App-Store die App [Scriptable](https://apps.apple.com/de/app/scriptable/id1405459188) installiert werden.
- Das Skript aus dem Verzeichnis **src** auf dem iPhone nach **Dateien** (icloud) in das Verzeichnis **Scriptable** kopieren oder direkt in der App hinzufügen.
- Jetzt das Scriptable-Widget einfach auf dem iPhone einrichten und das Skript WaterLevel auswählen.