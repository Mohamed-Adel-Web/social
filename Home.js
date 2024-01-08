/** @format */
let currentPage = 1;
let lastPage = 1;
let loginUrl = "https://tarmeezacademy.com/api/v1/login";
let registerUrl = "https://tarmeezacademy.com/api/v1/register";
let createPostUrl = "https://tarmeezacademy.com/api/v1/posts";
let loginBtn = document.querySelector(".modal-footer .btn-primary");
let userInfoContainer = document.querySelector(".user-info");
let registerBtn = document.querySelector(".modal-footer.reg .btn-primary");
let postsContainer = document.querySelector(".posts .container");
let token = window.localStorage.getItem("token");
let modal = document.getElementById("loginModal");
let regModal = document.getElementById("registerModal");
let createModal = document.getElementById("createPostModal");
let editModal = document.getElementById("editPostModal");
let deleteModal = document.getElementById("deletePostModal");
let loginNavBtn = document.querySelector(".login");
let registerNavBtn = document.querySelector(".register");
let logoutNavBtn = document.querySelector(".logout");
let addPost = document.querySelector(".add-post");
let createPostIcon = document.querySelector(".modal-footer.cre .btn-primary");
let editModalButton = document.querySelector(".modal-footer.edi .btn-primary");
let deleteModalButton = document.querySelector(".modal-footer.dle .btn-danger");
let editedPostId = "";
let deletePostId = "";

