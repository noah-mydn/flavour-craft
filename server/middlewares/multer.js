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

const profilePicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flavourCraft_profiles",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [
      {
        width: 300,
        height: 300,
        crop: "fill",
      },
    ],
  },
});

const recipeThumbnailStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flavourCraft_recipes",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [
      {
        width: 400,
        height: 400,
        crop: "fill",
      },
    ],
  },
});

const cloudinaryUpload = multer({ storage: cloudinaryStorage });
const profilePicUpload = multer({ storage: profilePicStorage });
const recipeImgUpload = multer({
  storage: recipeThumbnailStorage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
      return cb(
        new Error("Only image files (jpg, jpeg, png) are allowed!"),
        false
      );
    }
    cb(null, true);
  },
});

module.exports = { cloudinaryUpload, profilePicUpload, recipeImgUpload };
