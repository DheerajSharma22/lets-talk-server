const cloudinary = require('cloudinary').v2


exports.uploadFileToCloudinary = async (file, folder, height, quality) => {
    const options = {
        folder,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "auto",
    };


    return await cloudinary.uploader.upload(file.tempFilePath, options);
}