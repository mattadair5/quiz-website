document.addEventListener("DOMContentLoaded", function() {
  const dropdownTriggers = document.getElementsByClassName("dropdown-trigger");
  for (let i = 0; i < dropdownTriggers.length; i++) {
    const dropdownTrigger = dropdownTriggers[i];
    const target = dropdownTrigger.dataset.dropdownTarget;

    const dropdowns = document.getElementsByClassName(target);

    for (let i = 0; i < dropdowns.length; i++) {
      const dropdown = dropdowns[i];
      dropdownTrigger.addEventListener("click", function() {
        dropdown.classList.toggle("visible");
        dropdownTrigger.classList.toggle("active");
      });
    }
  }

  const invisibleTrigger = document.getElementsByClassName(
    "invisible-trigger"
  )[0];

  invisibleTrigger.addEventListener("click", function() {
    const elements = document.querySelectorAll(".navBar li");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("visible");
    }
    const elements2 = document.querySelectorAll(".navbar .shownav ul");
    for (let i = 0; i < elements2.length; i++) {
      elements2[i].classList.remove("visible");
    }
  });

  var modal = document.getElementById("modalLogin");

  var btn = document.getElementById("login");

  btn.onclick = function() {
    modal.style.display = "block";
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      registerError.innerHTML = "";
      loginError.innerHTML = "";
    }
  };

  var loginForm = document.getElementById("loginForm");
  var registerForm = document.getElementById("registerForm");
  var switchForm = document.getElementById("switchForm");

  var registerButton = document.querySelector("#registerForm button");
  var loginButton = document.querySelector("#loginForm button");
  var registerError = document.getElementsByClassName("registerError")[0];
  var loginError = document.getElementsByClassName("loginError")[0];

  switchForm.onclick = function() {
    registerError.innerHTML = "";
    loginError.innerHTML = "";
    if (loginForm.style.display === "flex") {
      loginForm.style.display = "none";
      registerForm.style.display = "flex";
      switchForm.innerHTML = "Already have an account? Login now!";
    } else {
      loginForm.style.display = "flex";
      registerForm.style.display = "none";
      switchForm.innerHTML = "Not registered? Create an account.";
    }
  };

  registerButton.onclick = () => {
    var username = document.querySelector("#registerForm .user").value;
    var password = document.querySelector("#registerForm .pass").value;

    axios
      .post("http://localhost:5432/register", { username, password })
      .then(res => {

        if (res.data.error) {
          registerError.innerHTML = res.data.error;
        } else {
          modal.style.display = "none";
          console.log("Account created successfully!");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  loginButton.onclick = () => {
    var username = document.querySelector("#loginForm .user").value;
    var password = document.querySelector("#loginForm .pass").value;

    axios
      .get("http://localhost:5432/login", {params: { username, password }})
      .then(res => {
        if (res.data.error) {
          loginError.innerHTML = res.data.error;
        } else {
          modal.style.display = "none";
          document.querySelector(".navBar #login").textContent = username;
          console.log("Logged in!");
        }
      })
      .catch(err => {
        console.log(err);
      })
      .then(() => {

      })
  };
});
