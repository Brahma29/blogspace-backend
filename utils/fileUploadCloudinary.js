const cloudinary = require("cloudinary").v2;
const { badRequest } = require("./customErrors");

const uploadFile = async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  try {
    console.log(req.files);
    if (req.files) {
      const { file } = req.files;
      if (file) {
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        if (result) {
          req.file = result;
          next();
        } else {
          badRequest("Please check file");
        }
      }
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = uploadFile;
