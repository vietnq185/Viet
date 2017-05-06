// Usage:
// <TinyEditor ref={name} value={value} id={`myCoolEditor_${item.key}`} onEditorChange={content => console.log('editor content => %s: ', item.key, content)} />

import React, { Component } from 'react';
import tinymce from 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/table';
import 'tinymce/plugins/link';

class TinyEditor extends Component {
  constructor() {
    super();
    this.state = { editor: null };
  }
  componentDidMount() {
    tinymce.init({
      selector: `#${this.props.id}`,
      skin_url: `${process.env.PUBLIC_URL}/skins/lightgray`,
      plugins: 'wordcount table link',
      height: 400,
      setup: editor => {
        this.setState({ editor });
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.value = content;// update value
          if (this.props.onEditorChange) {
            this.props.onEditorChange(content);
          }
        });
      }
    });
  }

  componentWillUnmount() {
    tinymce.remove(this.state.editor);
  }

  render() {
    this.value = this.props.value;  // keep initial value, the this.value will be used in case we want to use the ref property
    return (
      <textarea id={this.props.id} defaultValue={this.props.value} />
    );
  }
}

export default TinyEditor;