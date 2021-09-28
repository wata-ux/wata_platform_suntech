// platform nav 
jQuery(document).ready(function ($) {
    $('.btn_layerpopup').on('click', function (e) {
        e.preventDefault();
        var el = $($(this).attr('href'));
        if (!el.hasClass('open')) {
            el.addClass('open');
        } else {
            el.removeClass('open');
        }
    });
    $('.btn_close_layer').on('click', function (e) {
        $(this).closest('.layer-popup').removeClass('open');
    });
	//solution select
	$('.card-inner ul li').on('hover', function () {
		$('a.btn-del').removeClass('on');
		$(this).addClass('on');
	});

	//solution select
	$('.method').on('click', function () {
		$('.method').removeClass('active');
		$(this).addClass('active');
	});

	//on mobile - open submenu
	$('.has-children').children('a').on('click', function (event) {
		//prevent default clicking on direct children of .has-children 
		event.preventDefault();
		var selected = $(this);
		selected.next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('move-out');
	});

	//submenu items - go back links
	$('.go-back').on('click', function () {
		var selected = $(this),
			visibleNav = $(this).parent('ul').parent('.has-children').parent('ul');
		selected.parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('move-out');
	});

	// tab 메뉴
	$('.tabList a').click(function(e){
		e.preventDefault();
		$('.tabList a, .tabCon').removeClass('current');
		$(this).add($($(this).attr('href'))).addClass('current');
	});

	// 더보기
	$('.btn-more').on('click', function() {
		$(this).closest('.more-cover').toggleClass('clicked');
	});
	

	$('.file-controls').on('click', '.btn-file-add', function (e) {
		e.preventDefault();

		var controlForm = $('.file-controls:first'),
			currentEntry = $(this).parents('.multi-file:first'),
			newEntry = $(currentEntry.clone()).appendTo(controlForm);

		newEntry.find('input').val('');
		controlForm.find('.multi-file:not(:last) .btn-file-add')
			.removeClass('btn-file-add').addClass('btn-file-remove')
			.html('<span class="material-icons">delete_outline</span>');
	}).on('click', '.btn-file-remove', function (e) {
		$(this).parents('.multi-file:first').remove();

		e.preventDefault();
		return false;
	});


	function toggleNav() {
		var navIsVisible = (!$('.cd-dropdown').hasClass('dropdown-is-active')) ? true : false;
		$('.cd-dropdown').toggleClass('dropdown-is-active', navIsVisible);
		$('.cd-dropdown-trigger').toggleClass('dropdown-is-active', navIsVisible);
		if (!navIsVisible) {
			$('.cd-dropdown').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
				$('.has-children ul').addClass('is-hidden');
				$('.move-out').removeClass('move-out');
				$('.is-active').removeClass('is-active');
			});
		}
	}
});


