const cloudinary = require("cloudinary").v2; //! Cloudinary is being required

exports.cloudinaryConnect = async() => {
	try {
		await cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.SECRET_KEY,
		});
		console.log("Connected with cloudinary...");
	} catch (error) {
		console.log(error);
	}
};