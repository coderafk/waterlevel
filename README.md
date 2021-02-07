# Scriptable-Widget zur Anzeige von Wasserstandsmeldungen in Deutschland

**Lizenz: MIT-Lizenz**

<kbd><img src="/images/waterlevelScreenshot.png" height="695" width="321"></kbd> <kbd><img src="/images/stationsScreenshot.png" height="695" width="413"></kbd>

Dieses Projekt enthält 2 Skripte zum Anzeigen von aktuellen Wasserstandsmeldungen in Deutschland.

Es werden dafür die WebServices von [PEGELONLINE](https://www.pegelonline.wsv.de/webservice/guideRestapi) aus Deutschland genutzt.

Das Skript **Water level graphic.js** zeigt ein Diagramm der letzten Pegelstände einer ausgewählten Messstelle an.
Das Skript **Water level value.js** zeigt den aktuellen Wert einer ausgewählten Messstelle an. 

Als Parameter für das Widget muss die jeweilige **uuid** der Messstelle angegeben werden. Diese **uuid** lässte sich über eine WebService Abfrage von PEGELONLINE ermitteln.

[PEGELONLINE Messstellen](https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json)

Dort einfach nach dem Ort suchen und die jeweilige **uuid** kopieren und als Parameter eintragen.

## Installation

- Zunächst muss im App-Store die App [Scriptable](https://apps.apple.com/de/app/scriptable/id1405459188) installiert werden.
- Die beiden Skripte aus dem Verzeichnis **src** auf dem iPhone nach **Dateien** (icloud) in das Verzeicnis **Scriptable** kopieren oder direkt in der App hinzufügen.
- Wenn das Scriptables-Widget hinzugefügt wurde, kann als Parameter die **uuid** der jeweilig gewünschten Messstelle himzugefügt werden. Wird nichts angegeben, wird die Messtelle **Magdeburg - Strombrücke** angezeigt.
