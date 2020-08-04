const form = document.getElementById('form');
const userName = document.getElementById('userName');
const password = document.getElementById('password');

form.addEventListener('submit', function (e) {
	e.preventDefault();
	if (userName.value && password.value) {
		axios
			.post('/api/login/Admin', {
				userName: userName.value,
				password: password.value,
			})
			.then((res) => {
				showAlert('success', res.data);
				setTimeout(() => {
					// Rendered dashboard page comes here as the response, so put it in the body
					// document.body.innerHTML = res.data;
					window.location.href = 'http://localhost:3000/api/admin/dashboardAdmin';
				}, 1000);
			})
			.catch((err) => {
				showAlert('danger', `${err.response.data}`);
			});
	} else {
		showAlert('warning', 'Please fill the empty fields.');
	}
});

function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}
