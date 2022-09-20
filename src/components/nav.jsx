import React from "react";
import imgUrl from "../assets/my_unsplash_logo.svg";
import { useMediaQuery } from "react-responsive";

function Nav({ handleAddPhoto, handleSearchInput, searchInput }) {
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

  return (
    <div className={`App ${screen()}`}>
      <div className={`logo ${screen()}`}>
        <img src={imgUrl} alt="" />
        <div className="input">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            onChange={handleSearchInput}
            value={searchInput}
            placeholder="Search by name"
          />
        </div>
      </div>
      <button onClick={handleAddPhoto}>Add a Photo</button>
    </div>
  );
}

export default Nav;
