const form = document.getElementById('form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const userName = document.getElementById('userName');
const mobile = document.getElementById('mobile');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
let sex = '';
document.getElementById('male').checked ? (sex = 'male') : (sex = 'female');
// Send data for signup
form.addEventListener('submit', function (e) {
	e.preventDefault();
	if (firstName.value && lastName.value && userName.value && mobile.value && password.value && password2.value) {
		axios
			.post('/api/signup', {
				firstName: firstName.value,
				lastName: lastName.value,
				sex: sex,
				userName: userName.value,
				mobile: mobile.value,
				password: password.value,
				password2: password2.value,
			})
			.then((res) => {
				showAlert('success', `${res.data}`);
				setTimeout(() => {
					window.location.href = '/api/login';
				}, 4000);
			})
			.catch((err) => {
				document.getElementById(err.response.data.input).classList.add('is-invalid');
				showAlert('danger', `${err.response.data.msg}`);
			});
	} else {
		showAlert('warning', 'Empty fields not allowed.');
	}
});

function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}
