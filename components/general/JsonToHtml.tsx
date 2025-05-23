"use client";

// JSON to HTML component for rendering rich text content from stored JSON
// Converts structured JSON content into formatted HTML using TipTap editor
// Used primarily for displaying job descriptions with proper formatting

import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/**
 * JSON to HTML Component
 *
 * This component renders rich text content stored as JSON into formatted HTML
 * It uses TipTap editor in read-only mode to display the content with proper styling
 *
 * Features:
 * - Converts JSON content structure to properly formatted HTML
 * - Supports rich text formatting (headings, lists, bold, italic, etc.)
 * - Handles text alignment options (left, center, right, justify)
 * - Applies typography enhancements for better readability
 * - Responsive styling with different sizes based on screen width
 * - Dark mode support with automatic theme detection
 * - Read-only mode prevents user editing while maintaining formatting
 *
 * Technical Details:
 * - Uses TipTap editor in read-only mode (editable: false)
 * - Includes StarterKit for basic formatting capabilities
 * - Adds TextAlign extension for text alignment options
 * - Adds Typography extension for typographic enhancements
 * - Uses Tailwind Typography plugin for consistent text styling
 * - Responsive sizing with sm/lg/xl breakpoints
 *
 * @param json - The JSON content structure to render as HTML
 */
const JsonToHtml = ({ json }: { json: JSONContent }) => {
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
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert",
      },
    },
    editable: false, // Read-only mode - prevents editing
    content: json, // Set the JSON content to display
  });

  // Render the editor content in read-only mode
  return <EditorContent editor={editor} />;
};

export default JsonToHtml;
