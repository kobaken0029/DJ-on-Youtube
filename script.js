var player;

$(function() {

	$('#q').focus();

	$('#search').submit(function(){
		var url = "https://www.googleapis.com/youtube/v3/search";
		var options = {
			key: "AIzaSyDx3H3XYL6KiYgcKa5zIBf95OixQFpohkU",
			part: "snippet",
			q: $('#q').val(),
			type: "video",
			maxResults: 10,
		};

		$.get(url, options, function(rs){
			console.log(rs);
			$('#list').empty();
			for (var i = 0; i < rs.items.length; i++) {
				var item = rs.items[i];
				$('#list').append(
					$('<li class="movie">').append(
						$('<img>').attr('src', item['snippet']['thumbnails']['default']['url'])
					).data('video-id', item['id']['videoId'])
				);
			};
		}, "json")
	});

	$(document).on('click', 'li.movie', function(){
		$(this).toggleClass('on');
	});

	var currentIndex = 0;

	function play() {
		var videoId = $('li.movie.on:eq('+currentIndex+')').data('video-id');

		player.loadVideoById(videoId);
		$('li.movie').removeClass('playing');
		$('li.movie.on:eq('+currentIndex+')').addClass('playing');
	}

	$('#play').click(function(){
		play();
	});

	$('#pause').click(function() {
		player.pauseVideo();
	});

	$('#next').click(function() {
		if (currentIndex == $('li.movie.on').length - 1) {
			currentIndex = 0;
		}
		else {
			currentIndex++;
		}
		play();
	});

	$('#prev').click(function() {
		if(currentIndex == 0) {
			return false;
		}
		currentIndex--;
		play();
	});
});

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
			height: '390',
			width: '640',
			events: {
				onStateChange: onPlayerStateChange
			}
		}

	)
}

function onPlayerStateChange(e) {
	if (e.data == YT.PlayerState.ENDED) {
		$('#next').trigger('click');
	}
}