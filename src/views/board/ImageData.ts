// interface Option {
//     maxWidth: any;
//     maxHeight: any;
//     quality: any;
// }

class ImageData {
    private dataUrl: any;

    private type: any;

    constructor(dataUrl: any, type: any) {
        this.dataUrl = dataUrl;
        this.type = type;
    }

    /* minify the image
     */
    minify = (options: any) =>
        new Promise((resolve, reject) => {
            const maxWidth = options.maxWidth || 800;
            const maxHeight = options.maxHeight || 800;
            const quality = options.quality || 0.8;
            if (!this.dataUrl) {
                reject(new Error('[error] QuillImageDropAndPaste: Fail to minify the image, dataUrl should not be empty.'));
                return;
            }
            const image = new Image();
            image.onload = () => {
                const width = image.width;
                const height = image.height;
                if (width > height && width > maxWidth) {
                    image.height = (height * maxWidth) / width;
                    image.width = maxWidth;
                } else if (height > maxHeight) {
                    image.width = (width * maxHeight) / height;
                    image.height = maxHeight;
                }
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(image, 0, 0, image.width, image.height);
                const canvasType = this.type || 'image/png';
                const canvasDataUrl = canvas.toDataURL(canvasType, quality);
                resolve(new ImageData(canvasDataUrl, canvasType));
            };
            image.src = this.dataUrl;
        });

    /* convert blob to file
     */
    toFile(filename: any) {
        if (!window.File) {
            console.error('[error] QuillImageDropAndPaste: Your browser does not support File API.');
            return null;
        }
        return new File([this.toBlob()], filename, { type: this.type });
    }

    /* convert dataURL to blob
     */
    toBlob() {
        const base64 = this.dataUrl.replace(/^[^,]+,/, '');
        const buff = this.binaryStringToArrayBuffer(atob(base64));
        return this.createBlob([buff], { type: this.type });
    }

    /* generate array buffer from binary string
     */
    binaryStringToArrayBuffer = (binary: any) => {
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const arr = new Uint8Array(buffer);
        let i = -1;
        while (i < len) {
            arr[i] = binary.charCodeAt(i);
            i += 1;
        }
        return buffer;
    };

    /* create blob
     */
    createBlob = (parts: any, properties: any) => {
        if (typeof properties === 'string') properties = { type: properties };
        try {
            return new Blob(parts, properties);
        } catch (e: any) {
            if (e.name !== 'TypeError') {
                throw e;
            }
            let Builder = null;
            if (typeof window.BlobBuilder !== 'undefined') {
                Builder = window.BlobBuilder;
            } else if (typeof window.MSBlobBuilder !== 'undefined') {
                Builder = window.MSBlobBuilder;
            } else if (typeof window.MozBlobBuilder !== 'undefined') {
                Builder = window.MozBlobBuilder;
            } else if (typeof window.WebKitBlobBuilder !== 'undefined') {
                Builder = window.WebKitBlobBuilder;
            }
            const builder = new Builder();
            for (let i = 0; i < parts.length; i += 1) {
                builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
        }
    };
}

export default ImageData;
