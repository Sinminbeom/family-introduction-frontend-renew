import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // useNavigate

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, TextField } from '@mui/material';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';

// third party
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
// import { ImageResize } from 'quill-image-resize-module-ts';
// import { ImageResize } from 'quill-image-resize-module';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import useAuth from 'hooks/useAuth';
import QuillImageDropAndPaste from './ImageDropAndPaste';

// ==============================|| SAMPLE PAGE ||============================== //

Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
Quill.register('modules/imageResize', ImageResize);

const BoardPage = () => {
    const theme = useTheme();
    const [id, setId] = useState<number>();
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const { user } = useAuth();
    const { state }: { state: any } = useLocation();
    const quillRef = useRef<ReactQuill>(null);
    // const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        const getBoard = await fetch(`http://localhost:8080/board/${state.id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await getBoard.json();
        if (results.status === 200) {
            setId(results.data.id);
            setText(results.data.text);
            setTitle(results.data.title);
        } else if (results.status !== 200) {
            console.log('실패');
        }
    }, [state]);

    useEffect(() => {
        if (state !== null) {
            fetchData();
        }
    }, [state, fetchData]);

    const handleTextChange = (value: string) => {
        setText(value);
        console.log(value);
    };

    const handleClick = async () => {
        if (id === undefined || id === null) {
            const createBoard = await fetch('http://localhost:8080/boards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, text, createUserId: user?.id, updateUserId: user?.id })
            });
            const results = await createBoard.json();
            if (results.status === 200) {
                console.log('성공');
            } else if (results.status !== 200) {
                console.log('실패');
            }
        } else {
            const updateBoard = await fetch('http://localhost:8080/boards', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, text, createUserId: user?.id, updateUserId: user?.id })
            });
            const results = await updateBoard.json();
            if (results.status === 200) {
                console.log('성공');
            } else if (results.status !== 200) {
                console.log('실패');
            }
        }
    };

    const imageHandler = () => {
        if (quillRef.current) {
            const range = quillRef.current.getEditor().getSelection();
            const formData = new FormData();
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*, video/*');
            input.click();
            // input.onChange() = function(); 안쓴이유는 모든 브라우저는 잘되는데 safari만 onChange 이벤트를 못씀
            input.addEventListener(
                'change',
                async () => {
                    if (input.files) {
                        if (range) {
                            const file = input.files[0];
                            console.log('User trying to uplaod this:', file);
                            formData.append('uploadFile', file);

                            const options = {
                                method: 'POST',
                                body: formData
                            };

                            try {
                                const response = await fetch('http://localhost:8080/upload', options);
                                const results = await response.json();
                                if (results.status === 200) {
                                    const link = results.data;
                                    if (file.type.includes('image/')) {
                                        quillRef.current?.getEditor().insertEmbed(range.index, 'image', link);
                                    } else {
                                        quillRef.current?.getEditor().insertEmbed(range.index, 'video', link);
                                    }
                                    quillRef.current?.getEditor().formatText(range.index, 1, 'width', '300px'); // to limit the width
                                    // if (isMobile) {
                                    //   quill.formatText(range.index, 1, 'width', '300px'); //to limit the width
                                    // }
                                } else if (results.status !== 200) {
                                    console.error('err', results.message);
                                }
                            } catch (err) {
                                console.error('err', err);
                            }
                        }
                    }
                },
                false
            );
        }
    };

    const imageHandler1 = (dataUrl: any, type: any, imageData: any, callback: any) => {
        imageData.minify({ maxWidth: 320, maxHeight: 320, quality: 0.7 }).then((miniImageData: any) => {
            console.log(typeof dataUrl);
            console.log(typeof miniImageData);
            console.log(typeof miniImageData.dataUrl);
            // const blob = miniImageData.toBlob();
            // const file = miniImageData.toFile("my_cool_image.png");
            // console.log(`type: ${type}`);
            // console.log(`dataUrl: ${dataUrl.length}`);
            // console.log(`blob: ${blob}`);
            // console.log(`miniImageData: ${miniImageData}`);
            // console.log(`file: ${file}`);
            // setImage({ type, dataUrl, blob, file });
            console.log('Calling...');
            // callback.call(this, miniImageData.dataUrl);
            callback.call(this, miniImageData.dataUrl);
        });
    };

    /**
     * Quill 에디터에서 사용하고싶은 모듈들을 설정한다.
     * useMemo를 사용해 modules를 만들지 않는다면 매 렌더링 마다 modules가 다시 생성된다.
     * 그렇게 되면 addrange() the given range isn't in document 에러가 발생한다.
     * -> 에디터 내에 글이 쓰여지는 위치를 찾지 못하는듯
     */
    const modules = useMemo(
        () => ({
            imageDropAndPaste: {
                handler: imageHandler1
            },
            toolbar: {
                container: [
                    // [{ 'font': [] }],
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                    ['link', 'image'],
                    [{ align: [] }, { color: [] }, { background: [] }], // dropdown with defaults from theme
                    ['clean']
                    // ['emoji'],
                ],
                handlers: {
                    // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
                    image: imageHandler
                }
            },
            imageResize: {
                handleStyles: {
                    backgroundColor: 'black',
                    border: 'none',
                    color: 'white'
                },
                modules: ['Resize', 'DisplaySize', 'Toolbar']
            }
        }),
        []
    );

    // 위에서 설정한 모듈들 foramts을 설정한다
    const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'image'];

    return (
        <MainCard
            title="게시글 작성"
            secondary={
                <Button color="primary" variant="contained" onClick={handleClick}>
                    <SaveTwoToneIcon fontSize="small" sx={{ mr: 0.75 }} />
                </Button>
            }
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Stack
                        spacing={gridSpacing}
                        sx={{
                            '& .quill': {
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50',
                                borderRadius: '12px',
                                '& .ql-toolbar': {
                                    bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : 'primary.light',
                                    borderTopLeftRadius: '12px',
                                    borderTopRightRadius: '12px'
                                },
                                '& .ql-container': {
                                    borderColor:
                                        theme.palette.mode === 'dark' ? `${theme.palette.dark.light + 20} !important` : 'primary.light',
                                    borderBottomLeftRadius: '12px',
                                    borderBottomRightRadius: '12px',
                                    '& .ql-editor': {
                                        minHeight: 135
                                    }
                                }
                            }
                        }}
                    >
                        <TextField id="outlined-required" label="title" value={title} onChange={(event) => setTitle(event.target.value)} />
                        <ReactQuill ref={quillRef} value={text} onChange={handleTextChange} formats={formats} modules={modules} />
                    </Stack>
                </Grid>
            </Grid>
            {/* <Typography variant="body2">
                Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif
                ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
                reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa
                qui officiate descent molls anim id est labours.
            </Typography> */}
        </MainCard>
    );
};

export default BoardPage;
