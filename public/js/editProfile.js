let sex = '';
document.getElementById('male').checked ? (sex = 'male') : (sex = 'female');

document.getElementById('form').addEventListener('submit', function (e) {
	e.preventDefault();
	axios
		.post('/api/user/editProfile', {
			firstName: document.getElementById('firstName').value,
			lastName: document.getElementById('lastName').value,
			userName: document.getElementById('userName').value,
			sex: sex,
			mobile: document.getElementById('mobile').value,
			password: document.getElementById('password').value,
		})
		.then((res) => {
			showAlert('success', 'Your profile updated successfully.');
			setTimeout(function () {
				window.location.href = '/api/user/dashboard';
			}, 3000);
		})
		.catch((err) => {
			showAlert('danger', 'Something went wrong');
		});
});

function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}
