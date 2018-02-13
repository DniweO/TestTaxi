(function($) {
  $(document).ready(function() {
    var tabsText = ['День', 'Неделя', 'Месяц']

    var swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboardControl: false,
      //loop: true,
      pagination: {
        el:           '.swiper-pagination',
        clickable:    true,
        renderBullet: function(index, className) {
          return '<span class="' + className + '">' + tabsText[index] + '</span>';
        }
      }
    });

  });
})(jQuery);