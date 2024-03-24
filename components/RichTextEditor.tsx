import dynamic from 'next/dynamic';
import React, { useEffect, useState, useRef } from "react";
import 'react-quill/dist/quill.snow.css';
import Quill, { RangeStatic } from 'quill';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  text: string;
  onTextChange: (newText: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ text, onTextChange }) => {
  const handleChange = (content: string) => {
    onTextChange(content);
  };

  const handleChangeSelection = (selectionInfo : any) => {
    // if (selection) {
    //   const selectedText = quillRef.current?.getSelection()?.index !== undefined ?
    //     quillRef.current.getText(selection.index, selection.length) :
    //     '';
    //   console.log(quillRef.current?.getSelection());
    console.log(selectionInfo)
  };

  const quillRef = React.useRef<Quill>();
  
  return (
    <ReactQuill 
      value={text} 
      onChange={handleChange} 
      onChangeSelection={handleChangeSelection}
    />
  );
};

export default RichTextEditor;
