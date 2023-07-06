import ImageData from './ImageData';

class ImageDropAndPaste {
    private quill: any;

    private options: any;

    constructor(quill: any, options: any) {
        this.quill = quill;
        this.options = options;
        this.handleDrop = this.handleDrop.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        this.quill.root.addEventListener('drop', this.handleDrop, false);
        this.quill.root.addEventListener('paste', this.handlePaste, false);
    }

    /* handle image drop event
     */
    handleDrop(e: any) {
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
            if (document.caretRangeFromPoint) {
                const selection = document.getSelection();
                const range = document.caretRangeFromPoint(e.clientX, e.clientY);
                if (selection && range) {
                    selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset);
                }
            }
            console.log('this1', this);

            this.readFiles(
                e.dataTransfer.files,
                (dataUrl: any, type: any) => {
                    type = type || 'image/png';
                    if (typeof this.options.handler === 'function') {
                        const result = this.options.handler.call(this, dataUrl, type, new ImageData(dataUrl, type), (newDataUrl: any) => {
                            console.log('Callback...');
                            console.log(dataUrl.length);
                            console.log(newDataUrl.length);
                            console.log('this3', this);
                            this.insert.call(this, newDataUrl, type);
                        });
                        console.log(result);
                    } else {
                        console.log('this2', this);
                        this.insert.call(this, dataUrl, type);
                    }
                },
                e
            );
        }
    }

    /* handle image paste event
     */
    handlePaste(e: any) {
        if (e.clipboardData && e.clipboardData.items && e.clipboardData.items.length) {
            this.readFiles(
                e.clipboardData.items,
                (dataUrl: any, type: any) => {
                    type = type || 'image/png';
                    if (typeof this.options.handler === 'function') {
                        this.options.handler.call(this, dataUrl, type, new ImageData(dataUrl, type));
                    } else {
                        this.insert(dataUrl, type);
                    }
                },
                e
            );
        }
    }

    /* read the files
     */
    readFiles = (files: any, callback: any, e: any) => {
        [].forEach.call(files, (file: any) => {
            const type = file.type;
            if (!type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i)) return;
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = (event) => {
                callback(event.target?.result, type);
            };
            const blob = file.getAsFile ? file.getAsFile() : file;
            if (blob instanceof Blob) reader.readAsDataURL(blob);
        });
    };

    /* insert into the editor
     */
    insert(dataUrl: any, type: any) {
        const index = (this.quill.getSelection() || {}).index || this.quill.getLength();
        this.quill.insertEmbed(index, 'image', dataUrl, 'user');
    }

    static ImageData = ImageData; // ImageData를 ImageDropAndPaste의 정적 속성으로 설정
}

export default ImageDropAndPaste;
