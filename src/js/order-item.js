(function($) {
  $(document).ready(function() {
    var orderItemExpander = $('.js-order-item-expander');

    orderItemExpander.on('click', function() {
      $(this).parents('.js-order-item').toggleClass('is-expanded');
    });
  });
})(jQuery);