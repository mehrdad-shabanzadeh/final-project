const form = document.getElementById('form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const userName = document.getElementById('userName');
const mobile = document.getElementById('mobile');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const avatar = document.getElementById('avatar').files[0];

let sex = '';
document.getElementById('male').checked ? (sex = 'male') : (sex = 'female');

// Send data for signup
form.addEventListener('submit', (e) => {
	e.preventDefault();
	if (firstName.value && lastName.value && userName.value && mobile.value && password.value && password2.value) {
		axios
			.post('/api/signup', new FormData(form))
			.then((res) => {
				showAlert('success', `${res.data}`);
				setTimeout(() => {
					window.location.href = '/api/login';
				}, 4000);
			})
			.catch((err) => {
				showAlert('danger', `${err.response.data}`);
				// showAlert('danger', 'Error line 27');
			});
	} else {
		alert('Error');
		showAlert('warning', 'Empty fields not allowed.');
	}
});

function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}

// **********************************************************************
