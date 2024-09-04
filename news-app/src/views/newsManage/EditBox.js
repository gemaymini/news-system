import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditBox(props) {
    const [editorState, setEditorState] = useState('');

    useEffect(() => {
        if (props.content !== "") {
            setEditorState(props.content);
        } else {
            setEditorState('');
        }
    }, [props.content]);

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'align': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'align',
        'color', 'background',
        'script',
        'link', 'image'
    ];

    return (
        <ReactQuill
            value={editorState}
            onChange={(value) => {
                setEditorState(value);
                props.done(value);
            }}
            modules={modules}
            formats={formats}
            placeholder="请输入内容..."
        />
    )
}
