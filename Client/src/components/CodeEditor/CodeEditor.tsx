import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';

const CodeEditor = () => {
  // const handleEditorChange = (value: any, event: any) => {
  //   // here is the current value
  //   console.log('handleEditorChange value', value);
  //   console.log('handleEditorChange event', event);
  // };

  // function handleEditorDidMount(editor: any, monaco: any) {
  //   console.log('onMount: the editor instance:', editor);
  //   console.log('onMount: the monaco instance:', monaco);
  // }

  // function handleEditorWillMount(monaco: any) {
  //   console.log('beforeMount: the monaco instance:', monaco);
  // }

  // function handleEditorValidation(markers: any) {
  //   // model markers
  //   markers.forEach((marker: any) =>
  //     console.log('onValidate:', marker.message),
  //   );
  // }

  const monaco = useMonaco();

  useEffect(() => {
    // do conditional chaining
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    // or make sure that it exists by other ways
    if (monaco) {
      console.log('here is the monaco instance:', monaco);
    }
  }, [monaco]);

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      // onChange={handleEditorChange}
      // onMount={handleEditorDidMount}
      // beforeMount={handleEditorWillMount}
      // onValidate={handleEditorValidation}
    />
  );
};

export default CodeEditor;
