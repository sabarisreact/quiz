;(function( $ ) {

	function debounce( callback, time ) {
		var timeout;

		return function() {
			var context = this;
			var args = arguments;
			if ( timeout ) {
				clearTimeout( timeout );
			}
			timeout = setTimeout( function() {
				timeout = null;
				callback.apply( context, args );
			}, time );
		}
	}

	function handleFirstTab(e) {
		var key = e.key || e.keyCode;
		if ( key === 'Tab' || key === '9' ) {
			$( 'body' ).removeClass( 'no-outline' );

			window.removeEventListener('keydown', handleFirstTab);
			window.addEventListener('mousedown', handleMouseDownOnce);
		}
	}

	function handleMouseDownOnce() {
		$( 'body' ).addClass( 'no-outline' );

		window.removeEventListener('mousedown', handleMouseDownOnce);
		window.addEventListener('keydown', handleFirstTab);
	}

	window.addEventListener('keydown', handleFirstTab);
	function resizeVideo() {
		var $holder = $( '.videoHolder' );
		$holder.each( function() {
			var $that = $( this );
			var ratio = $that.data( 'ratio' ) ? $that.data( 'ratio' ) : '16:9',
				width = parseFloat( ratio.split( ':' )[0] ),
				height = parseFloat( ratio.split( ':' )[1] );
			$that.find( '.video' ).each( function() {
				if ( $that.width() / width > $that.height() / height ) {
					$( this ).css( { 'width': '100%', 'height': 'auto' } );
				} else {
					$( this ).css( { 'width': $that.height() * width / height, 'height': '100%' } );
				}
			} );
		} );
	}

	function AjaxNew(data, $buttonWrapper, $insightsList, isMore = false) {
		$.ajax( {
			url: ajax.url,
			type: 'POST',
			data: data,
			success: function( resp ) {
				if (resp.html) {
					if (isMore) {
						$insightsList.append(resp.html);
						$('#loadmore').attr('data-paged', data.offset);
					}
					else {
						$insightsList.html(resp.html);
						$('#loadmore').attr('data-paged', 1);
					}
				}
				if ( resp.last_page ) {
					$buttonWrapper.hide();
				}
				else {
					$buttonWrapper.show();
				}
			},
			error: function( err ) {
				console.log( err.textStatus );
			}
		} );
	}
	$( document ).on( 'click', '#loadmore', function( e ) {
		var $insightsList = $( '.insights__list .grid-x' );
		var $this = $( this ), $buttonWrapper = $this.closest( '.posts-list__more' );
		var data = {
			'action': 'load_more_posts',
			'nonce': ajax.nonce,
			'terms': $('.insights-is-active').data('term'),
			'offset': parseInt( $this.attr('data-paged') ) + 1,
		};

		AjaxNew(data, $buttonWrapper, $insightsList, true);
	} );

	$( document ).on( 'click', '.insights-cat__links', function( e ) {
		var $buttonWrapper = $( '.posts-list__more' );
		var $this = $( this ), $insightsList = $( '.insights__list .grid-x');
		var data = {
			'action': 'load_more_posts',
			'nonce': ajax.nonce,
			'terms': $this.data('term'),
		};
		$('.insights-cat__links').removeClass('insights-is-active');
		$this.addClass('insights-is-active');

		AjaxNew(data, $buttonWrapper, $insightsList);
	} );

	function initJUIselect(elem) {
		var $field = $( elem );
		var $gfield = $field.closest( ".gfield" );
		var args = {
			change: function( e, ui ) {
				$( this ).trigger( "change" );
			}
		}
		if ( $gfield.length ) {
			args.appendTo = $gfield;
		}
		$field.selectmenu( args ).on('change',function() {
			$(this).selectmenu('refresh');
		});		
		$( "#jquerynotselect" ).selectmenu( "destroy" );
	}

	function resizeSelect( elem ) {
		$( "select" ).each( function() {
			if ( typeof $( this ).selectmenu( "instance" ) !== "undefined" ) {
				$( this ).selectmenu( "refresh" );
			}
		} );
	}

	var scrollOut;
	$( document ).ready(function() {
        AOS.init({once: true});
		var lazyLoadInstance = new LazyLoad({
			elements_selector: 'img[data-lazy-src],.pre-lazyload',
			data_src: "lazy-src",
			data_srcset: "lazy-srcset",
			data_sizes: "lazy-sizes",
			skip_invisible: false,
			class_loading: "lazyloading",
			class_loaded: "lazyloaded",
		});
		window.addEventListener('LazyLoad::Initialized', function (e) {
			if (window.MutationObserver) {
				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						mutation.addedNodes.forEach(function(node) {
							if (typeof node.getElementsByTagName !== 'function') {
								return;
							}
							imgs = node.getElementsByTagName('img');
							if ( 0 === imgs.length ) {
								return;
							}
							lazyLoadInstance.update();
						} );
					} );
				} );
				var b      = document.getElementsByTagName("body")[0];
				var config = { childList: true, subtree: true };
				observer.observe(b, config);
			}
		}, false);
		$( document ).on( "init", ".slick-slider", function( e, slick ) {
			lazyLoadInstance.loadAll( slick.$slider[0].getElementsByTagName( 'img' ) );
		} );
		if ( $( '.of-cover, .stretched-img' ).length ) {
			objectFitImages( '.of-cover, .stretched-img' );
		}
		$( 'input,textarea' ).each( function() {
			$( this ).data( 'holder', $( this ).attr( 'placeholder' ) );

			$( this ).on( 'focusin', function() {
				$( this ).attr( 'placeholder', '' );
			} );

			$( this ).on( 'focusout', function() {
				$( this ).attr( 'placeholder', $( this ).data( 'holder' ) );
			} );
		} );
		$( "select" ).not( "#billing_state, #shipping_state, #billing_country, #shipping_country, [class*='woocommerce'], #product_cat" ).each( function() {
			initJUIselect(this);
		} );

		$(document).on('gform_post_render', function(event, form_id, current_page){
			$('#gform_' + form_id).find('select').each( function() {
				initJUIselect(this)
			} );
		});
		$( document ).on( 'gform_confirmation_loaded', function( event, formId ) {
			var $target = $( '#gform_confirmation_wrapper_' + formId );
			if ( $target.length ) {
				$( 'html, body' ).animate( {
					scrollTop: $target.offset().top - 50,
				}, 500 );
				return false;
			}
		} );
		$( 'body' ).on( 'change keyup', '.gfield input, .gfield textarea, .gfield select', function() {
			var $field = $( this ).closest( '.gfield' );
			if ( $field.hasClass( 'gfield_error' ) && $( this ).val().length ) {
				$field.find( '.validation_message' ).hide();
			} else if ( $field.hasClass( 'gfield_error' ) && !$( this ).val().length ) {
				$field.find( '.validation_message' ).show();
			}
		} );
		$( window ).on( 'toggled.zf.responsiveToggle', function() {
			$( '.menu-icon' ).toggleClass( 'is-active' );
		} ).on( 'changed.zf.mediaquery', function( e, value ) {
			$( '.menu-icon' ).removeClass( 'is-active' );
		} );

		$( window ).on( 'orientationchange', function() {
			setTimeout( function() {
				if ( $( '.menu-icon' ).hasClass( 'is-active' ) && window.innerWidth < 641 ) {
					$( '[data-responsive-toggle="main-menu"]' ).foundation( 'toggleMenu' )
				}
			}, 200 );
		} );

		resizeVideo();
		$('.acf-map').each(function(){
			render_map( $(this) );
		});

	} );
	$( window ).on( 'load', function() {

		if ( typeof scrollOut !== "undefined" ) {
			scrollOut.update();
		}
		if ( $( '.preloader' ).length ) {
			$( '.preloader' ).addClass( 'preloader--hidden' );
		}

	} );
	var resizeSelectCallback = debounce( resizeSelect, 200 );
	$( window ).on( 'resize', function() {
		resizeVideo();
		resizeSelectCallback();
		
	} );
	$(document).ready(function() {
		$(document).on('click','#clickBtn', function(e) {
			$(this).next('#popup').css('display', 'block');

		});
		$(document).on('click','#closeBtn', function(e) {
			$(this).closest('#popup').css('display', 'none');
		});
	});

	$( window ).on( 'scroll', function() {
		$('.related-posts').slick({
			dots: false,
			infinite: true,
			slidesToShow: 2,
			arrow: true,
			responsive: [
				{
					breakpoint: 641,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});
	} );

    const $rootSingle = $('.testimonials__content');
    const $rootNav = $('.testimonials__img');
    $rootSingle.on('afterChange', function(event, slick, currentSlide) {
        $rootNav.slick('slickGoTo', currentSlide);
        $rootNav.find('.slick-slide.is-active').removeClass('is-active');
        $rootNav.find('.slick-slide[data-slick-index="' + currentSlide + '"]').addClass('is-active');
    });

    $rootNav.on('click', '.slick-slide', function(event) {
        event.preventDefault();
        var goToSingleSlide = $(this).data('slick-index');
        $rootSingle.slick('slickGoTo', goToSingleSlide);
    });


    $(window).scroll(function () {

    	var sc = $(window).scrollTop();
		if (sc > 3000) {
			$(".ct-tabs").addClass("fixed_s")
		}else {
			$(".ct-tabs").removeClass("fixed_s");
		}
		if(sc > 5800){
			$(".ct-tabs").removeClass("fixed_s");
		}

    });

    $(window).scroll(function () {
        var y = $(this).scrollTop();

        $('#mainNav li a').each(function () {
            if (y >= $($(this).attr('href')).offset().top - 200) {
                $('#mainNav li a').not(this).removeClass('active');
                $(this).addClass('active');
            }
        });

    });


    $("#mainNav li a[href^='#']").on('click', function(e) {

        e.preventDefault();
        var target = this.hash;
        var $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function () {
        });

    });

	function render_map( $el ) {
		var $markers = $el.find( '.marker' );
		var args = {
			zoom: 16,
			center: new google.maps.LatLng( 0, 0 ),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false,
		};
		var map = new google.maps.Map( $el[0], args );
		map.markers = [];
		$markers.each( function() {
			add_marker( $( this ), map );
		} );
		center_map( map );
	}
	var infowindow;

	function add_marker( $marker, map ) {
		var latlng = new google.maps.LatLng( $marker.attr( 'data-lat' ), $marker.attr( 'data-lng' ) );
		var marker = new google.maps.Marker( {
			position: latlng,
			map: map,
		} );
		map.markers.push( marker );
		if ( $.trim( $marker.html() ) ) {
			infowindow = new google.maps.InfoWindow();
			google.maps.event.addListener( marker, 'click', function() {
				infowindow.close();
				infowindow.setContent( $marker.html() );
				infowindow.open( map, marker );
			} );
		}
	}
	function center_map( map ) {
		var bounds = new google.maps.LatLngBounds();
		$.each( map.markers, function( i, marker ) {
			var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );
			bounds.extend( latlng );
		} );
		if ( map.markers.length == 1 ) {
			map.setCenter( bounds.getCenter() );
		} else {
			map.fitBounds( bounds );
		}
	}
}( jQuery ));
