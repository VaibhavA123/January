const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
    cloud_name : process.env.CLOUD_NAME,
});

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'v123_dev',
        alloweredFormats : ['jpg','png','jpeg'],
    }
});

module.exports = {
    cloudinary,
    storage,
}