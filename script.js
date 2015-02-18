var player1;
var player2;

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
						$('<img>').attr({
							'src': item['snippet']['thumbnails']['default']['url'],
							'class': 'img-thumbnail'
						})
					).data('video-id', item['id']['videoId']).append(
						$('<li>').append(
							$('<p>').append(item['snippet']['title'])
						)
					)
				);
			};
		}, "json")
	});



	$(document).on('click', '#list li', function(){
		var moviePosition = $('#list .assigned1').index(this);

		if ($('#radio1')[0].checked) {
			$(this).removeClass('assigned2');
			$(this).toggleClass('assigned1');	
		}
		else {
			$(this).removeClass('assigned2');
			$(this).toggleClass('assigned1');	
		}

		if ($(this).hasClass('assigned1')) {
			$('#playlist').append($(this).clone());
		}
		else {
			$('#playlist .assigned1:eq('+moviePosition+')').remove();
		}
	});

	var currentIndex = 0;

	function play() {
		var videoId = $('#playlist .assigned1:eq('+currentIndex+')').data('video-id');

		player1.cueVideoById(videoId);
		$('li.movie').removeClass('playing');
		$('li.movie.assigned1:eq('+currentIndex+')').addClass('playing');
	}

	$('#play').click(function(){
		play();
	});

	$('#pause').click(function() {
		player1.pauseVideo();
	});

	$('#next').click(function() {
		if (currentIndex == $('li.movie.assigned1').length - 1) {
			currentIndex = 0;
		}
		else {
			currentIndex++;
		}
		play();
	});

	$('#prev').click(function() {
		currentIndex--;
		if(currentIndex == 0) {
			currentIndex = $('li.movie.assigned1').length - 1;
		}
		play();
	});
});

function onYouTubeIframeAPIReady() {
	player1 = new YT.Player('player1', {
			height: '390',
			width: '640',
			events: {
				onStateChange: onPlayerStateChange
			}
		}

	)

	player2 = new YT.Player('player2', {
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