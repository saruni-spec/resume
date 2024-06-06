var profileElement = document.getElementById("saruni");
var hobbiesElement = document.getElementById("hobbies");

profileElement.addEventListener("mouseover", function () {
  hobbiesElement.classList.remove("not-visible");
  hobbiesElement.classList.add("hobbies-visible");
  console.log("hovering");
});

profileElement.addEventListener("mouseout", function () {
  hobbiesElement.classList.remove("hobbies-visible");
  hobbiesElement.classList.add("not-visible");
  console.log("not hovering");
});
