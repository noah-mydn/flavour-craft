const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flavourCraft_posts",
    allowedFormats: ["jpg", "png", "jpeg", "gif"],
    transformation: [
      {
        width: 500,
        height: 500,
        crop: "pad",
      },
    ],
  },
});

const cloudinaryUpload = multer({ storage: cloudinaryStorage });
module.exports = { cloudinaryUpload };
