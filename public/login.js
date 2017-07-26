const dashboardUrl = 'http://localhost:8080/'

$('#signIn').on('submit', function(event) {
	event.preventDefault();
	let username = $('#username').val();
	let password = $('#password').val();

	let headers = new Headers();
	headers.append('Authorization', 'Basic' + window.btoa(username + ":" + password));

	console.log(username, password);

		fetch(dashboardUrl, {
			method: 'get',
			headers: headers
		}).then(console.log('success!'));
	});