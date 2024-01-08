/** @format */
function commentClicked(id) {
  window.location = `PostDetails.html?postId=${id}`;
}
function showAlert(message, type = "success") {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const Alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
    setTimeout(() => {
      let allAlert = document.querySelectorAll(".alert");
      allAlert.forEach((element) => {
        element.style.display = "none";
      });
    }, 3000);
  };

  Alert(message, type);
}
function userProfilePage(id) {
  window.location = `profile.html?postId=${id}`;
}
