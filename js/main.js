String.prototype.rightChars = function(n){
  if (n <= 0) {
    return "";
  }
  else if (n > this.length) {
    return this;
  }
  else {
    return this.substring(this.length, this.length - n);
  }
};

(function($) {
	// background images switching
  var bgImgs = [
		//"/ask/images/carousel/1_festival.jpg",
		"/ask/images/carousel/2_music.jpg",
		"/ask/images/carousel/3_cinema.jpg",
		"/ask/images/carousel/4_burger.jpg",
		"/ask/images/carousel/5_holiday.jpg",
		"/ask/images/carousel/6_cocktails.jpg",
	];
  var idx = 0;
  var idxWord = 0;
	function changeImage(){
    if($(window).width() < 900){
		$('#section1').css("background-image", "url("+bgImgs[idx]+")");  
		idx = idx == bgImgs.length-1 ? 0 : idx+1;
    }
    else {
      $('#section1').css("background-image", null);
        $('#section1').css("background-color", "#ffffff");
    }
	};

	function preload(arrayOfImages) {
		$(arrayOfImages).each(function () {
			$('<img />').attr('src',this).appendTo('body').css('display','none');
		});
	}

	preload(bgImgs);

  var
    options = {
      highlightSpeed    : 20,
      typeSpeed         : 100,
      clearDelay        : 800,
      typeDelay         : 50,
      clearOnHighlight  : true,
      typerDataAttr     : 'data-typer-targets',
      typerInterval     : 4000
    },
    highlight,
    clearText,
    backspace,
    type,
    spanWithColor,
    clearDelay,
    typeDelay,
    clearData,
    isNumber,
    typeWithAttribute,
    getHighlightInterval,
    getTypeInterval,
    typerInterval;

  spanWithColor = function(color, backgroundColor) {
    if (color === 'rgba(0, 0, 0, 0)') {
      if($(window).width() < 900)
      color = 'rgb(0, 0, 0)';
      else{
        color = 'rgb(0, 0, 0)';
        backgroundColor = 'rgb(106, 226, 163)';
      }
      
    }

    return $('<span></span>')
      .css('color', color)
      .css('background-color', backgroundColor);
  };

  isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  clearData = function ($e) {
    $e.removeData([
      'typePosition',
      'highlightPosition',
      'leftStop',
      'rightStop',
      'primaryColor',
      'backgroundColor',
      'text',
      'typing'
    ]);
  };

  type = function ($e) {
    var
      // position = $e.data('typePosition'),
      text = $e.data('text'),
      oldLeft = $e.data('oldLeft'),
      oldRight = $e.data('oldRight');

    // if (!isNumber(position)) {
      // position = $e.data('leftStop');
    // }

    if (!text || text.length === 0) {
      clearData($e);
      return;
    }


    $e.text(
      oldLeft +
      text.charAt(0) +
      oldRight
    ).data({
      oldLeft: oldLeft + text.charAt(0),
      text: text.substring(1)
    });

    // $e.text($e.text() + text.substring(position, position + 1));

    // $e.data('typePosition', position + 1);

    setTimeout(function () {
      type($e);
    }, getTypeInterval());
  };

  clearText = function ($e) {
    $e.find('span').remove();

  setTimeout(function () {
      type($e);
    }, typeDelay());


  };
 
  highlight = function ($e) {
    var
      position = $e.data('highlightPosition'),
      leftText,
      highlightedText,
      rightText;

    if (!isNumber(position)) {
      position = $e.data('rightStop');
    }

    if (position <= $e.data('leftStop')) {
      setTimeout(function () {
		  changeImage();
        clearText($e);
      }, clearDelay());
      return;
    }

    leftText = $e.text().substring(0, position - 1);
    highlightedText = $e.text().substring(position - 1, $e.data('rightStop') + 1);
    rightText = $e.text().substring($e.data('rightStop') + 1);

    $e.html(leftText)
      .append(
        spanWithColor(
            $e.data('backgroundColor'),
            $e.data('primaryColor')
          )
          .append(highlightedText)
      )
      .append(rightText);

    $e.data('highlightPosition', position - 1);

    setTimeout(function () {
      return highlight($e);
    }, getHighlightInterval());
  };

  typeWithAttribute = function ($e) {
    var targets;

    if ($e.data('typing')) {
      return;
    }

    try {
      targets = JSON.parse($e.attr($.typer.options.typerDataAttr)).targets;
    } catch (e) {}

    if (typeof targets === "undefined") {
      targets = $.map($e.attr($.typer.options.typerDataAttr).split(','), function (e) {
        return $.trim(e);
      });
    }

    $e.typeTo(targets[idxWord]);
    idxWord = idxWord == targets.length-1 ? 0 : idxWord+1;
  };

  // Expose our options to the world.
  $.typer = (function () {
    return { options: options };
  })();

  $.extend($.typer, {
    options: options
  });

  //-- Methods to attach to jQuery sets

  $.fn.typer = function() {
    var $elements = $(this);

    return $elements.each(function () {
      var $e = $(this);

      if (typeof $e.attr($.typer.options.typerDataAttr) === "undefined") {
        return;
      }

      typeWithAttribute($e);
      setInterval(function () {
        typeWithAttribute($e);
      }, typerInterval());
    });
  };

  $.fn.typeTo = function (newString) {
    var
      $e = $(this),
      currentText = $e.text(),
      i = 0,
      j = 0;

    if (currentText === newString) {
      console.log("Our strings our equal, nothing to type");
      return $e;
    }

    if (currentText !== $e.html()) {
      console.error("Typer does not work on elements with child elements.");
      return $e;
    }

    $e.data('typing', true);

    while (currentText.charAt(i) === newString.charAt(i)) {
      i++;
    }

    while (currentText.rightChars(j) === newString.rightChars(j)) {
      j++;
    }

    newString = newString.substring(i, newString.length - j + 1);

    $e.data({
      oldLeft: currentText.substring(0, i),
      oldRight: currentText.rightChars(j - 1),
      leftStop: i,
      rightStop: currentText.length - j,
      primaryColor: $e.css('color'),
      backgroundColor: $e.css('background-color'),
      text: newString
    });

    highlight($e);

    return $e;
  };

  //-- Helper methods. These can one day be customized further to include things like ranges of delays.

  getHighlightInterval = function () {
    return $.typer.options.highlightSpeed;
  };

  getTypeInterval = function () {
    return $.typer.options.typeSpeed;
  },

  clearDelay = function () {
    return $.typer.options.clearDelay;
  },

  typeDelay = function () {
    return $.typer.options.typeDelay;
  };

  typerInterval = function () {
    return $.typer.options.typerInterval;
  };
})(jQuery);

		$(document).ready(function() {
			var animed1 = false;
			var	 animed2 = false;
			var countAnim = 0;
			$('#fullpage').fullpage({
				'css3': true,
				'sectionsColor': ['#fff', '#fff', '#fff', '#fff'],
				'navigation': true,
				'navigationPosition': 'right',
				'menu': '#header2',
				'normalScrollElements' : ".country-list",
				"normalScrollElementTouchThreshold": 15,
				'afterLoad': function(anchorLink, index){
					if(index == 1){
            
              	$('#iphone3, #iphone2, #iphone4').addClass('active');
                $('#logo').removeClass('logo-active');
                $("#logo-arrow").fadeOut();
                $("#logo-getapp").fadeOut();

                if($(window).width() > 800){
                  $("#lang-switch").fadeIn();
                }
					
						
					}
					if(index == 2){
						$('#logo').addClass('logo-active');
						$("#logo-arrow").fadeIn();
						$("#logo-getapp").fadeIn();
					}
           
				},
        afterRender: function(){
            $(function () { $('[data-typer-targets]').typer(); });
        },
				'onLeave': function(index, nextIndex, direction){
          if(nextIndex == 1){
             $('.typer-fix').css('position','relative');
          }
					if(nextIndex != 1 && $(window).width() > 800){
						$("#lang-switch").fadeOut();
                

					}

					if($(window).width() < 850){
            $("#lang-switch").fadeOut();
            $("#sendLinkBtn").fadeOut();
						return false;
					}
          else {
            $("#sendLinkBtn").fadeIn();
          }

					if(nextIndex == 7){
						$("#logo-getapp").fadeOut();
					}
					if(index == 7){
						$("#logo-getapp").fadeIn();
					}

					if(index != 2){
						countAnim = 0;
						$( "#Section1" ).css({
							opacity: 1,
							height: "100%"
						});
						$( "#Section2" ).css({
							opacity: 1,
							height: "100%"
						});
						$( "#Section3" ).css({
							opacity: 1,
							height: "100%"
						});
            $( "#Section4" ).css({
							opacity: 1,
							height: "100%"
						});
						animed1 = false;
						 animed2 = false;
					}

					if(index == 2 && direction == 'down'){

						$( "#Section1" ).velocity({
								opacity: 0,
								height: "0%"
							}, 500, function() {
							});
							$( "#Section2" ).velocity({
								opacity: 1,
								height: "100%"
							}, 500, function() {
							});
						}
					else if(index == 3 && direction == 'down'){

							$( "#Section3" ).velocity({
								opacity: 1,
								height: "100%"
							}, 500, function() {
							});
							$( "#Section2" ).velocity({
								opacity: 0,
								height: "0%"
							}, 500, function() {
							});
							animed2 = true;
						}
				
					$('#staticImg').toggleClass('active', (index == 2 && direction == 'down' ) || (index == 4 && direction == 'up'));
					$('#staticImg').toggleClass('moveDown', nextIndex == 4);
					$('#staticImg').toggleClass('moveUp', index == 4 && direction == 'up');
				}
			});
            
        
      
      	
		});
	