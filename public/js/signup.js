const dashboardUrl = 'https://localhost:8080/users'

function signUp(){
	$('#signUp').on('submit', function(event) {
	event.preventDefault();

	// These lines get hte values of the user's input on the signup page.
	let username = $('#username').val();
	let password = $('#password').val();
	let confirm_password = $('#confirm_password').val();


	//This checks to make sure that both passwords are equal.
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
      	//basic authentication using Passport
			sessionStorage.headers = "Basic "+ btoa(username+ ":"+ password);
			sessionStorage.id = got.id
			sessionStorage.username = got.username
			window.location = './profile.html';
        },
      error: function(res) {
		console.log(res);
		$('.confirmation').replaceWith(`<p class="confirmation">${res.responseJSON.message}</p>`)
         }
    };

    $.ajax(settings)
        .done(function (got) {
       	//basic authentication using Passport
			sessionStorage.headers = "Basic "+ btoa(username+ ":"+ password);
			sessionStorage.id = got.user.id
			sessionStorage.username = got.user.username
			window.location = './profile.html';
        })
	}
	})
}

$(function() {
	signUp();
})