document.addEventListener('click', (e) => {
	e.preventDefault();
	if (e.target.parentElement.classList.contains('clickable-rows')) {
		window.location.href = e.target.parentElement.getAttribute('data-href');
	}
});
// *******************************************************************************************************
// *******************************************************************************************************
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
