// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: tint;
// Skript: Water level value
// Source: https://github.com/coderafk/waterlevel

//#region definitions
//#region global widget settings
Location.setAccuracyToThreeKilometers();
const searchRadius = 30; //search radius in km
//mapprovider is used to show the station locaton when the widget url is called.
const mapProvider = "openstreetmap";
//#endregion

//#region color constants
const textColor = new Color("#FFE640");
const backgroundGradientStartColor = new Color("#141E30");
const backgroundGradientEndColor = new Color("#4682a1");
//#endregion

//#region Pegelonline urls
const pegelonlineBaseUrl =
  "https://www.pegelonline.wsv.de/webservices/rest-api/v2/";
const stationsUrl = pegelonlineBaseUrl + "stations.json";
//#endregion

//#region class definitions
class Translation {
  constructor(letterCode2) {
    if (letterCode2.trim().toLowerCase() == "de") {
      this.noInternetConnection =
        "Der Server von Pegelonline konnte nicht erreicht werden. Besteht eine Internetverbindung?";
      this.noValidUuid = (uuid) => {
        return `Die Stations-uuid '${uuid}' ist nicht gültig.`;
      };
      this.uuidNotFound = (uuid) => {
        return `Die Stations-uuid '${uuid}' konnte nicht gefunden werden.`;
      };
      this.errorGettingStationData =
        "Beim Laden der Stationsdaten ist ein unbekannter Fehler aufgetreten.";
      this.noMeasurementData = (name) => {
        return `Für die Station '${name}' konnten keine Messdaten gefunden werden.`;
      };
      this.noStationFound = (searchRadius) => {
        return `Es konnte im Umkreis von ${searchRadius} km keine Station gefunden werden. Bitte den Suchradius im Skript vergrößern oder manuell eine Stations-uuid festlegen.`;
      };
      return;
    }
    this.noInternetConnection =
      "The Pegelonline server could not be reached.  Is there an internet connection?";
    this.noValidUuid = (uuid) => {
      return `The station-uuid '${uuid}' is not valid!`;
    };
    this.uuidNotFound = (uuid) => {
      return `The station-uuid '${uuid}' could not be found.`;
    };
    this.errorGettingStationData = "Unknown error getting station data!";
    this.noMeasurementData = (name) => {
      return `No measurement data could be found for the station '${name}'.`;
    };
    this.noStationFound = (searchRadius) => {
      return `No station could be found within a radius of ${searchRadius} km. Please increase the search radius in the script or manually specify a station-uuid.`;
    };
  }
}

