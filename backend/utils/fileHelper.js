const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
    if (!filePath) return;

    // Convert to absolute path if it's relative
    const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(__dirname, '..', filePath);

    fs.access(absolutePath, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.unlink(absolutePath, (err) => {
                if (err) console.error(`Error deleting file: ${absolutePath}`, err);
                else console.log(`Successfully deleted file: ${absolutePath}`);
            });
        }
    });
};

module.exports = { deleteFile };
