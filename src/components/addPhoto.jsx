import React from "react";
import { useMediaQuery } from "react-responsive";
import Spinner from "react-bootstrap/Spinner";

const AddPhoto = ({
  myref,
  handleClosePhotoAdder,
  handleLabel,
  handleUrl,
  handleFile,
  handleRemoveFile,
  labelError,
  urlError,
  enableSubmit,
  handleSubmit,
  showLoader,
  label,
  file,
  url,
}) => {
  const isTablet = useMediaQuery({ query: "(max-width: 768px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 400px)" });

  function screen() {
    if (isMobile) {
      return "mobile";
    } else if (isTablet) {
      return "tablet";
    } else {
      return "";
    }
  }

  const style = {
    color: "red",
  };

  return (
    <div className="addPhoto-background">
      <div className={`pop-up ${screen()}`}>
        <h1>Add a new photo</h1>
        <p className="label tags">
          Label (min: 5 characters, max: 50 characters){" "}
          <span style={style}>*</span>
        </p>
        <input
          type="text"
          onChange={handleLabel}
          value={label}
          placeholder="Mona lisa"
        />
        {label && labelError ? (
          <p className="errormessage">{labelError}</p>
        ) : null}
        <div className="photo-link">
          <p className="label tags">
            Photo (Jpg, Jpeg or png) <span style={style}>*</span>
          </p>
          {urlError ? <p className="errormessage">{urlError}</p> : null}
          <div className="photo-uploaders">
            <p className="tags">URL</p>
            <input
              type="text"
              onChange={handleUrl}
              value={url}
              disabled={file}
              placeholder="https://images.unsplash.com/photo-1584395630827-860eee694d7b?ixlib=r..."
            />
            <p>or</p>
            <p className="tags">Upload File</p>
            <div className={`upload-file ${screen()}`}>
              <input
                ref={myref}
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                className={screen()}
                onChange={handleFile}
                disabled={url}
              />
              {file && !showLoader? (
                <div onClick={handleRemoveFile} className="cancel-icon">
                  <i className="fa-solid fa-xmark"></i>
                  <span className={`tooltiptext ${screen()}`}>Remove file</span>
                </div>
              ): null}
            </div>
          </div>
        </div>
        <div className="proceed-btn">
          <button onClick={handleClosePhotoAdder}>Cancel</button>
          <button
            disabled={showLoader ? true : enableSubmit()}
            onClick={handleSubmit}
          >
            {showLoader && <Spinner animation="border" size="sm" />}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPhoto;
