import React, { useState } from 'react'

import { Editor as TextEditor} from 'primereact/editor';
        
const Editor = ({text, setText}) => {
  return (
    <div className="card">
    <TextEditor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} />
</div>
  )
}

export default Editor