// Zentrum der Karte je nach Ausgabegerät festlegen
function setInitialMapCenter() {

    var viewportWidth = window.innerWidth;
    var center;
    if (viewportWidth < [600]) {
        center = [49.1572359, 9.2995620];
    } else {
        center = [49.2476381, 9.3703079];
    }
    return center;
};

//Standardzoom der Karte je nach Ausgabegerät festlegen
function setInitialZoom() {
    var viewportWidth = window.innerWidth;
    var initZoom;
    if (viewportWidth < [600]) {
        initZoom = 10;
    } else {
        initZoom = 11;
    }
    return initZoom;
};

// Die eigentliche Karte initialisieren
function main() {

    // Optionen der Karten festlegen
    var bounds = [
        [48.6111, 7.9321],
        [49.6958, 10.6952]
    ];

    var mapOptions = {
        center: setInitialMapCenter(),
        zoom: 10,
        minZoom: 9,
        maxZoom: 13,
        zoomControl: false,
        attributionControl: true,
        legends: false,
        layer_selector: false,
        maxBounds: bounds,
    };

    // Karte und Basemap initialisieren
    var map = L.map('map', mapOptions);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        id: 'mapbox.light',
        accessToken: "pk.eyJ1IjoiZGFoaWx6ZW4zMiIsImEiOiJjaXZ5OWwxam8wMDFqMnpxOXc4Y3l5dXd1In0.S9lbvSNNnpsOs4BXCzZoVg",
        attribution: 'Code: <a href="https://www.twitter.com/dahilzen">David Hilzendegen</a> | Daten: <a href="https://vm.baden-wuerttemberg.de/">Verkehrsministerium BW</a>'
    }).addTo(map);

    function style(feature) {
        return {
            opacity: 1,
            color: 'black',
        };
    }

    // Die GeoJson mit den Autobahnen auf die Karte werfen
    L.geoJson(autobahn, {
        style: style
    }).addTo(map);

    // Rastplätze der Autobahnen auslesen und in unterschiedliche Variablen speichern
    var a6 = [];
    var a81 = [];

    function a6marker() {
        var j = 0;
        for (var i = 0; i < rast.features.length; i++) {
            // aktuelles json-feature in variable speichern (damit leichter abrufbar)
            var currentFeature = rast.features[i];

            if (currentFeature.properties.autobahn === "A6") {
                a6[j] = currentFeature;
                j++;
            }
        };
    };

    function a81marker() {
        var j = 0;
        for (var i = 0; i < rast.features.length; i++) {
            // aktuelles json-feature in variable speichern (damit leichter abrufbar)
            var currentFeature = rast.features[i];

            if (currentFeature.properties.autobahn === "A81") {
                a81[j] = currentFeature;
                j++;
            }
        };
    };
    a6marker();
    a81marker();

    // Icons erstellen
    var blueIcon = new L.Icon({
        iconUrl: 'css/images/marker-icon-2x-blue.png',
        shadowUrl: 'css/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var redIcon = new L.Icon({
        iconUrl: 'css/images/marker-icon-2x-red.png',
        shadowUrl: 'css/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Layer erstellen und anweisen, das Popup in den Div-Container info zu schreiben. 
    // Außerdem soll bei einem Mausklick der Marker ausgetauscht werden. 
    // Bei Klick auf einen anderen Marker soll wieder der alte Marker gezeigt werden
    var clickedMarker;

    function onEachFeature(feature, layer) {
        layer.on('click', function(e) {
            document.getElementById("info").innerHTML = "<b>" + feature.properties.Name + "</b><br><span style='font-weight: 600; font-size: 200%'> " + feature.properties.plaetze + "</span>" + "<br>Parkplätze für LKW";
            if (clickedMarker) {
                clickedMarker.setIcon(blueIcon);
            }
            e.target.setIcon(redIcon);
            clickedMarker = e.target;
        });
    }

    var marker1 = L.geoJson(a6, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                riseOnHover: true,
                icon: blueIcon,
            });
        },
        onEachFeature: onEachFeature,
    }).addTo(map);
    var marker2 = L.geoJson(a81, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                riseOnHover: true,
                icon: blueIcon,
            });
        },
        onEachFeature: onEachFeature,
    }).addTo(map);

    // Tooltip bei Mouse-Over erstellen
    marker1.bindTooltip(function(layer) {
        return layer.feature.properties.Name;
    }, {
        sticky: true,
        direction: 'auto',
    });

    marker2.bindTooltip(function(layer) {
        return layer.feature.properties.Name;
    }, {
        sticky: true,
        direction: 'auto',
    });

    // Events für die Buttons festlegen, Zoom in die unterschiedlichen Himmelsrichtungen
    var zoomToWest = function() {
        map.setView([49.2020090, 9.0870667], setInitialZoom());
    }

    var zoomToCentral = function() {
        map.setView(setInitialMapCenter(), 10);
    }

    var zoomToSouth = function() {
        map.setView([49.0685803, 9.2789841], setInitialZoom());
    }

    var zoomToEast = function() {
        map.setView([49.2156909, 9.5836830], setInitialZoom());
    }

    var zoomToNorth = function() {
        map.setView([49.3245346, 9.4139528], setInitialZoom());
    }

    document.querySelector(".west").addEventListener('click', zoomToWest);
    document.querySelector(".zentral").addEventListener('click', zoomToCentral);
    document.querySelector(".sued").addEventListener('click', zoomToSouth);
    document.querySelector(".ost").addEventListener('click', zoomToEast);
    document.querySelector(".nord").addEventListener('click', zoomToNorth);

}

window.onload = main;