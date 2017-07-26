const dashboardUrl = 'http://localhost:8080/users'

function signUp(){
	$('#signUp').on('submit', function(event) {
	event.preventDefault();
	let username = $('#username').val();
	let password = $('#password').val();
	let confirm_password = $('#confirm_password').val();

	let bodyArray = {
		username: username,
		password: password
	};

	let headers = new Headers();
	headers.append('Content-Type', 'application/json', 'charset=utf-8');

	console.log(username, password, confirm_password);

	if(password !== confirm_password) {
		$('#signUp').append('<p>Passwords must match!</p>');
	} else {
		// $.post(dashboardUrl, $(this), function(data) {
		//   console.log('success');
		// });


		// $.ajax({
  //       type: "POST",
  //       url: dashboardUrl,
  //       data: $(this).serializeArray(),
  //       success: function () {
  //           console.log('did it');
  //       },
  //       catch: err => console.log(err)
  //   });

		fetch(dashboardUrl, {
			method: 'post',
			headers: headers,
			body: JSON.stringify($(this))
		})
	}
	})
}

$(function() {
	signUp();
})