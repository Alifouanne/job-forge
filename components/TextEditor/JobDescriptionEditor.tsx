"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenueBar from "./MenueBar";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import type { ControllerRenderProps } from "react-hook-form";

/**
 * Props interface for the JobDescriptionEditor component
 */
interface Props {
  /** React Hook Form field object for managing form state */
  field: ControllerRenderProps;
}

/**
 * Job Description Editor Component
 *
 * This component provides a rich text editor specifically designed for job descriptions
 * It integrates with React Hook Form and stores content as JSON for consistent rendering
 *
 * Features:
 * - Full-featured rich text editing with TipTap editor
 * - Toolbar with formatting controls (bold, italic, lists, headings, etc.)
 * - Text alignment options (left, center, right, justify)
 * - Typography enhancements for professional content
 * - Dark mode support with automatic theme detection
 * - Form integration with React Hook Form
 * - JSON storage format for consistent rendering across the application
 * - Responsive design with different prose sizes based on screen width
 *
 * Technical Details:
 * - Uses TipTap editor with StarterKit for core functionality
 * - Adds TextAlign extension for text alignment options
 * - Adds Typography extension for typographic enhancements
 * - Stores content as JSON string in form field
 * - Parses existing content from form field on initialization
 * - Updates form field on content changes
 * - Uses Tailwind Typography plugin for consistent text styling
 *
 * @param field - React Hook Form field object for managing form state
 */
const JobDescriptionEditor = ({ field }: Props) => {
  // Initialize TipTap editor with extensions and configuration
  const editor = useEditor({
    extensions: [
      // StarterKit includes essential extensions like paragraphs, headings, lists, etc.
      StarterKit,

      // Text alignment extension for controlling text alignment
      TextAlign.configure({
        types: ["heading", "paragraph"], // Apply alignment to headings and paragraphs
      }),

      // Typography extension for smart typography features
      // (em dashes, smart quotes, etc.)
      Typography,
    ],
    immediatelyRender: false, // Defer rendering for better performance
    editorProps: {
      attributes: {
        // Apply Tailwind Typography styling with responsive sizes
        // and automatic dark mode support
        class:
          "min-h-[300px] p-4 max-w-none focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert",
      },
    },
    // Update form field when editor content changes
    onUpdate: ({ editor }) => {
      // Convert editor content to JSON string and update form field
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    // Initialize editor with existing content from form field
    // Parse JSON string to content object, or use empty string if no content exists
    content: field.value ? JSON.parse(field.value) : "",
  });

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-card">
      {/* Toolbar with formatting controls */}
      <MenueBar editor={editor} />

      {/* Editor content area */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default JobDescriptionEditor;
