ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [60.000000, 30.299382],
            zoom: 12,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });

    var iconLayout = ymaps.templateLayoutFactory.createClass(
            '<svg class="svg-icon svg-icon-placemark map__placemark map__placemark--{{ properties.color }}">' +
            '    <use xlink:href="#placemark"></use>' +
            '</svg>'
        );
    ymaps.layout.storage.add('my#newPlacemark', iconLayout);

    var placemark1 = new ymaps.Placemark([60.000000, 30.299382], {
            hintContent: 'Собственный значок метки с контентом',
            color: 'red'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'my#newPlacemark',
        }),

        placemark2 = new ymaps.Placemark([60.010000, 30.299382], {
            hintContent: 'Собственный значок метки с контентом',
            color: 'green'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'my#newPlacemark',
        });

    myMap.geoObjects
        .add(placemark1)
        .add(placemark2);
});

$(document).ready(function () {
    $('.js-regions-open').on('click', function(){
        var regionsPopup = $(this).closest('.js-regions');
        regionsPopup.toggleClass('regions-map--open');
        $(regionsPopup).children('.js-title').toggleClass('regions-map__title--hide');
    });
});

