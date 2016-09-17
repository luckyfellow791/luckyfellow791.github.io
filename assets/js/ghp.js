$(document).ready(function(){
// lottery-selected-num

	$('.lottery-numbers button').click(function(){
		$(this).toggleClass('active');

		var content = $(this).text();
		$('.lottery-selected-num span:first-child').text(content);
	});
});