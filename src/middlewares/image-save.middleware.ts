import multer from 'multer';

const imageSave = multer({
    storage: multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        var email = req.body.email || req.params.email;
        cb(null, `${email}.jpg`);
    }
})});

export default imageSave;