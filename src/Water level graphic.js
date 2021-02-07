// Skript: Water level graphic
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
    await widget.presentMedium()
}

Script.setWidget(widget)
Script.complete()

async function createWidget() {
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

// End