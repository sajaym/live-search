// fetch data from the JSON file
fetch('data.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    var posts = data.posts;

    // get references to the search box and results list
    var searchBox = document.getElementById('search');
    var resultsList = document.getElementById('results');

    // listen for keyup events on the search box
    searchBox.addEventListener('keyup', function() {
      // get the query the user typed
      var query = searchBox.value.trim().toLowerCase();

      // clear the results list
      resultsList.innerHTML = '';

      // filter the posts by the query
      var filteredPosts = posts.filter(function(post) {
        return post.title.toLowerCase().includes(query) || 
          post.description.toLowerCase().includes(query) ||
          post.keywords.includes(query);
      });

      // display the filtered posts in the results list
      if (filteredPosts.length == 0) {
        var noResultsMessage = document.createElement('li');
        noResultsMessage.textContent = 'No results found for "' + query + '".';
        resultsList.appendChild(noResultsMessage);
      } else {
        filteredPosts.forEach(function(post) {
          var postItem = document.createElement('li');
          var postLink = document.createElement('a');
          postLink.textContent = post.title;
          postLink.href = post.url;
          postItem.appendChild(postLink);

          // show post description below post title
          var postDescription = document.createElement('p');
          postDescription.textContent = post.description;
          postItem.appendChild(postDescription);

          resultsList.appendChild(postItem);
        });
      }
    });
  });