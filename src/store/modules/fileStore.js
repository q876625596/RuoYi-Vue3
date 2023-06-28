import {defineStore} from "pinia";

const useFileStore = defineStore(
    'file',
    {
        state: () => ({
            imageSuffixList: ["jpg", "jpeg", "png", "gif", "bmp", "ico", "jfif", "webp",],
            // suffixList: [
            //     // 图片
            //     "bmp", "gif", "jpg", "jpeg", "png",
            //     // word excel powerpoint
            //     "doc", "docx", "xls", "xlsx", "ppt", "pptx", "html", "htm", "txt",
            //     // 压缩文件
            //     "rar", "zip", "gz", "bz2",
            //     // 视频格式
            //     "mp4", "avi", "rmvb",
            //     // pdf
            //     "pdf"
            // ]
            suffixList: ["doc", "docx", "xls", "xlsx", "xlsm", "ppt", "pptx", "csv", "tsv", "dotm", "xlt", "xltm", "dot", "dotx", "xlam", "xla",
                "wps", "dps", "et", "ett", "wpt",
                "odt", "ods", "ots", "odp", "otp", "six", "ott", "fodt", "fods",
                "vsd", "vsdx",
                "wmf", "emf",
                "psd",
                "pdf", "ofd", "rtf",
                "xmind",
                "bpmn",
                "eml",
                "epub",
                "obj", "3ds", "stl", "ply", "gltf", "glb", "off", "3dm", "fbx", "dae", "wrl", "3mf", "ifc", "brep", "step", "iges", "fcstd", "bim",
                "dwg", "dxf",
                "txt", "xml", "md", "java", "kt", "cs", "dart", "swift", "php", "py", "js", "ts", "css", "html", "htm", "asp", "jsp", "json", "properties", "gitignore", "log", "c", "cpp", "sql", "sh", "bat", "m", "bas", "prg", "cmd",
                "zip", "rar", "jar", "tar", "gzip", "7z",
                "jpg", "jpeg", "png", "gif", "bmp", "ico", "jfif", "webp",
                "tif", "tiff",
                "tga",
                "svg",
                "mp3", "wav", "mp4", "flv",
                "avi", "mov", "rm", "webm", "ts", "rm", "mkv", "mpeg", "ogg", "mpg", "rmvb", "wmv", "3gp", "swf",
                "dcm",
                "drawio"
            ]
        }),
        actions: {}
    })

export default useFileStore
