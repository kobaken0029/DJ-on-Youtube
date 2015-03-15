var player1;
var player2;

$(function() {

	$('#q').focus();

	$(function() {
	    $( "#vertical-slider1" ).slider({
		    orientation: "vertical",
		    range: "min",
		    min: 0,
		    max: 100,
		    value: 60,
		    slide: function( event, ui ) {
		    	var currentVolume = ui.value;
		    	var holizontalValue = $('#holizontal-slider').slider("value");

	    		if (holizontalValue > 100) {
		    		currentVolume *= (200 - holizontalValue) / 100.0;
		    	}
	    		player1.setVolume(currentVolume);
			}
		});
  });

  	$(function() {
	    $( "#vertical-slider2" ).slider({
		    orientation: "vertical",
		    range: "min",
		    min: 0,
		    max: 100,
		    value: 60,
		    slide: function( event, ui ) {
		     	var currentVolume = ui.value;
		    	var holizontalValue = $('#holizontal-slider').slider("value");

	    		if (holizontalValue < 100) {
		    		currentVolume *= holizontalValue / 100.0;
		    	}
	    		player2.setVolume(currentVolume);
			}
		});
  });

  	$(function() {
	    $( "#holizontal-slider" ).slider({
		    min: 0,
		    max: 200,
		    value: 100,
		    slide: function( event, ui ) {
		    	var player1Volume = $('#vertical-slider1').slider("value");
		    	var player2Volume = $('#vertical-slider2').slider("value");

		    	if (ui.value > 100) {
		    		player1Volume *= (200 - ui.value) / 100.0;
		    		player1.setVolume(player1Volume);
		    	}
		    	else {
			    	player2Volume *= ui.value / 100.0;
			    	player2.setVolume(player2Volume);
		    	}
		    	
			}
		});
  });

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
					).attr('data-video-id', item['id']['videoId']).append(
						$('<li>').append(
							$('<p class="title">').append(function(){
								var txt = item['snippet']['title'];
								if(txt.length > 41){
        							txt = txt.substr(0, 41);
        							$(this).text(txt + "･･･");
    							}
    							else return txt;
							})
						)
					)
				);
			};
		}, "json")
	});



	$(document).on('click', '#list .movie', function(){
		var videoId = $(this).data('video-id');
		$(this).toggleClass('on');

		if ($(this).hasClass('on')) {
			$('#playlist').append(
				$(this).clone().append($('<button>').attr('class', 'btn btn-sm btn-default assign1-button').append(
					'<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> <strong>1</strong>')
				).append($('<button>').attr('class', 'btn btn-sm btn-default assign2-button').append(
					'<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> <strong>2</strong>')
				)
			);
		}
		else {
			$('#playlist [data-video-id = '+videoId+']').remove();
		}
	});

	// $(document).on('click', '#playlist li', function(){
	// 	var videoId = $(this).data('video-id');
	// 	$('#list [data-video-id = '+videoId+']').removeClass('on');
	// 	$(this).remove();
	// });

	$(document).on('click', '#playlist .assign1-button', function(){
		var videoId = $($(this).parent()).data('video-id');
		player1.cueVideoById(videoId);
	});

	$(document).on('click', '#playlist .assign2-button', function(){
		var videoId = $($(this).parent()).data('video-id');
		player2.cueVideoById(videoId);
	});

	var currentIndex = 0;

	function play() {
		var videoId = $('#playlist .on:eq('+currentIndex+')').data('video-id');

		player1.cueVideoById(videoId);
		$('li.movie').removeClass('playing');
		$('#playlist .on:eq('+currentIndex+')').addClass('playing');
	}

	$('#play').click(function(){
		play();
	});

	$('#pause').click(function() {
		player1.pauseVideo();
	});

	$('#next').click(function() {
		if (currentIndex == $('#playlist .on').length - 1) {
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
			currentIndex = $('#playlist .on').length - 1;
		}
		play();
	});
});

function onYouTubeIframeAPIReady() {
	player1 = new YT.Player('player1', {
			height: '390',
			width: '640',
			autohide: '1',
			events: {
				// onStateChange: onPlayerStateChange
			}
		}

	)

	player2 = new YT.Player('player2', {
			height: '390',
			width: '640',
			autohide: '1',
			events: {
				// onStateChange: onPlayerStateChange
			}
		}

	)
}

function onPlayerStateChange(e) {
	if (e.data == YT.PlayerState.ENDED) {
		$('#next').trigger('click');
	}
}