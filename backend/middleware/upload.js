const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = (folderName) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, `../uploads/${folderName}`);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"), false);
};

exports.uploadProfilePic = multer({
  storage: storage("profilePics"),
  fileFilter,
});

exports.uploadEventImage = multer({
  storage: storage("events"),
  fileFilter,
});

exports.uploadJobImage = multer({
  storage: storage("jobs"),
  fileFilter,
});
