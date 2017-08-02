const dashboardUrl = 'http://localhost:8080/users'

function signUp(){
	$('#signUp').on('submit', function(event) {
	event.preventDefault();
	let username = $('#username').val();
	let password = $('#password').val();
	let confirm_password = $('#confirm_password').val();

	if(password !== confirm_password) {
		$('.confirmation').html('<p>Passwords must match!</p>');
	} else {

	var settings = {
      url: dashboardUrl,
      method: 'POST',
      data: JSON.stringify({username: username, password: password}),
      contentType: 'application/json',
      dataType: 'json',
      success: function(got) {
			sessionStorage.headers = "Basic "+ btoa(username+ ":"+ password);
			sessionStorage.id = got.id
			sessionStorage.username = got.username
			window.location = './profile/profile.html';
        },
      error: function(res) {
		console.log(res);
         }
    };

    $.ajax(settings)
        .done(function (got) {
			sessionStorage.headers = "Basic "+ btoa(username+ ":"+ password);
			sessionStorage.id = got.user.id
			sessionStorage.username = got.user.username
			window.location = './profile/profile.html';
        })
	}
	})
}

$(function() {
	signUp();
})