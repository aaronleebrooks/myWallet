const dashboardUrl = 'mongodb://demo:demo@ds129053.mlab.com:29053/mywallet/users/me'

$('#signIn').on('submit', function(event) {
	event.preventDefault();
	let username = $('#sign-in-user').val();
	let password = $('#sign-in-password').val();

	$.ajax({ 
		url: dashboardUrl, 
		type: 'GET',
		headers: {
			Authorization: "Basic "+ btoa(username+ ":"+ password)
		}, 
		
		 success: function(got) { 
		 	console.log(got.user.id);
			sessionStorage.headers = "Basic "+ btoa(username+ ":"+ password);
			sessionStorage.id = got.user.id
			sessionStorage.username = got.user.username
			window.location = './profile.html';
		}, 
	      error: function(res) {
			console.log(res);
			$('.confirmation').replaceWith(`<p class="confirmation">Incorrect Username or Password</p>`)
	         }
	    });
	});
