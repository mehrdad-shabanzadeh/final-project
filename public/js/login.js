const form = document.getElementById('form');
const userName = document.getElementById('userName');
const password = document.getElementById('password');

form.addEventListener('submit', function (e) {
	e.preventDefault();
	if (userName.value && password.value) {
		axios
			.post('/api/login', {
				userName: userName.value,
				password: password.value,
			})
			.then((res) => {
				document.getElementById('alert').classList = 'alert alert-success';
				document.getElementById('alert').innerText = 'Welcome';
				setTimeout(() => {
					document.body.innerHTML = res.data;
				}, 1000);
			})
			.catch((err) => {
				showAlert('danger', `${err.response.data}`);
			});
	} else {
		showAlert('warning', 'Empty fields not allowed.');
	}
});

function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}
