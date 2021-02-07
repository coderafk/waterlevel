// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;
// Skript: Water level graphic
// Source: https://github.com/coderafk/waterlevel
const defaultUuid = "ccccb57f-a2f9-4183-ae88-5710d3afaefd" // default uuid 'Magdeburg-Strombrücke'
let param = args.widgetParameter
const widget = new ListWidget()
param = "1"
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
    await widget.presentMedium()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(widget, uuid) {
    if (uuid == null || uuid == "") {
        uuid = "ccccb57f-a2f9-4183-ae88-5710d3afaefd"
    }

    setWidgetBackground(widget,
        new Color("#141E30"),
        new Color("#28416F"))


    let pegelonlineBaseUrl = "https://www.pegelonline.wsv.de/webservices/rest-api/v2/"

    let pegelonlineStationUrl = pegelonlineBaseUrl + "stations/" + uuid + ".json"
    let requestPegelonlineStationUrl = new Request(pegelonlineStationUrl)
    let jsonStation = await requestPegelonlineStationUrl.loadJSON()


    let pegelonlineStationImageUrl = pegelonlineBaseUrl + "stations/" + uuid + "/W/measurements.png?start=P30D&width=700&height=300&enableSecondaryYAxis=true"
    let requestPegelonlineStationImageUrl = new Request(pegelonlineStationImageUrl)
    let image = await requestPegelonlineStationImageUrl.loadImage()

    widget.url = pegelonlineStationImageUrl

    let hstack = widget.addStack()
    hstack.layoutVertically()
    hstack.centerAlignContent()

    let widgetImg = hstack.addImage(image)
    widgetImg.applyFillingContentMode()

    setStationText(widget, jsonStation, new Color("#F9E4B7"), 8)

    Script.setWidget(widget)
}

function setWidgetBackground(widget, fromColor, toColor) {
    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [fromColor, toColor];
    widget.backgroundGradient = gradient;
}

function setStationText(widget, value, color, fontSize) {
    const stationText = widget.addText(value.water.longname + "  -  " + value.longname)
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

// End