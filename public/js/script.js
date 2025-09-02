document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector(".searchBtn");
  const searchbar = document.querySelector(".searchBar");
  const searchClose = document.getElementById("close");

  // Open the search form
  searchBtn.addEventListener("click", () => {
    searchbar.style.display = "block"; // Show the search form
  });

  // Close the search form
  searchClose.addEventListener("click", () => {
    searchbar.style.display = "none"; // Hide the search form
  });
});
