ymaps.ready(init);

let _maMap;
const currentState = {
    center: [45.035470, 38.975313], // Координаты Краснодара
    zoom: 14,
    placemarks: []
};
let typePoint = "";
let adr = null;

console.log("Координаты Краснодара: " + currentState.center);

function init() {
    if (_maMap) {
        _maMap.destroy();
    }

    _maMap = new ymaps.Map('map', {
        center: currentState.center,
        zoom: currentState.zoom,
        controls: []
    });

    console.log("Инициализация карты. Центр:", _maMap.getCenter());
}

function traffic() {
    ensureMapInitialized();
    const trafficControl = new ymaps.control.TrafficControl({
        state: {
            providerKey: 'traffic#actual',
            trafficShown: true
        }
    });

    _maMap.controls.add(trafficControl);
    trafficControl.getProvider('traffic#actual').state.set('infoLayerShown', true);

    trafficControl.getProvider('traffic#actual').events.add('update', () => {
        console.log("Данные о пробках обновлены");
    });
}

function route() {
    ensureMapInitialized(true);

    const routeControl = _maMap.controls.get('routePanelControl');
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        ymaps.geocode([latitude, longitude]).then(res => {
            const locationText = res.geoObjects.get(0).properties.get('text');
            routeControl.routePanel.state.set({
                type: 'masstransit',
                from: locationText,
                to: "Невский проспект 146"
            });
        });
    });
}

function point() {
    ensureMapInitialized();
    _maMap.events.add('click', e => {
        const coords = e.get('coords');
        addPlacemark(coords);
    });
}

function addPlacemark(coords) {
    findByCoords(coords).then(() => {
        const type = document.getElementById("type").value;
        typePoint = type === "авария" ? "islands#redStretchyIcon" : "islands#yellowStretchyIcon";

        const placemark = new ymaps.Placemark(coords, {
            balloonContent: adr,
            iconContent: type
        }, { preset: typePoint });

        _maMap.geoObjects.add(placemark);
        currentState.placemarks.push({ coordinates: coords, type: typePoint, address: adr });
    });
}

function findByCoords(coords) {
    return ymaps.geocode(coords).then(res => {
        adr = res.geoObjects.get(0).getAddressLine();
        console.log("Адрес:", adr);
    });
}

function ensureMapInitialized(useRoutePanel = false) {
    if (_maMap) {
        _maMap.destroy();
    }

    const controls = useRoutePanel ? ['routePanelControl'] : [];
    _maMap = new ymaps.Map('map', {
        center: currentState.center,
        zoom: currentState.zoom,
        controls
    });

    console.log("Карта обновлена. Центр:", _maMap.getCenter(), "Зум:", _maMap.getZoom());
    saveMapState();
}

function saveMapState() {
    if (_maMap) {
        currentState.center = _maMap.getCenter();
        currentState.zoom = _maMap.getZoom();
        console.log("Сохранено состояние карты: центр", currentState.center, "зум", currentState.zoom);
    }
}
