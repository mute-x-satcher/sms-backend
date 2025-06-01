const cloudinary = require('./config'); // your Cloudinary config

function deletePDFByUrl(fileUrl) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(fileUrl);
      const parts = url.pathname.split('/');

      // Find the index of your folder (e.g., 'attendance_reports')
      const folderIndex = parts.findIndex(part => part === 'attendance_reports');

      // Extract everything from folder to filename, including extension
      const publicId = parts.slice(folderIndex).join('/'); // this keeps .pdf

      cloudinary.uploader.destroy(publicId, { resource_type: 'raw', invalidate: true }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = deletePDFByUrl