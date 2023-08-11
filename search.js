// common stop words to be ignored in the search query
const stopWords = [
  "of",
  "the",
  "download",
  "in",
  "a",
  "an",
  "if",
  "for",
  "how",
  "to",
];

// fetch posts from JSON file
fetch("data2.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var posts = data.posts;

    // get references to the search box, clear button, and results list
    var searchBox = document.getElementById("search");
    var clearButton = document.getElementById("clear");
    var resultsList = document.getElementById("results");
    var numResults = 8; // maximum number of results to show at a time

    // listen for keyup events on the search box
    searchBox.addEventListener("keyup", function (event) {
      // clear the results list
      resultsList.innerHTML = "";

      // get the query the user typed
      var query = searchBox.value.trim().toLowerCase();

      // clear the clear button if there is no query
      if (query.length === 0) {
        clearButton.style.display = "none";
        return;
      }

      // show the clear button
      clearButton.style.display = "inline-block";

      // split the query into individual words
      var words = query.split(" ");

      // filter the words to remove stop words
      var filteredWords = words.filter(function (word) {
        return !stopWords.includes(word);
      });

      // filter the posts by the filtered query
      var filteredPosts = posts.filter(function (post) {
        var priority = 0;
        for (var i = 0; i < filteredWords.length; i++) {
          var word = filteredWords[i];
          if (post.title.toLowerCase().includes(word)) {
            priority += 3; // 3 priority points for the post with keyword in the title
          }
          if (post.description.toLowerCase().includes(word)) {
            priority += 1; // 2 priority points for the post with keyword in the description
          }
          if (post.keywords.join().toLowerCase().includes(word)) {
            priority += 2; // 1 priority point for the post with keyword in the keywords
          }
        }
        if (priority > 0) {
          post.priority = priority; // assign priority to the post
          return true;
        }
        return false; // exclude the post with no priority
      });

      // sort the filtered posts by priority in descending order
      filteredPosts.sort(function (a, b) {
        if (a.priority < b.priority) return 1;
        if (a.priority > b.priority) return -1;
        return 0;
      });

      // add the filtered posts to the results list
      var numMatches = Math.min(filteredPosts.length, numResults); // number of matches to show
      for (var i = 0; i < numMatches; i++) {
        var post = filteredPosts[i];

        var listItem = document.createElement("li");
        var link = document.createElement("a");
        link.href = post.url;
        link.className = "sr-item";
        listItem.appendChild(link);

        var logoContainer = document.createElement("div");
        logoContainer.className = "sr-logo";
        var logoSpan = document.createElement("span");
        logoSpan.className = "icon-file-text"; // icomoon icon class
        logoSpan.textContent = "";
        logoContainer.appendChild(logoSpan);
        link.appendChild(logoContainer);

        var detailContainer = document.createElement("div");
        detailContainer.className = "sr-detail";
        var title = document.createElement("p");
        title.textContent = post.title;
        var description = document.createElement("span");
        description.textContent = post.description;
        detailContainer.appendChild(title);
        detailContainer.appendChild(description);
        link.appendChild(detailContainer);

        resultsList.appendChild(listItem);
      }
    });

    // listen for click events on the clear button
    clearButton.addEventListener("click", function () {
      // clear the search box and results list, hide the clear button
      searchBox.value = "";
      resultsList.innerHTML = "";
      clearButton.style.display = "none";
    });
  });
