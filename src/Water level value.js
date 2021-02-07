// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
// Skript: Water level value
// Source: https://github.com/coderafk/waterlevel
const defaultUuid = "ccccb57f-a2f9-4183-ae88-5710d3afaefd" // default uuid 'Magdeburg-Strombrücke'
let param = args.widgetParameter
const widget = new ListWidget()

if (param != null && param.length > 0) {
    uuid = param.trim()
    if (uuid.length != 36) {
        const textColor = new Color("#FF0000")
        msg = "The uuid for a station must have a length of 36 chars but this '" + uuid + "' has " + uuid.length.toString() + "!"
        setText(widget, msg, textColor, 12)
    }
} else {
    uuid = defaultUuid
    await createWidget(widget, uuid)
}

// Used for debugging if script runs inside the app.
if (!config.runsInWidget) {
    await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(widget, uuid) {
    if (uuid == null || uuid == "") {
        uuid = defaultUuid
    }

    setWidgetBackground(widget,
        new Color("#141E30"),
        new Color("#28416F"))

    let pegelonlineBaseUrl = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/"

    let station = await getStationData(pegelonlineBaseUrl, uuid)
    let measurement = await getMeasurement(pegelonlineBaseUrl, uuid)

    gaugeMeter = measurement.currentMeasurement.value / 100

    const textColor = new Color("#F9E4B7")
    setGaugeText(widget, gaugeMeter, textColor, 32)

    const dateTimeJson = new Date(measurement.currentMeasurement.timestamp)
    setDateText(widget, dateTimeJson, textColor, 18)
    setTimeText(widget, dateTimeJson, textColor, 18)

    setStationText(widget, station, textColor, 6)

    Script.setWidget(widget)
}

function setWidgetBackground(widget, fromColor, toColor) {
    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [fromColor, toColor];
    widget.backgroundGradient = gradient;
}

async function getStationData(pegelonlineBaseUrl, uuid) {
    const url = pegelonlineBaseUrl + "stations/" + uuid + ".json"
    let req = new Request(url)
    let station = await req.loadJSON()
    return station
}

async function getMeasurement(pegelonlineBaseUrl, uuid) {
    const url = pegelonlineBaseUrl + "stations/" + uuid + "/W.json?includeCurrentMeasurement=true"
    let req = new Request(url)
    let measurement = await req.loadJSON()
    return measurement
}

function setGaugeText(widget, value, color, fontSize) {
    const valueText = widget.addText(value.toString() + " m")
    valueText.textColor = color
    valueText.centerAlignText()
    valueText.font = Font.mediumMonospacedSystemFont(fontSize)
}

function setDateText(widget, value, color, fontSize) {
    const optionsDate = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };
    const dateText = widget.addText(value.toLocaleDateString('de-DE', optionsDate))
    dateText.textColor = color
    dateText.centerAlignText()
    dateText.font = Font.mediumMonospacedSystemFont(fontSize)
}

function setTimeText(widget, value, color, fontSize) {
    const timeText = widget.addText(value.toLocaleTimeString('de-DE'))
    timeText.textColor = color
    timeText.centerAlignText()
    timeText.font = Font.mediumMonospacedSystemFont(fontSize)
}

function setStationText(widget, value, color, fontSize) {
    const stationText = widget.addText("\n\n" + value.water.longname + "\n\n" + value.longname)
    stationText.textColor = color
    stationText.centerAlignText()
    stationText.font = Font.mediumMonospacedSystemFont(fontSize)
}

function setText(widget, value, color, fontSize) {
    const valueText = widget.addText(value.toString())
    valueText.textColor = color
    valueText.centerAlignText()
    valueText.font = Font.mediumMonospacedSystemFont(fontSize)
}

function debugAlert(msg)
{
    let alert = new Alert();
    alert.title = "Debug message"
    alert.message = msg
    alert.addAction("OK")
    alert.presentAlert()
  }

// End