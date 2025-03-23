const multer = require('multer');
const path = require('path');
const stringRandom = require('string-random');  // 生成随机字符串

// 存储引擎配置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 确保保存到正确的路径
        const uploadPath = path.join(__dirname, '../uploads');
        cb(null, uploadPath);  // 上传路径
    },
    filename: function (req, file, cb) {
        // 使用随机字符串防止文件名冲突
        const extname = path.extname(file.originalname);
        const filename = stringRandom(24, { numbers: true }) + extname;
        cb(null, filename);  // 文件名
    }
});

// 文件过滤器，确保上传的文件格式正确
function fileFilter(req, file, cb) {
    const extname = path.extname(file.originalname);
    const allow = '.jpeg|.png|.jpg';
    if (allow.includes(extname)) {
        cb(null, true);  // 文件格式合法，允许上传
    } else {
        cb(new Error('仅支持 .jpeg, .png, .jpg 格式的文件'));  // 不支持的格式
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
