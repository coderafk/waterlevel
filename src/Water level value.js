// Skript: Water level value
// Source: https://github.com/coderafk/waterlevel
let uuid = ""
let param = args.widgetParameter
if (param != null && param.length > 0) {
    uuid = param
}

const widget = new ListWidget()

await createWidget()

// Used for debugging if script runs inside the app.
if (!config.runsInWidget) {
    await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

async function createWidget() {
    if (uuid == null || uuid == "") {
        uuid = "ccccb57f-a2f9-4183-ae88-5710d3afaefd" // uuid 'Magdeburg-Strombrücke'
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