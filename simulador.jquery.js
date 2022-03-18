(function($){

  var tx_usb = 510.16; //Monetário

  var methods = {
    calculoBasicaAbaixo : function(salario, taxa, taxa_vol) {
      //Basica.
      var resultado = (currencyFormatted(salario) * taxa)/100;
      $('.resultado-basica-abaixo').html('').html(currencyFormatted(resultado, true));
      
      //Ordinária.
      var resultado_ord = ((currencyFormatted(salario) * taxa)/100) * 1.5;
      $('.resultado-ordinaria-abaixo').html('').html(currencyFormatted(resultado_ord, true));

      //Voluntária.
      var resultado_vol = (currencyFormatted(salario) * taxa_vol)/100;
      $('.resultado-voluntaria-abaixo').html('').html(currencyFormatted(resultado_vol, true));

      //Resultado com contrib Voluntária.
      if ($('.voluntaria[data-value*="abaixo"]').is(':checked')) {
        var resultado_total = resultado + resultado_ord + resultado_vol;
        $('.total-abaixo').text('Total (A+B+C)');
        $('.resultado-total-abaixo').html('').html(currencyFormatted(resultado_total, true));
      } else {
        var resultado_total = resultado + resultado_ord;
        $('.total-abaixo').text('Total (A+B)');
        $('.resultado-total-abaixo').html('').html(currencyFormatted(resultado_total, true));
      }
    },
    calculoBasicaAcima : function(salario, taxa, taxa_vol) {

      var resultado_acima = ((currencyFormatted(salario) - (tx_usb * 15)) * taxa)/100 + ((tx_usb * 15) *0.02);
      $('.resultado-basica-acima').html('').html(currencyFormatted(resultado_acima, true));
      
      //Ordinária.
      var resultado_ord_acima = resultado_acima * 1.5;
      $('.resultado-ordinaria-acima').html('').html(currencyFormatted(resultado_ord_acima, true));

      //Voluntária.
      var resultado_vol_acima = (currencyFormatted(salario) * taxa_vol)/100;
      $('.resultado-voluntaria-acima').html('').html(currencyFormatted(resultado_vol_acima, true));

      //Resultado com contrib Voluntária.
      if ($('.voluntaria[data-value*="acima"]').is(':checked')) {
        var resultado_total = resultado_acima + resultado_ord_acima + resultado_vol_acima;
        $('.total-acima').text('Total (A+B+C)');
        $('.resultado-total-acima').html('').html(currencyFormatted(resultado_total, true));
      } else {
        var resultado_total = resultado_acima + resultado_ord_acima;
        $('.total-acima').text('Total (A+B)');
        $('.resultado-total-acima').html('').html(currencyFormatted(resultado_total, true));
      }
    },
    limpar : function(tipo) {
       
      if (tipo == 'abaixo') {
        $('.campo-taxa-abaixo, .campo-taxa-vol-abaixo').val('00');
        $('.resultado-basica-abaixo, .resultado-ordinaria-abaixo, .resultado-voluntaria-abaixo, .resultado-total-abaixo').html('').html('0.000,00');
        $('.aviso-vol-abaixo').show();
      } else {
        $('.campo-taxa-acima, .campo-taxa-vol-acima').val('00');
        $('.resultado-basica-acima, .resultado-ordinaria-acima, .resultado-voluntaria-acima, .resultado-total-acima').html('').html('0.000,00');
        $('.aviso-vol-acima').show();
      }
    },
    exibeAviso : function(taxa) {
      if (taxa != 7) {
        $('.aviso-vol-acima').show();
        $('.voluntaria[data-value*="acima"]').prop('checked', false);
        $('.container-vol-acima').hide();
      } else {
        $('.aviso-vol-acima').hide();
      }
    },
    tipoCalculo : function(salario) { 
      
      // limpa formulários.
      $(this).simulador('limpar', 'abaixo');
      $(this).simulador('limpar', 'acimna');

      if (currencyFormatted(salario) > (tx_usb * 15)) {
        $('.acima').show();
        $('.abaixo').hide();
        $(this).simulador('calculoBasicaAcima', $('.campo-salario').val(), $('.span-contrib').text(), $('.campo-taxa-vol-acima').val());
        return;
      }

      $('.acima').hide();
      $('.abaixo').show();
      $(this).simulador('calculoBasicaAbaixo', $('.campo-salario').val(), 2, $('.campo-taxa-vol-abaixo').val());
      return;
    }
  };
  
  $.fn.simulador = function( method ) {
      
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Método ' +  method + ' não existe no Plugin jQuery.simulador');
    }    
    
  };

  function currencyFormatted(value, saida = false) {
    if (saida) {
      return value.formatMoney(2, ',', '.');
    }
    return value.replace(/\./g, '').replace(',', '.');
  }

  Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
      c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };

  $(document).ready(function(){
    // Mascaras de campo.
    $('.campo-salario').maskMoney({decimal: ",", thousands: "."});
    $(".campo-taxa-abaixo").inputmask("numeric", {min: 0.5, max: 2});
    $(".campo-taxa-acima").inputmask("numeric", {min: 2, max: 7});
    $(".campo-taxa-vol-abaixo, .campo-taxa-vol-acima").inputmask("numeric", {min: 2, max: 12});

    $('.campo-salario').keypress(function() {
      $('.acima, .abaixo, .container-vol-abaixo, .container-vol-acima').hide();
      $('.voluntaria[data-value*="abaixo"], .voluntaria[data-value*="acima"]').prop('checked', false);
    });

    $('.campo-taxa-abaixo, .voluntaria[data-value*="abaixo"]').keypress(function() {
      if ($(this).val() != 2) { $('.aviso-voluntaria-abaixo').show(); } else { $('.aviso-voluntaria-abaixo').hide(); }
    });

    $('.campo-taxa-acima, .voluntaria[data-value*="acima"]').keypress(function() {
      if ($(this).val() != 7) { $('.aviso-voluntaria-acima').show(); } else { $('.aviso-voluntaria-acima').hide(); }
    });
        
    $('.voluntaria').click(function(){
      if ($(this).data("value") == 'abaixo') { // Voluntária.
        $('.container-vol-abaixo').toggle();
        $(this).simulador('calculoBasicaAbaixo', $('.campo-salario').val(), 2, $('.span-contrib-vol-abaixo').text());

      } else { // Voluntária Acima 15USB.
        if ($('.span-contrib').text() != 7 && $('.voluntaria[data-value*="acima"]').is(':checked')) {
          $('.voluntaria[data-value*="acima"]').prop( "checked", false );
          $('.aviso-vol-acima').show();
          return;
        }

        // Mostra/esconde aviso de taxa de 7% para voluntária
        if ($('.span-contrib').text() != 7) {
          $('.aviso-vol-acima').show();
        } else { $('.aviso-vol-acima').hide(); }

        if (($('.campo-salario').val() != "0.000,00" && $('.campo-salario').val() != "") && $('.span-contrib').text() != '' && $('.span-contrib-vol').text() != '') {
          $('.container-vol-acima').toggle();
          $(this).simulador('calculoBasicaAcima', $('.campo-salario').val(), $('.span-contrib').text(), $('.span-contrib-vol').text());
        }
      }
    });

    // Checa o valor do salário para liberar simulador.
    $('.simular').click(function() {
      if ($('.campo-salario').val() != "0.000,00" && $('.campo-salario').val() != "") {
        $(this).simulador('tipoCalculo', $('.campo-salario').val());
      } else {
        $.alert({
          title: 'Atenção',
          content: 'Digite o valor do salário.',
          type: 'blue',
          typeAnimated: true,
          boxWidth: '25%',
          useBootstrap: false
        });
      }
    });

   $('.tt').slider({ 
      val: 20, 
      min: 20,
      max: 70,
      slide: function( event, ui ) {
        var rnd = Math.ceil(ui.value/10);
        $(this).simulador('exibeAviso', rnd);
        $('.span-contrib').text(rnd);
        $(this).simulador('calculoBasicaAcima', $('.campo-salario').val(), $('.span-contrib').text(), $('.campo-taxa-vol-acima').val());
      }
    });

    $('.tt-vol').slider({ 
      val: 20, 
      min: 20,
      max: 120,
      slide: function(event, ui) { 
        var rnd = Math.ceil(ui.value / 10);
        $('.span-contrib-vol').text(rnd);
        $(this).simulador('calculoBasicaAcima', $('.campo-salario').val(), $('.span-contrib').text(), $('.span-contrib-vol').text());
      }
    }); 

    $('.tt-vol-abaixo').slider({ 
      val: 20, 
      min: 20,
      max: 120,
      slide: function(event, ui) {
        var rnd = Math.ceil(ui.value / 10);
        $('.span-contrib-vol-abaixo').text(rnd);
        $(this).simulador('calculoBasicaAbaixo', $('.campo-salario').val(), 2, $('.span-contrib-vol-abaixo').text());
      }
    }); 

  });

})(jQuery);
