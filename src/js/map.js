ymaps.ready(function () {
    let myMap = new ymaps.Map('map-widget', {
            center: [60.000000, 30.299382],
            zoom: 12,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });

    let iconLayout = ymaps.templateLayoutFactory.createClass(
            '<svg class="svg-icon svg-icon-placemark map__placemark map__placemark--{{ properties.color }}">' +
            '    <use xlink:href="#placemark"></use>' +
            '</svg>'
        );
    ymaps.layout.storage.add('my#newPlacemark', iconLayout);

    let placemark1 = new ymaps.Placemark([60.000000, 30.299382], {
            hintContent: 'Собственный значок метки с контентом',
            color: 'red'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'my#newPlacemark'
        }),

        placemark2 = new ymaps.Placemark([60.010000, 30.299382], {
            hintContent: 'Собственный значок метки с контентом',
            color: 'green'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'my#newPlacemark'
        });

    myMap.geoObjects
        .add(placemark1)
        .add(placemark2);
});

$(document).ready(function () {
    let regionsExpander = $('.js-expander-open');

    regionsExpander.on('click', function(){
        $(this).parents('.js-expander').toggleClass('is-expanded');
    });


});

