"use client";

import { useFormStatus } from "react-dom";

const UpdateButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white p-2 rounded-md cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed max-w-96"
    >
      {pending ? "Updating..." : "Update"}
    </button>
  );
};

export default UpdateButton;
