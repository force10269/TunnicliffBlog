// All of this is taken from https://codesandbox.io/s/react-quill-editor-with-image-resize-kv7u2f?file=/src/Editor.js
// Some of this is changed, but most of it is from the source shown

import { Component } from "react";
import hljs from "highlight.js";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/monokai-sublime.css";

import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorHtml: this.props.content };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(html) {
    this.props.onChange(html);
  }

  render() {
    return (
      <ReactQuill
        theme={this.state.theme}
        onChange={this.props.onChange}
        value={this.props.content}
        modules={Editor.modules}
        formats={Editor.formats}
        bounds={"#root"}
        placeholder={this.props.placeholder}
        style={{ height: "30vh" }}
      />
    );
  }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  toolbar: {
    container: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["code-block", "clean"],
    ],
  },
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"],
  },
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "code-block",
];

export default Editor;
