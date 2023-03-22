// All of this is taken from https://codesandbox.io/s/react-quill-editor-with-image-resize-kv7u2f?file=/src/Editor.js
// Some of this is changed, but most of it is from the source shown

import { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorHtml: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(html) {
    this.setState({ editorHtml: html });
    this.props.onChange(html);
  }

  async imageHandler() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  
    input.onchange = async () => {
      const file = input.files[0];
      const url = await this.props.onImageUpload(file);
  
      if (url) {
        const range = this.quill.getSelection(true);
        this.quill.insertEmbed(range.index, "image", url);
        this.quill.setSelection(range.index + 1);
      }
    };
  }

  render() {
    return (
        <ReactQuill
            theme={this.state.theme}
            onChange={this.props.onChange}
            value={this.props.content}
            modules={Editor.modules}
            formats={Editor.formats}
            bounds={'#root'}
            placeholder={this.props.placeholder}
            style={{height: "30vh"}}
        />
    );
  }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
    toolbar: {
        container: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' }
            ],
            ['link', 'image', 'video'],
            ['clean']
        ],
        handlers: {
            image: function() {
            this.imageHandler();
            }
        }
    },
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false
    },
    imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
    }
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video'
];

export default Editor;