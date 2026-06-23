import multer from 'multer';

const storage = multer.memoryStorage(); // we work with buffer → no temp files
const upload = multer({ storage });

export default upload;