// global GNB
jQuery(document).ready(function ($) {
	function morphDropdown(element) {
		this.element = element;
		this.mainNavigation = this.element.find('.main-nav');
		this.mainNavigationItems = this.mainNavigation.find('.has-dropdown');
		this.dropdownList = this.element.find('.dropdown-list');
		this.dropdownWrappers = this.dropdownList.find('.dropdown');
		this.dropdownItems = this.dropdownList.find('.content');
		this.dropdownBg = this.dropdownList.find('.bg-layer');
		this.mq = this.checkMq();
		this.bindEvents();
	}

	morphDropdown.prototype.checkMq = function () {
		//check screen size
		var self = this;
		return window.getComputedStyle(self.element.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
	};

	morphDropdown.prototype.bindEvents = function () {
		var self = this;
		//hover over an item in the main navigation
		this.mainNavigationItems.mouseenter(function (event) {
			//hover over one of the nav items -> show dropdown
			self.showDropdown($(this));
		}).mouseleave(function () {
			setTimeout(function () {
				//if not hovering over a nav item or a dropdown -> hide dropdown
				if (self.mainNavigation.find('.has-dropdown:hover').length == 0 && self.element.find('.dropdown-list:hover').length == 0) self.hideDropdown();
			}, 50);
		});

		//hover over the dropdown
		this.dropdownList.mouseleave(function () {
			setTimeout(function () {
				//if not hovering over a dropdown or a nav item -> hide dropdown
				(self.mainNavigation.find('.has-dropdown:hover').length == 0 && self.element.find('.dropdown-list:hover').length == 0) && self.hideDropdown();
			}, 50);
		});

		//click on an item in the main navigation -> open a dropdown on a touch device
		this.mainNavigationItems.on('touchstart', function (event) {
			var selectedDropdown = self.dropdownList.find('#' + $(this).data('content'));
			if (!self.element.hasClass('is-dropdown-visible') || !selectedDropdown.hasClass('active')) {
				event.preventDefault();
				self.showDropdown($(this));
			}
		});

		//on small screens, open navigation clicking on the menu icon
		this.element.on('click', '.nav-trigger', function (event) {
			event.preventDefault();
			self.element.toggleClass('nav-open');
		});
	};

	morphDropdown.prototype.showDropdown = function (item) {
		this.mq = this.checkMq();
		if (this.mq == 'desktop') {
			var self = this;
			var selectedDropdown = this.dropdownList.find('#' + item.data('content')),
				selectedDropdownHeight = selectedDropdown.innerHeight(),
				selectedDropdownWidth = selectedDropdown.children('.content').innerWidth(),
				selectedDropdownLeft = item.offset().left + item.innerWidth() / 2 - selectedDropdownWidth / 2;

			//update dropdown position and size
			this.updateDropdown(selectedDropdown, parseInt(selectedDropdownHeight), selectedDropdownWidth, parseInt(selectedDropdownLeft));
			//add active class to the proper dropdown item
			this.element.find('.active').removeClass('active');
			selectedDropdown.addClass('active').removeClass('move-left move-right').prevAll().addClass('move-left').end().nextAll().addClass('move-right');
			item.addClass('active');
			//show the dropdown wrapper if not visible yet
			if (!this.element.hasClass('is-dropdown-visible')) {
				setTimeout(function () {
					self.element.addClass('is-dropdown-visible');
				}, 10);
			}
		}
	};

	morphDropdown.prototype.updateDropdown = function (dropdownItem, height, width, left) {
		this.dropdownList.css({
			'-moz-transform': 'translateX(' + left + 'px)',
			'-webkit-transform': 'translateX(' + left + 'px)',
			'-ms-transform': 'translateX(' + left + 'px)',
			'-o-transform': 'translateX(' + left + 'px)',
			'transform': 'translateX(' + left + 'px)',
			'width': width + 'px',
			'height': height + 'px'
		});

		this.dropdownBg.css({
			'-moz-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-webkit-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-ms-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-o-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'transform': 'scaleX(' + width + ') scaleY(' + height + ')'
		});
	};

	morphDropdown.prototype.hideDropdown = function () {
		this.mq = this.checkMq();
		if (this.mq == 'desktop') {
			this.element.removeClass('is-dropdown-visible').find('.active').removeClass('active').end().find('.move-left').removeClass('move-left').end().find('.move-right').removeClass('move-right');
		}
	};

	morphDropdown.prototype.resetDropdown = function () {
		this.mq = this.checkMq();
		if (this.mq == 'mobile') {
			this.dropdownList.removeAttr('style');
		}
	};

	var morphDropdowns = [];
	if ($('.cd-morph-dropdown').length > 0) {
		$('.cd-morph-dropdown').each(function () {
			//create a morphDropdown object for each .cd-morph-dropdown
			morphDropdowns.push(new morphDropdown($(this)));
		});

		var resizing = false;

		//on resize, reset dropdown style property
		updateDropdownPosition();
		$(window).on('resize', function () {
			if (!resizing) {
				resizing = true;
				(!window.requestAnimationFrame) ? setTimeout(updateDropdownPosition, 300) : window.requestAnimationFrame(updateDropdownPosition);
			}
		});

		function updateDropdownPosition() {
			morphDropdowns.forEach(function (element) {
				element.resetDropdown();
			});

			resizing = false;
		};
	}
});

// Glitch Timeline Function
jQuery(document).ready(function () {

	// Glitch Timeline Function
	var glitchTimeline = function () {
		var timeline = new TimelineMax({
			repeat: -1,
			repeatDelay: 2,
			paused: true,
			onUpdate: function () {
				$turb.setAttribute('baseFrequency', turbVal.val + ' ' + turbValX.val);
			}
		});

		timeline
			.to(turbValX, 0.1, {
				val: 0.5
			})
			.to(turbVal, 0.1, {
				val: 0.02
			});
		timeline
			.set(turbValX, {
				val: 0.000001
			})
			.set(turbVal, {
				val: 0.000001
			});
		timeline
			.to(turbValX, 0.2, {
				val: 0.4
			}, 0.4)
			.to(turbVal, 0.2, {
				val: 0.002
			}, 0.4);
		timeline
			.set(turbValX, {
				val: 0.000001
			})
			.set(turbVal, {
				val: 0.000001
			});

		// console.log("duration is: " + timeline.duration());

		return {
			start: function () {
				timeline.play(0);
			},
			stop: function () {
				timeline.pause();
			}
		};
	};


});

jQuery(document).ready(function () {
	if ($('.cd-stretchy-nav').length > 0) {
		var stretchyNavs = $('.cd-stretchy-nav');

		stretchyNavs.each(function () {
			var stretchyNav = $(this),
				stretchyNavTrigger = stretchyNav.find('.cd-nav-trigger');

			stretchyNavTrigger.on('click', function (event) {
				event.preventDefault();
				stretchyNav.toggleClass('nav-is-visible');
			});
		});

		$(document).on('click', function (event) {
			(!$(event.target).is('.cd-nav-trigger') && !$(event.target).is('.cd-nav-trigger span')) && stretchyNavs.removeClass('nav-is-visible');
		});
	}
});

jQuery(document).ready(function () {
	// Slide In Panel - by CodyHouse.co
	var panelTriggers = document.getElementsByClassName('js-cd-panel-trigger');
	if (panelTriggers.length > 0) {
		for (var i = 0; i < panelTriggers.length; i++) {
			(function (i) {
				var panelClass = 'js-cd-panel-' + panelTriggers[i].getAttribute('data-panel'),
					panel = document.getElementsByClassName(panelClass)[0];
				// open panel when clicking on trigger btn
				panelTriggers[i].addEventListener('click', function (event) {
					event.preventDefault();
					addClass(panel, 'cd-panel--is-visible');
				});
				//close panel when clicking on 'x' or outside the panel
				panel.addEventListener('click', function (event) {
					if (hasClass(event.target, 'js-cd-close') || hasClass(event.target, panelClass)) {
						event.preventDefault();
						removeClass(panel, 'cd-panel--is-visible');
					}
				});
			})(i);
		}
	}

	//class manipulations - needed if classList is not supported
	//https://jaketrent.com/post/addremove-classes-raw-javascript/
	function hasClass(el, className) {
		if (el.classList) return el.classList.contains(className);
		else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}
	function addClass(el, className) {
		if (el.classList) el.classList.add(className);
		else if (!hasClass(el, className)) el.className += " " + className;
	}
	function removeClass(el, className) {
		if (el.classList) el.classList.remove(className);
		else if (hasClass(el, className)) {
			var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
			el.className = el.className.replace(reg, ' ');
		}
	}
});

$('#status-map').on('click', function () {
	$(":radio[name='mapStauts']").change(function () {
		var _tabBox = $('.tabBox');
		var _mapStauts = $(this).prop("checked", true).attr("id");
		_tabBox.removeClass('active');
		$('.' + _mapStauts).addClass('active');
	});
});

jQuery(document).ready(function (e) {
    function t(t) {
        e(t).bind("click", function (t) {
            t.preventDefault();
            e(this).parent().fadeOut()
        })
    }
    e(".filter-dropdown-toggle").click(function () {
        var t = e(this).parents(".filter-cell").children(".filter-item-dropdown").is(":hidden");
        e(".filter-cell .filter-item-dropdown").hide();
        e(".filter-cell .filter-dropdown-toggle").removeClass("active");
        if (t) {
            e(this).parents(".filter-cell").children(".filter-item-dropdown").toggle().parents(".filter-cell").children(".filter-dropdown-toggle").addClass("active")
        }
    });
    e(document).bind("click", function (t) {
        var n = e(t.target);
        if (!n.parents().hasClass("filter-cell")) e(".filter-cell .filter-item-dropdown").hide();
    });
    e(document).bind("click", function (t) {
        var n = e(t.target);
        if (!n.parents().hasClass("filter-cell")) e(".filter-cell .filter-dropdown-toggle").removeClass("active");
    })
});


jQuery(document).ready(function($){
	// browser window scroll (in pixels) after which the "menu" link is shown
	var offset = 300;

	var navigationContainer = $('#filter-bar'),
		mainNavigation = navigationContainer.find('.status-map');

	//hide or show the "menu" link
	checkMenu();
	$(window).scroll(function(){
		checkMenu();
	});

	//open or close the menu clicking on the bottom "menu" link
	$('.cd-filter-trigger').on('click', function(){
		$(this).toggleClass('menu-is-open');
		//we need to remove the transitionEnd event handler (we add it when scolling up with the menu open)
		mainNavigation.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');

	});

	function checkMenu() {
		if( $(window).scrollTop() > offset && !navigationContainer.hasClass('is-fixed')) {
			navigationContainer.addClass('is-fixed').find('.cd-filter-trigger').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				mainNavigation.addClass('has-transitions');
			});
		} else if ($(window).scrollTop() <= offset) {
			//check if the menu is open when scrolling up
			if( mainNavigation.hasClass('is-visible')  && !$('html').hasClass('no-csstransitions') ) {
				//close the menu with animation
				mainNavigation.addClass('is-hidden').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					//wait for the menu to be closed and do the rest
					mainNavigation.removeClass('is-visible is-hidden has-transitions');
					navigationContainer.removeClass('is-fixed');
					$('.cd-filter-trigger').removeClass('menu-is-open');
				});
			//check if the menu is open when scrolling up - fallback if transitions are not supported
			} else if( mainNavigation.hasClass('is-visible')  && $('html').hasClass('no-csstransitions') ) {
					mainNavigation.removeClass('is-visible has-transitions');
					navigationContainer.removeClass('is-fixed');
					$('.cd-filter-trigger').removeClass('menu-is-open');
			//scrolling up with menu closed
			} else {
				navigationContainer.removeClass('is-fixed');
				mainNavigation.removeClass('has-transitions');
			}
		} 
	}
});


