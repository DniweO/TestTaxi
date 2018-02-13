(function($) {
  $(document).ready(function() {
    let orderItemExpander = $('.js-order-item-expander');

    orderItemExpander.on('click', function() {
      $(this).parents('.js-order-item').toggleClass('is-expanded');
    });
  });
})(jQuery);