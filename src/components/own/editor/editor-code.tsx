import Editor, { OnMount } from "@monaco-editor/react";

interface EditorCodeProps {
   language?: string;
   code?: string;
   className?: string;
}

export default function EditorCode({ language = "html", code = "", className = "" }: EditorCodeProps) {

   const handleEditorMount: OnMount = (_editor, monaco) => {
      // Desactivar todas las validaciones
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
         noSemanticValidation: true,
         noSyntaxValidation: true,
         diagnosticCodesToIgnore: [7027, 6385], // opcional si quisieras ignorar códigos específicos
      });

      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
         noSemanticValidation: true,
         noSyntaxValidation: true,
         diagnosticCodesToIgnore: [7027, 6385],
      });

      // También desactivar sugerencias tipo “deprecated”
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
         ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
         noLib: false,
         skipLibCheck: true,
         strict: false,
         suppressExcessPropertyErrors: true,
         suppressImplicitAnyIndexErrors: true,
         allowJs: true,
      });
   };

   return (
      <div className={`h-[25vh] border-double border-4 border-gray-500 rounded-md overflow-hidden read-only:cursor-default ${className}`}>
         <Editor
            className="read-only:cursor-default"
            height="100%"
            defaultLanguage={language}
            theme="vs-dark"
            value={code}
            onMount={handleEditorMount}
            options={{
               fontSize: 12,
               minimap: { enabled: false },
               wordWrap: "on",
               automaticLayout: true,
               readOnly: true,
               scrollBeyondLastLine: false,
               renderValidationDecorations: "off",
            }}
         />
      </div>
   );
}
