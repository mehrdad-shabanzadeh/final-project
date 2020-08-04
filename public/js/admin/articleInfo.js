// *******************************************************************************************************
// *******************************************************************************************************
// Remove article
document.getElementById('removeArticle').addEventListener('click', (e) => {
	e.preventDefault();
	if (confirm('Are you sure deleting this article?')) {
		axios
			.post(`/api/admin/removeArticle/${e.target.getAttribute('data-id')}`)
			.then((res) => {
				showAlert('success', res.data);
				setTimeout(() => {
					window.location.href = 'http://localhost:3000/api/admin/dashboardAdmin';
				}, 2000);
			})
			.catch((err) => {
				showAlert('danger', err.response.data);
			});
	}
});

// *******************************************************************************************************
// *******************************************************************************************************
// Remove comment
document.addEventListener('click', (e) => {
	e.preventDefault();
	if (e.target.classList.contains('removeComment')) {
		if (confirm('Are you sure deleting this comment?')) {
			axios
				.post(`/api/admin/removeComment/${e.target.getAttribute('data-id')}`)
				.then((res) => {
					showAlert('success', res.data);
					setTimeout(() => {
						location.reload();
					}, 2000);
				})
				.catch((err) => {
					showAlert('danger', err.response.data);
				});
		}
	}
});

// *******************************************************************************************************
// *******************************************************************************************************
// Functions

function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}
