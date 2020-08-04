const form = document.getElementById('form');
const editBtn = document.getElementById('edit-btn');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const userName = document.getElementById('userName');
const mobile = document.getElementById('mobile');
const uploadBtn = document.getElementById('uploadBtn');
const uploadModal = document.getElementById('uploadAvatarModal');

// Send user data to update profile
editBtn.addEventListener('click', (e) => {
	alert('clicked on submit');
	e.preventDefault();
	let sex = '';
	document.getElementById('male').checked ? (sex = 'male') : (sex = 'female');
	if (!firstName.value && !lastName.value && !userName.value && !sex && !mobile.value) {
		showAlert('warning', 'Please enter your information. Empty fields are not allowed!');
	}

	axios
		.post('/api/user/editProfile', {
			firstName: firstName.value,
			lastName: lastName.value,
			userName: userName.value,
			sex: sex,
			mobile: mobile.value,
		})
		.then((res) => {
			showAlert('success', res.data);
			setTimeout(() => {
				window.location.href = '/api/user/dashboard';
			}, 2000);
		})
		.catch((err) => {
			showAlert('danger', 'Something went wrong');
		});
});

// **************************************************************************
// **************************************************************************

// Show the password input if clicked on change password button
document.getElementById('showPasswordInput').addEventListener('click', (e) => {
	e.preventDefault();
	document.getElementById('showPasswordInput').classList.add('d-none');
	document.getElementById('password').classList.remove('d-none');
	document.getElementById('changePasswordPage').classList.remove('d-none');
});

// **************************************************************************
// **************************************************************************

// Send the password to server, so if it is correct redirect user to change password page
document.getElementById('changePasswordPage').addEventListener('click', (e) => {
	e.preventDefault();
	// get the password and send the it to server to check if it is correct, send the client to the change password page
	if (!document.getElementById('password').value) {
		showAlert('warning', 'Please enter your password. Empty fields are not allowed!');
	} else {
		let password = document.getElementById('password').value;
		axios
			.post('/api/user/changePasswordPage', { password })
			.then((res) => {
				showAlert('success', 'Please wait a moment...');
				setTimeout(() => {
					window.location.href = 'http://localhost:3000/api/user/changePasswordPage';
				}, 1000);
			})
			.catch((err) => {
				showAlert('danger', err.response.data);
			});
	}
});

// **************************************************************************
// **************************************************************************
// Upload Avatar

uploadBtn.addEventListener('click', (e) => {
	e.preventDefault();
	// uploadModal.style.display = 'none'; // not working
	axios
		.post('/api/user/uploadAvatar', new FormData(form))
		.then((res) => {
			showAlertModal('success', res.data);
			setTimeout(() => {
				window.location.href = 'http://localhost:3000/api/user/dashboard';
			}, 2000);
		})
		.catch((err) => {
			showAlertModal('danger', err.response.data);
		});
});

// **************************************************************************
// **************************************************************************
// Functions

// Show alert box function
function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}

// show alert box in the modal
function showAlertModal(type, message) {
	document.getElementById('alertModal').classList = `d-block alert alert-${type}`;
	document.getElementById('alertModal').innerText = message;
}
