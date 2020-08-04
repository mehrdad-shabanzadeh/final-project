const form = document.getElementById('form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const userName = document.getElementById('userName');
const mobile = document.getElementById('mobile');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
// const avatar = document.getElementById('avatar').files[0];

// Send data for signup
form.addEventListener('submit', (e) => {
	let sex = '';
	document.getElementById('male').checked ? (sex = 'male') : (sex = 'female');
	e.preventDefault();
	if (firstName.value && lastName.value && userName.value && mobile.value && password.value && password2.value) {
		let signupData = {
			firstName: firstName.value,
			lastName: lastName.value,
			userName: userName.value,
			mobile: mobile.value,
			sex: sex,
			password: password.value,
			password2: password2.value,
		};
		axios
			// .post('/api/signup', new FormData(form))
			.post('/api/signup', signupData)
			.then((res) => {
				// res.data: the message coming from server
				showAlert('success', `${res.data}`);
				setTimeout(() => {
					window.location.href = '/api/login';
				}, 2000);
			})
			.catch((err) => {
				// err.response.data: the message coming from server
				showAlert('danger', `${err.response.data}`);
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