class StationLocation {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
//#endregion

//#region default location of 'Magdeburg-Strombrücke'
//defaultLocation is only used if no location service is available and no uuid as parameter is given
const defaultLocation = new StationLocation(52.12958, 11.64412);
//#endregion

// define translations
let translation = new Translation("de");

var widgetFamily = "small";
if (config.runsInWidget) {
  widgetFamily = config.widgetFamily;
}
//#endregion

await main(args.widgetParameter, widgetFamily);

async function main(param, widgetFamily) {
  //debug param values
  //
  //valid uuids
  //param = defaultUuid
  //invalid uuids
  //param = undefined
  //param = null
  //param = 'z'
  //param = '550e8400-e29b-11d4-a716-446655440000'
  //param = '01234567-89ab-cdef-ghij-klmnopqrstuv'
  //param = '01234567-89ab-cdef-0123-456789abcdef'
  //param = '4520c1a8-174c-4b95-9ca3-fe1e3f9d874a'
  //param = '53d40547-8a09-4b25-988c-2e6d8d8d98ee'
  //

  console.log("widgetFamily: " + widgetFamily);

  result = await CheckInternetConnection();
  if (result == false) {
    return;
  }

  //#region determine values
  uuid = await getUuid(param);
  if (uuid == false) {
    return;
  }
  console.log("Using uuid: " + uuid);

  station = await getStation(uuid);
  if (station == false) {
    return;
  }
  console.log("Using station: " + station.shortname);

  currentMeasurement = await getCurrentMeasurement(uuid, station);
  if (currentMeasurement == false) {
    return;
  }
  console.log("Using currentMeasurement.value: " + currentMeasurement.value);
  //#endregion

  //#region get widget
  let pegelonlineStationImageUrl;
  let image;

  switch (widgetFamily) {
    case "large":
      pegelonlineStationImageUrl = getStationImageUrl(pegelonlineBaseUrl, uuid);
      image = await getImageRequest(pegelonlineStationImageUrl, 5);
      widget = await getLargeWidget(station, image, currentMeasurement);
      if (widget == false) {
        return;
      }
      break;
    case "medium":
      pegelonlineStationImageUrl = getStationImageUrl(pegelonlineBaseUrl, uuid);
      image = await getImageRequest(pegelonlineStationImageUrl, 5);
      widget = await getMediumWidget(station, image, currentMeasurement);
      break;
    case "small":
      widget = await getSmallWidget(station, currentMeasurement);
      if (widget == false) {
        return;
      }
      break;
  }
  setLocationWidgetUrl(widget, station);
  //#endregion

  //#region present widget
  if (!config.runsInWidget) {
    presentWidget(widget, widgetFamily);
  }

  Script.setWidget(widget);
  Script.complete();
  //#endregion
}

function presentWidget(widget, widgetFamily) {
  switch (widgetFamily) {
    case "large":
      widget.presentLarge();
      break;
    case "medium":
      widget.presentMedium();
      break;
    case "small":
      widget.presentSmall();
      break;
  }
}

//#region widget build functions
async function getSmallWidget(station, currentMeasurement) {
  maxFontSize = 48;
  const widget = new ListWidget();
  setWidgetBackground(
    widget,
    backgroundGradientStartColor,
    backgroundGradientEndColor
  );
  widget.spacing = 24;
  var dateFormatter = new DateFormatter();
  dateFormatter.useShortDateStyle();
  dateFormatter.useShortTimeStyle();

  dateTime = dateFormatter.string(new Date(currentMeasurement.timestamp));

  setText(widget, dateTime, textColor, 14);

  setText(widget, getGaugeText(currentMeasurement), textColor, 24);

  setText(
    widget,
    station.water.longname + "\n" + station.longname,
    textColor,
    8
  );

  return widget;
}

async function getMediumWidget(station, image, currentMeasurement) {
  var widget = new ListWidget();
  setWidgetBackground(
    widget,
    backgroundGradientStartColor,
    backgroundGradientEndColor
  );
  widget.spacing = 1;

  widget.addSpacer(20);

  let widgetImg = widget.addImage(image);
  widgetImg.cornerRadius = 8;
  widgetImg.applyFillingContentMode();

  var footer =
    station.water.longname +
    "  -  " +
    station.longname +
    "  -  " +
    currentMeasurement.value / 100 +
    " m " +
    getTrend(currentMeasurement.trend);

  setText(widget, footer, textColor, 12);

  widget.addSpacer(20);
  return widget;
}

async function getLargeWidget(station, image, currentMeasurement) {
  maxFontSize = 64;
  const widget = new ListWidget();

  setWidgetBackground(
    widget,
    backgroundGradientStartColor,
    backgroundGradientEndColor
  );

  widget.spacing = 20;

  var dateFormatter = new DateFormatter();
  dateFormatter.useMediumDateStyle();
  dateFormatter.useShortTimeStyle();

  dateTime = dateFormatter.string(new Date(currentMeasurement.timestamp));
  widget.addSpacer(12);
  setText(widget, dateTime, textColor, 20);

  const gaugeMeter = currentMeasurement.value / 100;

  var currentMeasurementText =
    gaugeMeter + " m " + getTrend(currentMeasurement.trend);

  setText(widget, currentMeasurementText, textColor, 64);

  let widgetImg = widget.addImage(image);
  widgetImg.cornerRadius = 8;
  widgetImg.applyFillingContentMode();

  setText(
    widget,
    station.water.longname + "  -  " + station.longname,
    textColor,
    16
  );

  widget.addSpacer(12);
  return widget;
}
//#endregion

async function getUuid(param) {
  var uuidParam = param || "";
  uuidParam = uuidParam.trim();
  if (uuidParam.length > 0) {
    console.log("uuidParam: " + uuidParam);
    if (!IsGuid(uuidParam)) {
      console.log(translation.noValidUuid(uuidParam));
      drawError(translation.noValidUuid(uuidParam));
      return false;
    }
    return uuidParam;
  }

  console.log("No param, determine location");

  location = await getCurrentLocation();

  return await getUuidFromLocation(location);
}

async function getUuidFromLocation(location) {
  const url =
    pegelonlineBaseUrl +
    "stations/?" +
    "latitude=" +
    location.latitude +
    "&longitude=" +
    location.longitude +
    "&radius=" +
    searchRadius;

  result = await getJSONDataRequest(url, 5);

  console.log(
    result.length +
      " stations were found within a radius of " +
      searchRadius +
      " km."
  );

  if (result.length == 0) {
    console.log("getUuidFromLocation: " + translation.noStationFound(searchRadius));
    drawError(translation.noStationFound(searchRadius));
    return false;
  }

  console.log("getUuidFromLocation: " + result[0].uuid);
  return result[0].uuid;
}

async function getCurrentMeasurement(uuid, station) {
  const url =
    pegelonlineBaseUrl +
    "stations/" +
    uuid +
    "/W.json?includeCurrentMeasurement=true";
  console.log("getCurrentMeasurement url: " + url);

  result = await getJSONDataRequest(url, 5);

  if (result != undefined) {
    if (result.hasOwnProperty("currentMeasurement")) {
      console.log(
        "currentMeasurement.value: " + result.currentMeasurement.value
      );
      return result.currentMeasurement;
    }
  }
  drawError(translation.noMeasurementData(station.shortname));
  return false;
}

async function getStation(uuid) {
  const url =
    "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/" +
    uuid +
    ".json";
  console.log("getStation url: " + url);

  result = await getJSONDataRequest(url, 5);

  if (result != undefined) {
    if (result.hasOwnProperty("shortname")) {
      console.log("getStation shortname: " + result.shortname);
      return result;
    }

    if (result.hasOwnProperty("message")) {
      console.log("message: " + result.message);
      drawError(result.message);
      return false;
    }
  }

  drawError(translation.noMeasurementData(uuid));
  return false;
}

function setWidgetBackground(widget, fromColor, toColor) {
  let gradient = new LinearGradient();
  gradient.locations = [0, 1];
  gradient.colors = [fromColor, toColor];
  widget.backgroundGradient = gradient;
}

function drawError(message) {
  const widget = new ListWidget();

  let text = widget.addText(message);
  text.font = Font.mediumSystemFont(16);
  text.minimumScaleFactor = 0.01;
  console.log("Error: " + message);
  Script.setWidget(widget);
  Script.complete();
}

function setDateText(widget, value, color, fontSize) {
  const optionsDate = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const dateText = widget.addText(
    value.toLocaleDateString("de-DE", optionsDate)
  );
  dateText.textColor = color;
  dateText.centerAlignText();
  dateText.font = Font.mediumMonospacedSystemFont(fontSize);
}

function setTimeText(widget, value, color, fontSize) {
  const timeText = widget.addText(value.toLocaleTimeString("de-DE"));
  timeText.textColor = color;
  timeText.centerAlignText();
  timeText.font = Font.mediumMonospacedSystemFont(fontSize);
}

function setText(widget, value, color, maxFontSize) {
  const valueText = widget.addText(value.toString());
  valueText.minimumScaleFactor = 0.01;
  valueText.textColor = color;
  valueText.centerAlignText();
  valueText.font = Font.mediumMonospacedSystemFont(maxFontSize); // max. fontSize
}

function setLocationWidgetUrl(widget, station) {
  switch (mapProvider) {
    case "apple":
      widget.url =
        "https://maps.apple.com/?ll=" +
        station.latitude +
        "," +
        station.longitude;
      break;
    case "google":
      widget.url =
        "https://www.google.com/maps/search/?api=1&query=" +
        station.latitude +
        "," +
        station.longitude;
      break;
    case "openstreetmap":
    default:
      openstreetZoom = 17;
      widget.url =
        "https://www.openstreetmap.org/?&mlat=" +
        station.latitude +
        "&mlon=" +
        station.longitude +
        "&zoom=" +
        openstreetZoom +
        "#map=" +
        openstreetZoom;
  }

  console.log(widget.url);
}

//#region different helper functions
function getStationImageUrl(pegelonlineBaseUrl, uuid) {
  let imageWidth = 700;
  let imageHeight = 300;
  let days = 30;
  let url =
    pegelonlineBaseUrl +
    "stations/" +
    uuid +
    "/W/measurements.png?start=" +
    "P" +
    days.toString() +
    "D&" +
    "width=" +
    imageWidth.toString() +
    "&" +
    "height=" +
    imageHeight.toString() +
    "&" +
    "enableSecondaryYAxis=true";
  return url;
}

async function getCurrentLocation() {
  var currentLocation = new StationLocation();
  try {
    location = await Location.current();
    currentLocation.latitude = location.latitude;
    currentLocation.longitude = location.longitude;
    console.log(
      "Current location: " +
        currentLocation.latitude +
        ", " +
        currentLocation.longitude
    );
  } catch {
    console.log("Can't get current location. Use default location.");
    currentLocation = defaultLocation;
  }
  return currentLocation;
}

function IsGuid(uuid) {
  var regex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
  var match = regex.exec(uuid);
  return match != null;
}

function getGaugeText(currentMeasurement) {
  const gaugeMeter = currentMeasurement.value / 100;

  return gaugeMeter.toString() + " m " + getTrend(currentMeasurement.trend);
}

function getTrend(trend) {
  trend = "";
  switch (currentMeasurement.trend) {
    case -1:
      trend = "\u2198";
      break;
    case 0:
      trend = "\u2192";
      break;
    case 1:
      trend = "\u2197";
      break;
  }
  return trend;
}
//#endregion

//#region internet request functions
async function CheckInternetConnection() {
  result = await getRequest("https://pegelonline.wsv.de");
  if (result == false) {
    drawError(translation.noInternetConnection);
    return false;
  }
  return true;
}

async function getImageRequest(url, timeoutErrorCounts) {
  success = false;
  errorCounter = 0;
  var image;
  do {
    try {
      let request = new Request(url);
      image = await request.loadImage();
      success = true;
    } catch (ex) {
      errorCounter++;
      console.log(ex.message);
    }
  } while (errorCounter < timeoutErrorCounts && !success);

  if (success == false) {
    return false;
  }
  return image;
}

async function getJSONDataRequest(url, timeoutErrorCounts) {
  success = false;
  errorCounter = 0;
  var result;
  do {
    try {
      let req = new Request(url);
      result = await req.loadJSON();
      success = true;
    } catch (ex) {
      errorCounter++;
      console.log(ex.message);
    }
  } while (errorCounter < timeoutErrorCounts && !success);
  return result;
}

async function getRequest(url) {
  var success = false;
  try {
    let req = new Request(url);
    result = await req.load();
    success = true;
  } catch (ex) {
    console.log(ex.message);
  }
  return success;
}
//#endregion

// End