// tutorial
jQuery(document).ready(function($){
	//check if a .cd-tour-wrapper exists in the DOM - if yes, initialize it
	$('.cd-tour-wrapper').exists() && initTour();

	function initTour() {
		var tourWrapper = $('.cd-tour-wrapper'),
			tourSteps = tourWrapper.children('.cd-single-step'),
			stepsNumber = tourSteps.length,
			coverLayer = $('.cd-cover-layer'),
			tourStepInfo = $('.cd-more-info'),
			tourTrigger = $('#cd-tour-trigger');

		//create the navigation for each step of the tour
		createNavigation(tourSteps, stepsNumber);
		
		tourTrigger.on('click', function(){
			//start tour
			if(!tourWrapper.hasClass('tutorial-active')) {
				//in that case, the tour has not been started yet
				tourWrapper.addClass('tutorial-active');
				showStep(tourSteps.eq(0), coverLayer);
			}
		});

		//change visible step
		tourStepInfo.on('click', '.cd-prev', function(event){
			//go to prev step - if available
			( !$(event.target).hasClass('inactive') ) && changeStep(tourSteps, coverLayer, 'prev');
		});
		tourStepInfo.on('click', '.cd-next', function(event){
			//go to next step - if available
			( !$(event.target).hasClass('inactive') ) && changeStep(tourSteps, coverLayer, 'next');
		});

		//close tour
		tourStepInfo.on('click', '.cd-close', function(event){
			closeTour(tourSteps, tourWrapper, coverLayer);
		});

		//detect swipe event on mobile - change visible step
		tourStepInfo.on('swiperight', function(event){
			//go to prev step - if available
			if( !$(this).find('.cd-prev').hasClass('inactive') && viewportSize() == 'mobile' ) changeStep(tourSteps, coverLayer, 'prev');
		});
		tourStepInfo.on('swipeleft', function(event){
			//go to next step - if available
			if( !$(this).find('.cd-next').hasClass('inactive') && viewportSize() == 'mobile' ) changeStep(tourSteps, coverLayer, 'next');
		});

		//keyboard navigation
		$(document).keyup(function(event){
			if( event.which=='37' && !tourSteps.filter('.is-selected').find('.cd-prev').hasClass('inactive') ) {
				changeStep(tourSteps, coverLayer, 'prev');
			} else if( event.which=='39' && !tourSteps.filter('.is-selected').find('.cd-next').hasClass('inactive') ) {
				changeStep(tourSteps, coverLayer, 'next');
			} else if( event.which=='27' ) {
				closeTour(tourSteps, tourWrapper, coverLayer);
			}
		});
	}

	function createNavigation(steps, n) {
		var tourNavigationHtml = '<div class="cd-nav"><span><b class="cd-actual-step">1</b> of '+n+'</span><ul class="cd-tour-nav"><li><a href="#0" class="cd-prev">&#171; Previous</a></li><li><a href="#0" class="cd-next">Next &#187;</a></li></ul></div><a href="#0" class="cd-close">Close</a>';

		steps.each(function(index){
			var step = $(this),
				stepNumber = index + 1,
				nextClass = ( stepNumber < n ) ? '' : 'inactive',
				prevClass = ( stepNumber == 1 ) ? 'inactive' : '';
			var nav = $(tourNavigationHtml).find('.cd-next').addClass(nextClass).end().find('.cd-prev').addClass(prevClass).end().find('.cd-actual-step').html(stepNumber).end().appendTo(step.children('.cd-more-info'));
		});
	}

	function showStep(step, layer) {
		step.addClass('is-selected').removeClass('move-left');
		smoothScroll(step.children('.cd-more-info'));
		showLayer(layer);
	}

	function smoothScroll(element) {
		(element.offset().top < $(window).scrollTop()) && $('body,html').animate({'scrollTop': element.offset().top}, 100);
		(element.offset().top + element.height() > $(window).scrollTop() + $(window).height() ) && $('body,html').animate({'scrollTop': element.offset().top + element.height() - $(window).height()}, 100); 
	}

	function showLayer(layer) {
		layer.addClass('is-visible').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
			layer.removeClass('');
		});
	}

	function changeStep(steps, layer, bool) {
		var visibleStep = steps.filter('.is-selected'),
			delay = (viewportSize() == 'desktop') ? 300: 0; 
		visibleStep.removeClass('is-selected');

		(bool == 'next') && visibleStep.addClass('move-left');

		setTimeout(function(){
			( bool == 'next' )
				? showStep(visibleStep.next(), layer)
				: showStep(visibleStep.prev(), layer);
		}, delay);
	}

	function closeTour(steps, wrapper, layer) {
		steps.removeClass('is-selected move-left');
		wrapper.removeClass('tutorial-active');
		layer.removeClass('is-visible');
	}

	function viewportSize() {
		/* retrieve the content value of .cd-main::before to check the actua mq */
		return window.getComputedStyle(document.querySelector('.cd-tour-wrapper'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	}
});

//check if an element exists in the DOM
jQuery.fn.exists = function(){ return this.length > 0; }