ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [60.000000, 30.299382],
            zoom: 12,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        }),

        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<svg class="svg-icon svg-icon-placemark map__placemark">' +
            '    <use xlink:href="#placemark"></use>' +
            '</svg>'
        ),

        myPlacemarkWithContent = new ymaps.Placemark([60.000000, 30.299382], {
            hintContent: 'Собственный значок метки с контентом',
            balloonContent: 'А эта — новогодняя',
            iconContent: '12'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: MyIconContentLayout,
            iconImageSize: [32, 32],
            iconImageOffset: [-5, -38],
        });

    myMap.geoObjects
        .add(myPlacemarkWithContent);
});