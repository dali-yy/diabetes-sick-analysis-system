/**
 * @abstract 调用文件下载接口，下载的文件名即为上传时的文件名，下载的文件将包含已经标记好的新闻类别信息
 * @param {filename} filename 要下载的文件名
 */
 export function download(filename) {
    window.location.href = `http://127.0.0.1:3000/multer/download?filename=${filename}`;
}