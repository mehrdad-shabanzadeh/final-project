// Send the new password to server
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const btn = document.getElementById('changePasswordBtn');

btn.addEventListener('click', (e) => {
	e.preventDefault();
	if (!password && password2) {
		showAlert('warning', 'Please enter your new password. Empty fields are not allowed!');
	} else {
		axios
			.post('/api/user/changePassword', {
				password: password.value,
				password2: password2.value,
			})
			.then((res) => {
				showAlert('success', 'Your password changed successfully.');
				setTimeout(() => {
					window.location.href = 'http://localhost:3000/api/user/dashboard';
				}, 3000);
			})
			.catch((err) => {
				showAlert('danger', 'Something went wrong. Please try again!');
			});
	}
});

// Show alert box function
function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}