getPosts();
function getPosts() {
  loader(true);
  let postsUrl = `https://tarmeezacademy.com/api/v1/posts?limit=10&page=${currentPage}`;
  axios
    .get(`${postsUrl}`)
    .then((response) => {
      if (currentPage == 1) {
        postsContainer.innerHTML = "";
      }
      let posts = response.data.data;
      lastPage = response.data.meta.last_page;
      for (element of posts) {
        let postTitle = "";
        let editContent = "";
        let deleteContent = "";
        if (element.title != null) {
          postTitle = element.title;
        }
        if (
          window.localStorage.getItem("token") != null &&
          JSON.parse(window.localStorage.getItem("user")).id ==
            element.author.id
        ) {
          editContent = `<button class="edit-button ms-3 btn btn-secondary float-end"
          onclick="postEdit('${encodeURIComponent(JSON.stringify(element))}')"
          data-bs-toggle="modal"
         data-bs-target="#editPostModal"
         data-bs-whatever="@mdo">edit</button>`;
          deleteContent = `<button class="delete-button btn btn-danger float-end"
          onclick="postDelete(${element.id})"
          data-bs-toggle="modal"
         data-bs-target="#deletePostModal"
         data-bs-whatever="@mdo">delete</button>`;
        } else {
          editContent = "";
          deleteContent = "";
        }
        let content = `<div class="post my-4">
        <div class="row justify-content-center">
          <div class="col-9">
            <div class="card">
              <div class="card-header">
              <div class="profile-userPage" onclick="userProfilePage(${element.author.id})">
                <span
                  ><img
                    src="${element.author.profile_image}"
                    class="img-fluid"
                    alt=""
                /></span>
                <span>${element.author.username}</span>
                </div>
${editContent}
${deleteContent}
              </div>
              <div class="card-body">
                <div class="post-img mb-2">
                  <img
                    src="${element.image}"
                    class="img-fluid w-100"
                    alt=""
                  />
                </div>
                <div class="post-time text-black-50">${element.created_at}</div>
                <h5 class="card-title">${postTitle}</h5>
                <p class="card-text">
${element.body}
                </p>
                <div class="comments d-flex border-top pt-3">
                <div class="comments-holder d-flex " onclick="commentClicked(${element.id})">

                  <img src="./image/pen.svg" alt="" class="img-fluid" />
                  <span class="number-of-comment mx-1">(${element.comments_count})</span>Comments
</div>
                  </.div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
        postsContainer.innerHTML += content;
      }
      setupLogin();
    })
    .catch(function (error) {
      showAlert(error, "danger");
    })
    .finally(() => {
      loader(false);
    });
}
function login(loginApiUrl) {
  loader(true);
  axios
    .post(loginApiUrl, {
      username: `${
        document.querySelector(".modal-body.log input[type=text]").value
      }`,
      password: `${
        document.querySelector(".modal-body.log input[type=password]").value
      }`,
    })
    .then(function (response) {
      window.localStorage.setItem("token", response.data.token);
      window.localStorage.setItem("user", JSON.stringify(response.data.user));
      bootstrap.Modal.getInstance(modal).hide();
      setupLogin();
      showAlert("user logged in  successfully");
      profileData();
      currentPage = 1;
      getPosts();
    })
    .catch(function (error) {
      showAlert(`error: ${error.response.data.message}`, "danger");
    })
    .finally(() => {
      loader(false);
    });
}
loginBtn.addEventListener("click", () => {
  login(loginUrl);
});
function setupLogin() {
  token = window.localStorage.getItem("token");
  if (token != null) {
    loginNavBtn.style.display = "none";
    registerNavBtn.style.display = "none";
    logoutNavBtn.style.display = "flex";
    addPost.style.display = "flex";
    userInfoContainer.style.display = "inline-flex";
    document.querySelector(".profile-href").style.display = "block";
  } else {
    loginNavBtn.style.display = "flex";
    registerNavBtn.style.display = "flex";
    logoutNavBtn.style.display = "none";
    addPost.style.display = "none";
    userInfoContainer.innerHTML = "";
    document.querySelector(".profile-href").style.display = "none";
  }
}
logoutNavBtn.addEventListener("click", () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  setupLogin();
  showAlert("user logged out successfully", "danger");
  currentPage = 1;
  getPosts();
});

function register(registerApiUrl) {
  loader(true);
  let name = document.querySelector(".modal-body.reg #reg-name").value;
  let username = document.querySelector(".modal-body.reg #regUser-name").value;
  let password = document.querySelector(
    ".modal-body.reg input[type=password]"
  ).value;
  let image = document.getElementById("reg-image").files[0];
  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("image", image);
  formData.append("password", password);
  axios
    .post(registerApiUrl, formData)
    .then(function (response) {
      window.localStorage.setItem("token", response.data.token);
      window.localStorage.setItem("user", JSON.stringify(response.data.user));
      bootstrap.Modal.getInstance(regModal).hide();
      setupLogin();
      showAlert("New user Registered successfully");
      profileData();
    })
    .catch(function (error) {
      showAlert(`error: ${error.response.data.message}`, "danger");
    })
    .finally(() => {
      loader(false);
    });
}
registerBtn.addEventListener("click", () => {
  register(registerUrl);
});
function createPost(createPostApiUrl) {
  loader(true);
  postsContainer.innerHTML = "";
  let title = document.querySelector("#post-title").value;
  let body = document.querySelector("#post-body").value;
  let image = document.querySelector("#post-image").files[0];
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);
  let headers = {
    authorization: `Bearer ${window.localStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  };
  axios
    .post(createPostApiUrl, formData, {
      headers: headers,
    })
    .then(function (response) {
      bootstrap.Modal.getInstance(createModal).hide();
      showAlert("New post has been added successfully");
      currentPage = 1;
      getPosts();
    })
    .catch(function (error) {
      showAlert(`error: ${error.response.data.message}`, "danger");
    })
    .finally(() => {
      loader(false);
    });
}
createPostIcon.addEventListener("click", () => {
  createPost(createPostUrl);
});
function loader(show = true) {
  if (show) {
    document.querySelector(".loader").style.visibility = "visible";
  } else {
    document.querySelector(".loader").style.visibility = "hidden";
  }
}

function profileData() {
  if (window.localStorage.getItem("token") != null) {
    let userData = JSON.parse(window.localStorage.getItem("user"));
    let content = `<li class="nav-item ">
  <img src="${userData.profile_image}" class="profile-image" alt="">
                </li>
                <li class="nav-item ">
                  <button type="button" class="profile-username btn  my-2 me-2 fw-bold   text-black">
${userData.username}
                  </button>
                </li>`;
    userInfoContainer.innerHTML = content;
  } else {
    return;
  }
  setupLogin();
}
profileData();
window.onscroll = function () {
  if (
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight&&
    currentPage <= lastPage
  ) {
    currentPage++;
    getPosts();
  }
};

function postEdit(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  document.getElementById("edit-title").value = post.title;
  document.getElementById("edit-body").value = post.body;
  editedPostId = post.id;
}
function PostEditRequest(id) {
  loader(true);
  let title = document.querySelector("#edit-title").value;
  let body = document.querySelector("#edit-body").value;
  let image = document.querySelector("#edit-image").files[0];
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);
  formData.append("_method", "put");
  let headers = {
    authorization: `Bearer ${window.localStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  };
  axios
    .post(`https://tarmeezacademy.com/api/v1/posts/${id}`, formData, {
      headers: headers,
    })
    .then((response) => {
      bootstrap.Modal.getInstance(editModal).hide();
      showAlert(" post has been edited successfully");
      currentPage = 1;
      getPosts();
    })
    .catch((error) => {
      showAlert(`error: ${error.response.data.message}`, "danger");
    })
    .finally(() => {
      loader(false);
    });
}
editModalButton.addEventListener("click", () => {
  PostEditRequest(editedPostId);
});
function postDelete(id) {
  deletePostId = id;
}
deleteModalButton.addEventListener("click", () => {
  postDeleteRequest(deletePostId);
});
function postDeleteRequest(id) {
  loader(true);
  let headers = {
    authorization: `Bearer ${window.localStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  };
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${id}`, {
      headers: headers,
    })
    .then((response) => {
      bootstrap.Modal.getInstance(deleteModal).hide();
      showAlert(" post has been deleted successfully");
      currentPage = 1;
      getPosts();
    })
    .catch((error) => {
      showAlert(`error: ${error.response.data.message}`, "danger");
    })
    .finally(() => {
      loader(false);
    });
}
