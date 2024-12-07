ymaps.ready(init); // Инициализация карты после загрузки API Яндекс.Карт

let _maMap; // Переменная для карты
let activeTab = null; // Текущая активная функция (вкладка)
let adr = null; // Адрес для меток
let trafficControl = null; // Контроллер для трафика
let routeControl = null; // Контроллер для маршрутов

const currentState = {
    center: [45.035470, 38.975313], // Координаты Краснодара
    zoom: 14,
    placemarks: [] // Список меток
};

// Загрузка JSON с метками
// Загрузка JSON с метками
function loadMarkers() {
    fetch('markers.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(marker => {
                const placemark = new ymaps.Placemark(marker.location, {
                    balloonContent: marker.text, // Здесь будет вставлен HTML-код видео
                    iconContent: marker.name     // Название метки
                }, { preset: 'islands#blueStretchyIcon' });

                _maMap.geoObjects.add(placemark);
                currentState.placemarks.push({
                    coordinates: marker.location,
                    address: marker.text, 
                    type: 'islands#blueStretchyIcon'
                });
            });
            console.log("Метки загружены из JSON:", data);
        })
        .catch(error => console.error("Ошибка при загрузке меток:", error));
}


// Инициализация карты
function init() {
    if (_maMap) {
        _maMap.destroy(); // Уничтожаем карту, если она уже существует
    }

    _maMap = new ymaps.Map('map', {
        center: currentState.center,
        zoom: currentState.zoom,
        controls: [] // Убираем стандартные элементы управления
    });

    console.log("Карта инициализирована. Центр:", _maMap.getCenter());

    // Загружаем метки из JSON
    loadMarkers();

    activeTab = null; // Сбрасываем активную вкладку
    trafficControl = null; // Сбрасываем контроллер трафика
    routeControl = null; // Сбрасываем контроллер маршрутов
}

// Включение/выключение трафика
function traffic() {
    if (activeTab === 'traffic') {
        if (trafficControl) {
            _maMap.controls.remove(trafficControl); // Убираем контроллер трафика
            trafficControl = null;
            console.log("Трафик выключен");
        }
        activeTab = null;
    } else {
        deactivateAllTabs();
        trafficControl = new ymaps.control.TrafficControl({
            state: { providerKey: 'traffic#actual', trafficShown: true }
        });
        _maMap.controls.add(trafficControl); // Добавляем контроллер трафика на карту
        console.log("Трафик включён");
        activeTab = 'traffic';
    }
}

// Включение маршрута от текущей позиции
function route() {
    if (activeTab === 'route') {
        _maMap.controls.remove(routeControl);
        console.log("Маршрут выключен");
        activeTab = null;
    } else {
        deactivateAllTabs();
        routeControl = new ymaps.control.RoutePanel({
            state: {
                type: 'auto', // Тип маршрута: на автомобиле
                fromEnabled: true,
                toEnabled: true
            }
        });
        _maMap.controls.add(routeControl); // Добавляем контроллер маршрута на карту

        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            ymaps.geocode([latitude, longitude]).then(res => {
                const locationText = res.geoObjects.get(0).properties.get('text');
                routeControl.routePanel.state.set({
                    from: locationText,
                    to: "Невский проспект 146"
                });
                console.log("Маршрут построен от:", locationText);
            });
        });
        console.log("Маршрут включён");
        activeTab = 'route';
    }
}

// Добавление меток по клику на карту
function point() {
    if (activeTab === 'point') {
        _maMap.events.remove('click');
        console.log("Режим добавления меток выключен");
        activeTab = null;
    } else {
        deactivateAllTabs();
        _maMap.events.add('click', e => {
            const coords = e.get('coords');
            addPlacemark(coords);
        });
        console.log("Режим добавления меток включён. Кликните на карту, чтобы добавить метку.");
        activeTab = 'point';
    }
}

// Сохранение текущего состояния карты
function saveMapState() {
    if (_maMap) {
        currentState.center = _maMap.getCenter();
        currentState.zoom = _maMap.getZoom();
        console.log("Сохранено состояние карты:", currentState);
    }
}

// Получение текущей геопозиции
function getCurrentPos() {
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        console.log("Текущая позиция:", [latitude, longitude]);
        _maMap.setCenter([latitude, longitude], 14); // Устанавливаем центр карты
    });
}

// Отключение всех вкладок
function deactivateAllTabs() {
    if (activeTab === 'traffic') {
        if (trafficControl) {
            _maMap.controls.remove(trafficControl);
            trafficControl = null;
            console.log("Трафик отключён");
        }
    } else if (activeTab === 'route') {
        if (routeControl) {
            _maMap.controls.remove(routeControl);
            routeControl = null;
            console.log("Маршрут отключён");
        }
    } else if (activeTab === 'point') {
        _maMap.events.remove('click');
        console.log("Режим добавления меток отключён");
    }
    activeTab = null; // Сбрасываем активную вкладку
}

// Добавление метки на карту
function addPlacemark(coords) {
    findByCoords(coords).then(() => {
        const type = document.getElementById("type").value; // Получаем выбранный тип метки
        const preset = type === "авария" ? "islands#redStretchyIcon" : "islands#yellowStretchyIcon";

        const placemark = new ymaps.Placemark(coords, {
            balloonContent: adr,
            iconContent: type
        }, { preset });

        _maMap.geoObjects.add(placemark);
        currentState.placemarks.push({ coordinates: coords, type: preset, address: adr });
        console.log("Добавлена метка:", coords, "Тип:", type, "Адрес:", adr);
    });
}

// Получение адреса по координатам
function findByCoords(coords) {
    return ymaps.geocode(coords).then(res => {
        adr = res.geoObjects.get(0).getAddressLine();
        console.log("Адрес:", adr);
    });
}