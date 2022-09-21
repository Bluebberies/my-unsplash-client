import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import Joi from "joi";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { ToastContainer, toast } from "react-toastify";
import http from "./services/httpService";
import Footer from "./components/footer";
import Nav from "./components/nav";
import PhotGrid from "./components/photoGrid";
import AddPhoto from "./components/addPhoto";
import DeletePhoto from "./components/deletePhoto";
import { imageArr } from "./services/data";

const App = () => {
  const [showAddPhotoTab, setShowAddPhotoTab] = useState(
    () => JSON.parse(localStorage.getItem("showAddPhotoTab")) || false
  );
  const [showdeleteTab, setShowDeleteTab] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [labelError, setLabelError] = useState(null);
  const [urlError, setUrlError] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [allImageData, setAllImageData] = useState(
    () => JSON.parse(localStorage.getItem("allImageData")) || imageArr
  );
  const [allImageDataToDisplay, setAllImageDataToDisplay] = useState(
    () => JSON.parse(localStorage.getItem("allImageDataToDisplay")) || imageArr
  );
  const [searchInput, setSearchInput] = useState("");
  const [deleteInput, setDeleteInput] = useState("");
  const [imageTobeDeleted, setImageToBeDeleted] = useState(null);

  const isTablet = useMediaQuery({ query: "(max-width: 768px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 400px)" });

  const fileRef = useRef(null);

  const schema = Joi.object({
    label: Joi.string().min(5).max(50).required(),
  });

  const { error } = schema.validate({ label });

  function screen() {
    if (isMobile) {
      return "mobile";
    } else if (isTablet) {
      return "tablet";
    } else {
      return "";
    }
  }

  function handleLabel(e) {
    setLabel(e.target.value);
  }

  useEffect(() => {
    if (error) {
      setLabelError(error.details[0].message);
    } else {
      setLabelError(null);
    }
    2;
  }, [label]);

  useEffect(() => {
    try {
      if (url) {
        const isValidUrl = Boolean(new URL(url));
        if (isValidUrl) {
          setUrlError(null);
        }
      } else {
        setUrlError(null);
      }
    } catch (e) {
      setUrlError("Invalid URL");
    }
  }, [url]);

  useEffect(() => {
    localStorage.setItem(
      "allImageDataToDisplay",
      JSON.stringify(allImageDataToDisplay)
    );
  }, [allImageDataToDisplay]);

  useEffect(() => {
    localStorage.setItem("allImageData", JSON.stringify(allImageData));
  }, [allImageData]);

  useEffect(() => {
    localStorage.setItem("showAddPhotoTab", JSON.stringify(showAddPhotoTab));
  }, [showAddPhotoTab]);

  function handleUrl(e) {
    setUrl(e.target.value);
  }

  function handleFile(e) {
    setFile(e.target.files[0]);
  }

  function handleRemoveFile() {
    setFile(null);
    fileRef.current.value = null;
  }

  function enableSubmit() {
    if (
      (label && !labelError && url && !urlError) ||
      (label && !labelError && file)
    ) {
      return false;
    } else {
      return true;
    }
  }

  const serverUrl = import.meta.env.VITE_SERVER || "https://myunsplahproject.herokuapp.com/"
  async function handleSubmit() {
    try {
      setShowLoader(true);
      const fd = new FormData();
      !file ? fd.append("avatar", file) : fd.append("avatar", file, label);
      const { data } = file
        ? await http.post(serverUrl, fd)
        : await http.post(serverUrl, {
            label,
            url,
          });
      if (data.message || data.error) {
        setUrlError(
          "Something failed! (check the url/file type or your internet!)"
        );
        setShowLoader(false);
      } else {
        setAllImageData([data, ...allImageData]);
        setAllImageDataToDisplay([data, ...allImageData]);
        setUrlError(null);
        setShowLoader(false);
        handleClosePhotoAdder();
        toast.success("uploaded successfully");
      }
    } catch (ex) {
      setUrlError(
        "Something failed! (check the url/file type or your internet )"
      );
      setShowLoader(false);
    }
  }

  function handleAddPhoto() {
    setShowAddPhotoTab(true);
    disableBodyScroll(<AddPhoto />);
  }

  function handleClosePhotoAdder() {
    setShowAddPhotoTab(false);
    setFile(null);
    setLabel("");
    setUrl("");
    setLabelError(null);
    setUrlError(null);
    enableBodyScroll(<AddPhoto />);
    setShowLoader(false);
  }

  function handleShowDelete(item) {
    setImageToBeDeleted(item);
    setShowDeleteTab(true);
    disableBodyScroll(<DeletePhoto />);
  }

  function handleCloseDelete() {
    setImageToBeDeleted(null);
    setShowDeleteTab(false);
    enableBodyScroll(<DeletePhoto />);
  }

  function handleDeleteInput(e) {
    setDeleteInput(e.target.value);
  }

  function handleDeleteDisabled() {
    return !(deleteInput === imageTobeDeleted.label);
  }

  function handleDelete() {
    const newImageData = allImageData.filter(
      (item) => item.id !== imageTobeDeleted.id
    );
    setAllImageData(newImageData);
    setAllImageDataToDisplay(newImageData);
    handleCloseDelete();
    setDeleteInput("");
    toast.success("Deleted successfully!");
  }

  function handleDeleteKeyDown(e) {
    if (e.key === "Enter" && !handleDeleteDisabled()) {
      handleDelete();
    }
  }

  function handleSearchInput(e) {
    setSearchInput(e.target.value);
    const searchResult = allImageData.filter((item) =>
      item.label.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setAllImageDataToDisplay(searchResult);
  }

  function handleLinkCopy(item) {
    navigator.clipboard
      .writeText(item.url)
      .then(() => toast.success("Copied"))
      .catch((ex) => null);
  }

  return (
    <div className={`wrapper ${screen()}`}>
      <ToastContainer />
      <Nav
        handleAddPhoto={handleAddPhoto}
        handleSearchInput={handleSearchInput}
        searchInput={searchInput}
      />
      <PhotGrid
        handleShowDelete={handleShowDelete}
        allImageData={allImageDataToDisplay}
        handleLinkCopy={handleLinkCopy}
      />
      {showAddPhotoTab && (
        <AddPhoto
          myref={fileRef}
          handleClosePhotoAdder={handleClosePhotoAdder}
          handleLabel={handleLabel}
          handleUrl={handleUrl}
          handleFile={handleFile}
          handleRemoveFile={handleRemoveFile}
          labelError={labelError}
          urlError={urlError}
          enableSubmit={enableSubmit}
          handleSubmit={handleSubmit}
          showLoader={showLoader}
          label={label}
          file={file}
          url={url}
        />
      )}
      {showdeleteTab && (
        <DeletePhoto
          handleCloseDelete={handleCloseDelete}
          handleDelete={handleDelete}
          imageTobeDeleted={imageTobeDeleted}
          handleDeleteInput={handleDeleteInput}
          deleteInput={deleteInput}
          handleDeleteDisabled={handleDeleteDisabled}
          handleDeleteKeyDown={handleDeleteKeyDown}
        />
      )}
      <Footer />
    </div>
  );
};

export default App;
