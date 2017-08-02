const dashboardUrl = 'http://localhost:8080/users/me'

$('#signIn').on('submit', function(event) {
	event.preventDefault();
	let username = $('#sign-in-user').val();
	let password = $('#sign-in-password').val();

	console.log(username, password);

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
			window.location = './profile/profile.html';
		} 

	});
});