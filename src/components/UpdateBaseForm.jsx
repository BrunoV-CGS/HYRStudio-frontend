import {useForm} from "react-hook-form";
import useContent from "../hooks/useContent";

export default function UpdateBaseForm({onClose}) {
  const {register, handleSubmit, reset} = useForm();
  const {updateKnowledgeBase} = useContent();

  const onSubmit = async (data) => {
    onClose(); 
    const result = await updateKnowledgeBase(data);
    if (result) {
      reset(); // Reset form fields after successful submission
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{display: "grid", gap: "1rem"}}
    >
      <div>
        <label>Persona</label>
        <input
          {...register("persona", {required: true})}
          placeholder='Ej: Deeper Connecting'
          style={{width: "100%", padding: "0.5rem"}}
        />
      </div>
      <div>
        <label>Folder ID</label>
        <input
          {...register("folderId", {required: true})}
          placeholder='Ej: 1CVcFkNohpcl9LILmOKygAgDQO2GW1lv0'
          style={{width: "100%", padding: "0.5rem"}}
        />
      </div>
      <button
        type='submit'
        style={{
          padding: "0.75rem",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Update Knowledge Base
      </button>
    </form>
  );
}
