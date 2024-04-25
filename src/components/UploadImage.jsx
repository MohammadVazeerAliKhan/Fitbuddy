import React, { useRef, useState } from "react";
import {toast } from 'react-toastify'
const UploadImage = ({ picUrl, changePicUrl }) => {
  const imgRef = useRef("");
  // const [pic, setPic] = useState(picUrl);
  console.log(import.meta.env.VITE_CLOUDINARY_URL);
  const PostDetails = (pics) => {
    if (!pics) {
      // return alert('Please select an Image!');
      return { message: "Please select an Image!" };
      // return toast({
      //     title: 'Please select an Image!',
      //     position: 'top-right',
      //     duration: 3000,
      //     status: 'warning',
      //     isClosable: true,
      // });
    }
    console.log(pics.type);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      // setLoading(true);
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "fitbuddy_images"); // present file name
      data.append("cloud_name", "fitbuddy"); // cloud project name
      const url = import.meta.env.VITE_CLOUDINARY_URL;
      return fetch(url, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // alert('Data receied');
          console.log("cloudinary data", data);
          // setPic(data.url);
          changePicUrl(data.secure_url);
          // setLoading(false);
          return data;
        })
        .catch((err) => {
          console.log("cloudinary error", err);
          return err;
          // setLoading(false);
        });
    } else {
      // alert('Please select an Image!');

      return { message: "Please select an Image!" };
      // toast({
      //     title: 'Please select an Image!',
      //     position: 'top-right',
      //     duration: 3000,
      //     status: 'warning',
      //     isClosable: true,
      // });
    }
  };

  const handleUpoad = (e) => {
    e.preventDefault();
    // console.log(imgRef.current);
    // console.log(imgRef.current.files);
    const res = PostDetails(imgRef.current.files[0]);
    res.then((data) => console.log("tesinf", data));
    res.catch((err) => console.log(err));
  };

  const handleCompareImgSize = (e) => {
    let size = e.target.files[0].size / 1024 ** 2;
    const MB = 1;
    console.log(size.toFixed(2));
    if (size.toFixed(2) > MB) {
        toast.warn('Size must be less than 1MB');
        e.target.value = '';
    }
  };

  return (
    <div
      style={{
        minWidth: "300px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center'
      }}
    >
      <img src={picUrl? picUrl: '/Assets/Images/groupimage.png'} alt="Image" srcSet="" height="100px" width="100px" />
      <form
        action=""
        method="post"
        onSubmit={handleUpoad}
        style={{ width: "100%",display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: '0.5rem',
        alignItems: 'center' }}
      >
        {/* <input
          ref={imgRef}
          type="file"
          required
          id=""
          style={{
            borderRadius: "1rem",
            border: "2px solid grey",
            minWidth: "200px",
            width: "80%",
            margin: 'auto',
          }}
        /> */}
        <input
                    ref={imgRef}
                    type="file"
                    required
                    accept="image/*"
                    id=""
                    onChange={(e) => handleCompareImgSize(e)}
                    style={{
                        borderRadius: '1rem',
                        border: '2px solid grey',
                        minWidth: '200px',
                        width: '80%',
                        margin: 'auto',
                    }}
                />
        <p>
          <small style={{ fontSize: "0.6rem" }}>
            *Note: Kindly upload the image
          </small>
        </p>
        <button
          style={{
            padding: "0.1rem 1rem",
            borderRadius: "0.5rem",
            color: "black",
            fontWeight: "bold",
            backgroundColor: "grey",
          }}
          type="submit"
        >
          {" "}
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadImage;
