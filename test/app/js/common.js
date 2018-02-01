$(function() {

  $('.switcher__case').on('click', function() {
    $('.switcher__case').removeClass('active');
    $(this).addClass('active');
  });

  $('.hamburger').on('click', function() {
    $(this).toggleClass('is-active');
      $('.bottomline-nav__list').slideToggle(300, function() {
        if($(this).css('display')=='none') {
          $(this).removeAttr('style');
        }
      });
  });

  var location = [55.762140, 37.621570];

  var radioVal = parseInt($('.form-radiogroup__item.active').find('input[type="radio"]').val(), 10);
  var total = 18334;
  var totalFinal = total + radioVal;
  $('.status-total .value-set').html(totalFinal);

  $('.form-radiogroup__item').on('click', function() {
    $('.form-radiogroup__item').removeClass('active');
    $(this).addClass('active');
    if($('.map-switcher').hasClass('active')) {
      $('.map').css('display', 'block');
    } else {
      $('.map').css('display', 'none');
    }
    radioVal = parseInt($(this).find('input[type="radio"]').val(), 10);
    $('.status-total .value-set').html(totalFinal);
    totalFinal = total + radioVal;
  });

  ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: location,
            zoom: 15,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });
    myPlacemark = new ymaps.Placemark(location, {}, {
      iconImageHref: '../img/location.png', // картинка иконки
      iconImageSize: [64, 64], // размер иконки
      iconImageOffset: [-32, -64],
    });

    myMap.geoObjects
        .add(myPlacemark);

    $('#form-location').on('change', function() {
      var selectedOption = $('#form-location').prop('selectedIndex');
      var descrToShow =  $('.map-descr').get(selectedOption);
      $('.map-descr').removeClass('active');
      $(descrToShow).addClass('active');
      location = $('#form-location').val().split(',');
      myPlacemark.geometry.setCoordinates(location);
      myMap.setCenter(location);
    });

  });

  $(".form-phone").mask("99/999/999");

  $('.form input#form-name, .form input#form-lastname, .form input#form-mail, .form input#form-phone, .form input#form-name, .form input#form-city, .form textarea#form-comment').unbind().blur(function() {
    var id = $(this).attr('id');
    var val = $(this).val();
    switch(id)
    {
      case 'form-name':
      case 'form-lastname':
      case 'form-city':
      var rv_name = /^[a-zA-Zа-яА-Я]+$/;
      if(val.length > 2 && val != '' && rv_name.test(val)) {
        $(this).addClass('not_error')
          .css('border-color', 'green');
        $(this).next('.error-box').html('');
      } else {
        $(this).removeClass('not_error').addClass('error')
          .css('border-color', 'red');
        $(this).next('.error-box').html('Поле обязательно для заполнения<br>, длина должна составлять не менее 2 символов<br>, поле должно содержать только русские или латинские буквы');
      }
      break;
      case 'form-mail':
      var rv_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
      if(val != '' && rv_email.test(val)) {
        $(this).addClass('not_error')
          .css('border-color', 'green');
        $(this).next('.error-box').html('');
      } else {
        $(this).removeClass('not_error').addClass('error')
          .css('border-color', 'red');
        $(this).next('.error-box').html('Поле "Email" обязательно для заполнения<br>, поле должно содержать правильный email-адрес<br>');
      }
      case 'form-comment':
      if(val != '' && val.length < 5000) {
        $(this).addClass('not_error')
          .css('border-color', 'green');
        $(this).next('.error-box').text('');
      } else {
        $(this).removeClass('not_error').addClass('error')
          .css('border-color', 'red');
        $(this).next('.error-box').html('Поле обязательно для заполнения');
      }
    } //end switch
  }); //end blur


  $('.form').submit(function(e){
    e.preventDefault();
    console.log($('.not_error').length);
    if($('.not_error').length == 5) {
      $.ajax({
        url: 'send.php',
        type: 'post',
        data: $(this).serialize(),

        beforeSend: function(xhr, textStatus){ 
          $('form#feedback-form :input').attr('disabled','disabled');
        },

        success: function(response){
          $('form#feedback-form :input').removeAttr('disabled');
          $('form#feedback-form :text, textarea').val('').removeClass().next('.error-box').text('');
          alert(response);
        }
      });
    } else {
      alert('Проверьте правильность заполнения полей');
      return false
    }
  });

  $("#form-comment").on("keypress",function() {
    var val = $(this).val();
    var open = val.indexOf('<');
    var close = val.indexOf('>');
    if(open!==-1 && close!==-1) {
      $(this).val(val.replace(val.slice(open,close+1),""));
    }
  });



});
