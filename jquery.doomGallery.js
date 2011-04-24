/**
* jQuery Doom Gallery Plugin
*
* @author Dumitru Glavan
* @link http://dumitruglavan.com
* @version 1.1
* @requires jQuery v1.3.2 or later
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/

//FIXME --- All this shit should go in one beautifull plugin :p

$('#user-thumbs').doomCarousel({
	autoSlide: false,
	itemsToScroll: 4,
	showCaption: false
});

// Handle thumbs click
$('#user-thumbs-list').find('a.active').mousedown(function () {
	$('#primary-image').attr('src', $(this).attr('data-mediumimage')).attr('data-index', $(this).attr('data-index'));
	return false;
});
$('#user-thumbs-list').find('a.active').click(function () {return false;});

var $lightbox = null;
var $loader = null;
var bigImg = null;

// Preload images
var imageCache = {};
$('#user-thumbs-list').find('a.active').each(function () {
	var $self = $(this);
	imageCache[$self.attr('href')] = $('<img />');
	imageCache[$self.attr('href')].attr('src', $self.attr('href'));
});

// Handle big image click
$('#primary-image').mousedown(function () {
	var $boxContent = $('<div id="lightbox-photo-frame"><a href="#" id="prev-lightbox-photo"></a><img src="' + that.getGlobal('ajaxLoader') + '" id="lightbox-image" /><a href="#" id="next-lightbox-photo"></a></div>');
	$loader = $('#lightbox-image', $boxContent);
	$loader.css({
		maxWidth:$(window).width()- 40,
		maxHeight: $(window).height() - 120
	});
	var bigImageSrc = $('#user-thumbs-list').find('a[data-index="' + $(this).attr('data-index') + '"]:first').attr('href');
	bigImg = new Image();
	bigImg.onload = function () {
		$loader.attr('src', bigImg.src);
	};
	bigImg.src = bigImageSrc;
	$lightbox = $($boxContent).doomWindows({
		wrapperId: 'lightbox-container',
		width: $(window).width() - 200,
		height: $(window).height() - 100,
		buttons: false,
		onShow: function() {
			$boxContent.find('a').css('height', $(window).height() - 120);
		},
		buttonClick: function (choice, $win) {
			if (choice === 'close') {
				var $link = $('#user-thumbs-list').find('a[data-index="' + $('#lightbox-image').attr('data-index') + '"]:first');
				$link.mousedown();
				$win.close();
			}
			return true;
		}
	});
});

// Handle Prev button on lightbox
$('#prev-lightbox-photo').live('mousedown', function () {
	var currentIndex = $('#primary-image').attr('data-index');
	var prevIndex = parseInt(currentIndex) - 1;
	var $link =  $('#user-thumbs-list').find('a[data-index="' + prevIndex + '"]:first');
	if ($link.length) {
		$('#primary-image').attr('data-index', prevIndex);
		$loader.attr('data-index', prevIndex);
		bigImg.src = $link.attr('href');
	}
	return false;
});

// Handle Next button on lightbox
$('#next-lightbox-photo').live('mousedown', function () {
	var currentIndex = $('#primary-image').attr('data-index');
	var nextIndex = parseInt(currentIndex) + 1;
	var $link =  $('#user-thumbs-list').find('a[data-index="' + nextIndex + '"]:first');
	if ($link.length) {
		$('#primary-image').attr('data-index', nextIndex);
		$loader.attr('data-index', nextIndex);
		bigImg.src = $link.attr('href');
	}
	return false;
});

// Handle delete images
$('a.photo-delete').mousedown(function () {
	var $self = $(this);
	$.get($self.attr('href'));
	$self.mouseout();
	$self.parents('li:first').empty();
	return false;
});

// Handle set primary images
$('a.photo-primary').mousedown(function () {
	var $self = $(this);
	$.get($self.attr('href'));
	var $ul = $self.parents('ul:first');
	var $currentLi = $self.parents('li:first');
	$currentLi.insertBefore($('li:first', $ul));
	$self.mouseout();

	return false;
});
