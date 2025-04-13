const crypto = require("crypto");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/uploads");
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(12, (err, buffer) => {
            let filename = buffer.toString("hex") + path.extname(file.originalname);
            cb(null, filename);
        })
    }
})

const upload = multer({storage: storage});


module.exports = upload;