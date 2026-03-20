import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";
import { useModal } from "../context/ModalContext";

export default function DescriptionTab({
  listingId,
  initialData = "",
  goNextTab,
}) {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  const { showModal } = useModal();

  useEffect(() => {
    if (editorReady && initialData && editorRef.current) {
      editorRef.current.setContent(initialData);
    }
  }, [editorReady, initialData]);

  const saveDescription = async () => {
    if (!listingId) {
      showModal("Listing not created yet");
      return;
    }

    try {
      setLoading(true);

      const content = editorRef.current.getContent();

      if (!content || content.trim() === "") {
        showModal("Description cannot be empty");
        return;
      }

      await api.put(
        `/listings/${listingId}/description`,
        { description: content }
      );

      

      setTimeout(() => {
        goNextTab();
      }, 1000);
      return

    } catch (err) {
      console.error(err);
      showModal("Failed to save description");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="space-y-5">

      <Editor
        apiKey="2r6x758dp6es0ii45zfw9xu5fy23suwa6g8qxoakazk9tywz"
        onInit={(evt, editor) => {
          editorRef.current = editor;
          setEditorReady(true); //  very important
        }}
        initialValue=""
        init={{
          height: 350,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "searchreplace",
            "code",
            "fullscreen",
            "table",
            "wordcount",
          ],
          toolbar:
            "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link | code",
        }}
      />

      <button
        onClick={saveDescription}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded cursor-pointer"
      >
        {loading ? "Saving..." : "Save & Continue"}
      </button>

    </div>
  );
}