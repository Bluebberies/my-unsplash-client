import React from "react";
import { useMediaQuery } from "react-responsive";

const PhotGrid = ({ handleShowDelete, allImageData, handleLinkCopy }) => {
  const isTablet = useMediaQuery({ query: "(max-width: 768px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 425px)" });

  function screen() {
    if (isMobile) {
      return "mobile";
    } else if (isTablet) {
      return "tablet";
    } else {
      return "";
    }
  }

  function styles(index) {
    if (index > 0 && index % 2 === 0 && index % 4 !== 0) {
      return {
        gridColumn: "3",
        gridRow: `${index / 2} / span 2`,
        height: "100%",
      };
    } else if (index > 0 && index % 2 === 0 && index % 4 === 0) {
      return {
        gridColumn: "1/span 2",
        gridRow: `${index / 4 + 1}`,
        height: "100%",
      };
    } else {
      return null;
    }
  }

  function stylesHeight(index) {
    if (index > 0 && index % 2 === 0 && index % 4 !== 0) {
      return {
        height: "100%",
        width: "100%",
        borderRadius: "16px",
      };
    } else {
      return {
        width: "100%",
        height: "15rem",
        borderRadius: "16px",
      };
    }
  }

  const vidStyle = (index) => {
    if (index > 0 && index % 2 === 0 && index % 4 !== 0) {
      return {
        height: "100%",
        width: "100%",
        objectFit: "fill",
        borderRadius: "16px",
      };
    } else {
      return {
        width: "100%",
        height: "15rem",
        objectFit: "fill",
        borderRadius: "16px",
      };
    }
  };

  function isImage(item, index) {
    if (/\.(jpg|jpeg|png)$/.test(item.url)) {
      return (
        <img src={item.url} alt="image_links" style={stylesHeight(index)} />
      );
    } else if (/\.(mp4|3gp|ogg)$/.test(item.url)) {
      return (
        <video
          src={item.url}
          autoPlay
          loop
          muted
          style={vidStyle(index)}
        ></video>
      );
    }
  }

  return allImageData.length ? (
    <div className={`gallery ${screen()}`}>
      {allImageData.map((item, index) => (
        <div className="grid-item" key={index} style={styles(index)}>
          <button onClick={() => handleLinkCopy(item)}>Copy link</button>
          <button onClick={() => handleShowDelete(item)}>delete</button>
          {isImage(item, index)}
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  ) : (
    <h3>Empty Collection!</h3>
  );
};

export default PhotGrid;
