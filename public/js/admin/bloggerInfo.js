// LOGOUT
document.getElementById('logout').addEventListener('click', function (e) {
	// e.preventDefault();
	if (confirm('Are you sure?')) {
		axios
			.get('/api/user/logout')
			.then((res) => {
				window.location.href = 'http://localhost:3000';
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

// *******************************************************************************************************
// *******************************************************************************************************
// Reset password
document.getElementById('resetPassword').addEventListener('click', (e) => {
	e.preventDefault();
	axios
		.post('/api/admin/resetPassword', { id: e.target.getAttribute('data-id') })
		.then((res) => {
			showAlert('success', res.data);
		})
		.catch((err) => {
			showAlert('danger', err.response.data);
		});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Remove blogger
document.getElementById('removeBlogger').addEventListener('click', (e) => {
	e.preventDefault();
	axios
		.post('/api/admin/removeBlogger', { id: e.target.getAttribute('data-id') })
		.then((res) => {
			showAlert('success', res.data);
			setTimeout(() => {
				window.location.href = 'http://localhost:3000/api/admin/dashboardAdmin';
			}, 2000);
		})
		.catch((err) => {
			showAlert('danger', err.response.data);
		});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Functions

function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}
