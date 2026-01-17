"use client";

import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
      Could not fetch note details. {error.message}
    </p>
  );
}
