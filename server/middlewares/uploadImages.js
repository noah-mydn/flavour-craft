const { cloudinaryUpload } = require("./multer");

const uploadPostImages = (req, res, next) => {
  if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
    cloudinaryUpload.array("images", 5)(req, res, next);
  } else {
    next();
  }
};

module.exports = { uploadPostImages };
