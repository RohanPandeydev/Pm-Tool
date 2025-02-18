import React, { useState } from 'react'

import { Editor as TextEditor} from 'primereact/editor';
        
const MultiEditor = ({text, setText,handleEditor,index}) => {
    const handleChange = (e) => {
        handleEditor(e.htmlValue, index);
      };
  return (
    <div className="card">
    <TextEditor value={text[index]?.notes} onTextChange={handleChange} style={{ height: '320px' }} toolbar={{ 
          options: ['bold', 'italic', 'underline', 'strikethrough', 'blockquote', 'list', 'bullet'] 
        }} />
</div>
  )
}

export default MultiEditor