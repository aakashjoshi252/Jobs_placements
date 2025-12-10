import { useState } from "react";
import {uploadApi} from "../../api/api";
export default function UploadImage() {
  const [image, setImage] = useState(null);
  const [imgUrl, setImgUrl] = useState("");

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("image", image);

    const res = await uploadApi.post("/save", formData);

    setImgUrl(res.data.file.url);
  };

  return (
    <div>
      <h3>Upload Image</h3>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button onClick={uploadImage}>Upload</button>

      {imgUrl && (
        <img
          src={imgUrl}
          alt="Uploaded"
          width={200}
          style={{ marginTop: "20px" }}
        />
      )}
    </div>
  );
}
