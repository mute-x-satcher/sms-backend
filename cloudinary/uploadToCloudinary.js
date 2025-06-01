const cloudinary = require('./config');
const bufferToStream = require('../utils/bufferToStream');

function uploadPDF(buffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'attendance_reports',
        overwrite: true,
        type: 'upload',
        invalidate: true,
        public_id: filename
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    bufferToStream(buffer).pipe(uploadStream);
  });
}

module.exports = uploadPDF;
