import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import ImagesZoom from "./ImagesZoom";

const PostImages = ({ images }) => {
  const [showImagesZoom, setImageseZoom] = useState(false);
  const onZoom = useCallback(() => {
    setImageseZoom(true);
  }, []);
  const onClose = useCallback(() => {
    setImageseZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <img
          role="presentation"
          style={{ maxHeight: "200px" }}
          src={`http://localhost:3065/${images[0].src}`}
          alt={`http://localhost:3065/${images[0].src}`}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          role="presentation"
          style={{ width: "50%", display: "inline-block" }}
          src={`http://localhost:3065/${images[0].src}`}
          alt={`http://localhost:3065/${images[0].src}`}
          onClick={onZoom}
        />
        <img
          role="presentation"
          style={{ width: "50%", display: "inline-block" }}
          src={`http://localhost:3065/${images[1].src}`}
          alt={`http://localhost:3065/${images[1].src}`}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  return (
    <>
      <img
        role="presentation"
        style={{ width: "50%", display: "inline-block" }}
        src={`http://localhost:3065/${images[0].src}`}
        alt={`http://localhost:3065/${images[0].src}`}
        onClick={onZoom}
      />
      <div
        role="presentation"
        style={{
          display: "inline-block",
          width: "50%",
          textAlign: "center",
          verticalAlign: "middle",
        }}
        onClick={onZoom}
      >
        <PlusOutlined />
        <br />
        {images.length - 1}개의 사진 더보기
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
