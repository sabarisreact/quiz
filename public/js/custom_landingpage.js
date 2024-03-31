var myFullpage = new fullpage('#fullpage', {
			//anchors: ['hero','video_popup','scantojoin','question1','answer1','video_popup_2','scancode','question2','answer2','slide1','slide2','slide3','slide4','slide5','slide6','slide7','slide8','slide9','slide10','slide11','slide12','question3','answer3','slide13'],
			sectionsColor: ['#0A0909', '#0A0909', '#0A0909','#0A0909', '#0A0909','#0A0909','#0A0909','#0A0909','#0A0909','#0A0909','#0A0909','#171616','#0A0909','#171616','#0A0909','#171616','#0A0909','#171616','#0A0909','#171616','#0A0909','#171616','#0A0909','#171616'],
			// navigation: false,
			// navigationPosition: 'right',
			// scrollOverflow: true,
			// onScrollOverflow: function(section, slide, position, direction){
			// 		var params = {
			// 			section: section,
			// 			slide: slide,
			// 			position: position,
			// 			direction: direction
			// 		};

			// 	}
// 			navigationTooltips: ['First page', 'Second page', 'Third and last page']
		});
	
$(document).ready(function() {
		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false
	});
});