import React from "react";

const UploadFile = () => {
  return (
    <div>
      <form
        action="/upload_studentData"
        method="POST"
        encType="multipart/form-data"
      >
        <input
          type="file"
          name="file"
          id="input-files"
          className="form-control-file border"
        />

        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default UploadFile;
