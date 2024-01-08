/** @format */
let postDetailsContainer = document.querySelector(".post-details .container");
let urlParam = new URLSearchParams(window.location.search);
let commentId = urlParam.get("postId");
postDetails();
function postDetails() {
  let targetPost = `https://tarmeezacademy.com/api/v1/posts/${commentId}`;
  axios
    .get(`${targetPost}`)
    .then((response) => {
      postDetailsContainer.innerHTML = "";
      let element = response.data.data;
      let postTitle = "";
      if (element.title != null) {
        postTitle = element.title;
      }
      let CommentsContainer = "";
      let comments = element.comments;
      for (ele of comments) {
        let commentContent = ` <div class="all-comment bg-secondary-subtle  ">
          <div class="container">
          <div class="user-comment py-2 border-light  border-top  ">
          <div class="user-comment-details d-flex align-items-center  ">
          <img src="${ele.author.profile_image}" alt="">
          <span class="comment-owner fw-bold ms-2">${ele.author.username}</span>
          </div>
            <div class="user-comment-body mt-3">${ele.body}</div>
              </div>
            </div>
          </div>`;
        CommentsContainer += commentContent;
      }
      postDetailsContainer.innerHTML = "";
      let content = `<div class="post ">
          <div class="row justify-content-center">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <span
                    ><img
                      src="${element.author.profile_image}"
                      class="img-fluid"
                      alt=""
                  /></span>
                  <span>${element.author.username}</span>
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
                  <div class="comments-holder d-flex " >

                    <img src="./image/pen.svg" alt="" class="img-fluid" />
                    <span class="number-of-comment mx-1">(${element.comments_count})</span>Comments
  </div>
                    </.div>
                </div>
              </div>
            </div>
            <div class=""comment-holder>
            ${CommentsContainer}
            </div>
            <div class="input-group border-primary mb-3 add-comment">

           <input id="comment-input" type="text" class="form-control" placeholder="add your comment">
<button class="btn btn-outline-primary " type="button" onclick="addComment()">send</button>
           </div>

        </div>`;
      postDetailsContainer.innerHTML = content;
      setupComment();
    })
    .catch(function (error) {
      showAlert(error,"danger");
    });
}
function addComment() {
  let addedCommentUrl = `https://tarmeezacademy.com/api/v1/posts/${commentId}/comments`;
  let commentBody = document.getElementById("comment-input").value;
  let headers = {
    authorization: `Bearer ${window.localStorage.getItem("token")}`,
  };
  axios
    .post(
      addedCommentUrl,
      { body: commentBody },
      {
        headers: headers,
      }
    )
    .then((response) => {
      postDetails();
      showAlert("Comment added successfully");
    })
    .catch((error) => {
      showAlert(`${error.response.data.message}`, "danger");
    });
}
function setupComment() {
  let token = window.localStorage.getItem("token");
  if (token != null) {
    document.querySelector(".add-comment").style.display = "flex";
  } else {
    document.querySelector(".add-comment").style.display = "none";
  }
}
