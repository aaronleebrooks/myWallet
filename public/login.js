const dashboardUrl = 'http://localhost:8080/'

$('#signUp').on('submit', function(event) {
	event.preventDefault();
	let username = $('#username').val();
	let password = $('#password').val();
	let confirm_password = $('#confirm_password').val();

	let headers = new Headers();
	headers.append('Authorization', 'Basic' + window.btoa(username + ":" + password));

	console.log(username, password, confirm_password);

	if(password !== confirm_password) {
		$('#signUp').append('<p>Passwords must match!</p>');
	} else {
		fetch(dashboardUrl, {
			method: 'post',
			mode: 'no-cors',
			headers: headers,
			body: {
				username: username,
				password: password
			}
		})
	}
});