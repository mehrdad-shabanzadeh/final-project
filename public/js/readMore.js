const editArticle = document.getElementById('editArticle');
const deleteArticle = document.getElementById('deleteArticle');

editArticle.addEventListener('click', (e) => {
	e.preventDefault();
	axios
		.post(`/api/articles/editArticle/${e.target.getAttribute('data-id')}`)
		.then((res) => {
			alert('done');
		})
		.catch((err) => {
			alert('Error: line 12');
		});
});

deleteArticle.addEventListener('click', (e) => {
	e.preventDefault();
	if (confirm('Are you sure about deleting this article?')) {
		axios
			.delete(`/api/articles/deleteArticle/${e.target.getAttribute('data-id')}`)
			.then((res) => {
				alert('done');
			})
			.catch((err) => {
				alert('Error: line 24');
			});
	}
});
