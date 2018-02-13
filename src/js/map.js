ymaps.ready(function () {
    let myMap = new ymaps.Map('map-widget', {
            center: [59.934724, 30.334743],
            zoom: 11,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });

    let iconLayout = ymaps.templateLayoutFactory.createClass(
            '<svg class="svg-icon svg-icon-placemark map__placemark map__placemark_{{ properties.color }}">' +
            '    <use xlink:href="#placemark"></use>' +
            '</svg>'
        );
    ymaps.layout.storage.add('my#newPlacemark', iconLayout);

    let placemark1 = new ymaps.Placemark([59.971131, 30.340544], {
            hintContent: 'Собственный значок метки с контентом',
            color: 'red'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'my#newPlacemark'
        }),

        placemark2 = new ymaps.Placemark([60.001837, 30.385176], {
            hintContent: 'Собственный значок метки с контентом',
            color: 'green'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'my#newPlacemark'
        }),
        placemark3 = new ymaps.Placemark([60.000977, 30.294883], {
            hintContent: 'Собственный значок метки с контентом',
            color: 'red'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'my#newPlacemark'
        }),
        placemark4 = new ymaps.Placemark([59.906532, 30.300003], {
            hintContent: 'Собственный значок метки с контентом',
            color: 'red'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'my#newPlacemark'
        });
    myMap.geoObjects
        .add(placemark1)
        .add(placemark2)
        .add(placemark3)
        .add(placemark4);
});

$(document).ready(function () {
    let regionsExpander = $('.js-expander-open');

    regionsExpander.on('click', function(){
        $(this).parents('.js-expander').toggleClass('is-expanded');
    });


});

