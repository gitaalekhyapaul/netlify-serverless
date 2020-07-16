const generateNote = (id, title, author, content) => {
  return `
  <div class="col mb-4">
          <input hidden value="${id}"/>
          <div class="card text-white bg-dark">
            <div class="card-header text-success">
              <h5 class="card-title font-weight-bold">${title}</h5>
              <span class="text-muted">${author}</span>
            </div>
            <div class="card-body">
              <p class="card-text">
                ${content}
              </p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-success w-30 editNote" type="button">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  class="bi bi-pencil-square"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
                Edit
              </button>
              <button class="btn btn-danger w-30 deleteNote" type="button">
                Delete
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  class="bi bi-trash-fill"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
          </div>
          
          `;
};

const patchFormData = (card, modal, submitEvent) => {
  let reqData = {};
  $(modal)
    .find("input:hidden, textarea")
    .each(function () {
      reqData[$(this).attr("name")] = $(this).val();
    });
  axios
    .patch("/api/note", reqData)
    .then((res) => {
      $(card).find(".card-text").text(reqData.content);
      let author = $(card).find("span[class=text-muted]").text();
      if (!author.endsWith("(edited)")) {
        $(card)
          .find("span[class=text-muted]")
          .text(author + " (edited)");
      }
      $(modal).modal("hide");
    })
    .catch((err) => {
      console.log(err.response);
      $(modal).find(".alert").removeAttr("hidden");
      const resData = err.response.data;
      $(modal).find(".alert").find("span:first").text(resData.error);
    });
  submitEvent.preventDefault();
};

const handleDelete = (e) => {
  const noteId = $(e.currentTarget)
    .parent()
    .parent()
    .parent()
    .find("input:hidden")
    .val();
  axios
    .delete("/api/note", {
      params: {
        id: noteId,
      },
    })
    .then((res) => {
      $(e.currentTarget).parents(".col").remove();
      $(".toast").toast("show");
    })
    .catch((err) => {
      if (
        window.confirm(
          `Error Occurred:: ${err.response.data.error}\nWould you like to try again?`
        )
      ) {
        handleDelete(e);
      }
    });
};

const handleEdit = (e) => {
  const noteId = $(e.currentTarget)
    .parent()
    .parent()
    .parent()
    .find("input:hidden")
    .val();
  const card = $(e.currentTarget).parents(".col");
  axios
    .get("/api/note", {
      params: {
        id: noteId,
      },
    })
    .then((res) => {
      const noteData = res.data.data;
      const modal = $("#noteModal").clone(true);
      $(modal).find("input").attr("disabled", "");
      $(modal).find("input").addClass("text-muted");
      $(modal).find("input[name=title]").val(noteData.title);
      $(modal).find("input[name=author]").val(noteData.author);
      $(modal)
        .find(".modal-body")
        .append(`<input hidden name="id" value="${noteId}"/>`);
      $(modal).find(".modal-title").text("Update Note");
      $(modal).find(".modal-footer").find("#newNoteButton").text("Update Note");
      $(modal).submit(function (ev) {
        patchFormData(card, modal, ev);
      });
      $(modal).modal("show");
    })
    .catch((err) => {
      console.log(err.response);
    });
};

const postFormData = (modal, e) => {
  let reqData = {};
  $(modal)
    .find("input, textarea")
    .each(function () {
      reqData[$(this).attr("name")] = $(this).val();
    });
  axios
    .post("/api/note", reqData)
    .then((res) => {
      const { _id, title, author, content } = res.data.data;
      $(".cardDeck").append(generateNote(_id, title, author, content));
      const newCard = $(".cardDeck").find("[class='col mb-4']").last();
      newCard.find("button.deleteNote").click(handleDelete);
      newCard.find("button.editNote").click(handleEdit);
      $(modal).modal("hide");
    })
    .catch((err) => {
      console.log(err.response);
      $(modal).find(".alert").removeAttr("hidden");
      const resData = err.response.data;
      $(modal).find(".alert").find("span:first").text(resData.error);
    });
  e.preventDefault();
};

$(document).ready(async function () {
  axios
    .get("/api/note")
    .then((res) => {
      const data = res.data.data;
      data.forEach((note) => {
        let { _id, title, author, content, timestamps } = note;
        if (timestamps.updatedAt) {
          author = author + " (edited)";
        }
        $(".cardDeck").append(generateNote(_id, title, author, content));
      });
      $("button.deleteNote").each(function (e) {
        $(this).click(handleDelete);
      });
      $("button.editNote").each(function (e) {
        $(this).click(handleEdit);
      });
      $(".loader").hide();
      $("#home-container").show();
    })
    .catch((err) => {
      alert("Some error occured! Please try later!");
      console.log(err);
    });

  $("#createNoteButton").on("click", function (e) {
    const userTitle = $(this).parent().find("input").val();
    $("#createNoteButton").parent().find("input").val("");
    const modal = $("#noteModal").clone(true);
    $(modal).find(".modal-title").text("New Note");
    $(modal).find(".modal-footer").find("#newNoteButton").text("New Note");
    $(modal).find("input:first").val(userTitle);
    $(modal)
      .find("#noteForm")
      .submit(function (e) {
        postFormData(modal, e);
      });
    $(modal).modal("show");
  });

  $("#newNoteTitle").on("keyup", function (e) {
    const inputValue = $(this).val().trim();
    if (inputValue === "") {
      $("#createNoteButton").attr("disabled", "");
    } else {
      $("#createNoteButton").removeAttr("disabled");
    }
  });
});
