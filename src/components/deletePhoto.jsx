import React, { Component } from "react";
import { useMediaQuery } from "react-responsive";

const DeletePhoto = ({
  myref,
  handleCloseDelete,
  handleDelete,
  imageTobeDeleted,
  handleDeleteInput,
  deleteInput,
  handleDeleteDisabled,
  handleDeleteKeyDown,
}) => {
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 620px)" });

  function screen() {
    if (isMobile) {
      return "mobile";
    } else if (isTablet) {
      return "tablet";
    } else {
      return "";
    }
  }

  return (
    <div className="addPhoto-background" ref={myref}>
      <div className={`showDialogueBox ${screen()}`}>
        <h1>Are you sure?</h1>
        <p>
          To delete {imageTobeDeleted.label} type the label name{" "}
          <span>{imageTobeDeleted.label}</span>
        </p>
        <input
          type="text"
          onKeyDown={handleDeleteKeyDown}
          onChange={handleDeleteInput}
          value={deleteInput}
        />
        <div className="proceed-btn">
          <button onClick={handleCloseDelete}>Cancel</button>
          <button onClick={handleDelete} disabled={handleDeleteDisabled()}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePhoto;
