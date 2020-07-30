document.getElementById('saveArticle').addEventListener('click', function (e) {
	e.preventDefault();
	axios
		.post('/api/articles/addArticle', {
			title: document.getElementById('articleTitle').value,
			body: document.getElementById('articleBody').value,
		})
		.then((res) => {
			showAlert('success', res.data);
			setTimeout(function () {
				window.location.href = '/api/user/dashboard';
			}, 3000);
		})
		.catch((err) => {
			showAlert('danger', err.response.data);
		});
});

function showAlert(type, message) {
	document.getElementById('alert').classList = `alert alert-${type}`;
	document.getElementById('alert').innerText = message;
}
