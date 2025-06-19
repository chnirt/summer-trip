"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { FormDescription, FormMessage } from "./ui/form";

const supabase = createClient();

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface FileUploadInputProps {
  id: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FileUploadInput({
  id,
  value,
  onChange,
  uploading,
  setUploading,
}: FileUploadInputProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(value || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(value || null);
  }, [value]);

  const uploadFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg("File size must be less than 2MB");
      return null;
    }

    setUploading(true);
    setErrorMsg(null);

    const filePath = `uploads/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      setErrorMsg("Upload failed: " + uploadError.message);
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);

    setUploading(false);
    return data.publicUrl;
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const selectedFile = e.target.files?.[0] ?? null;
    if (!selectedFile) return;

    const url = await uploadFile(selectedFile);
    if (url) {
      setImageUrl(url);
      onChange(url);
    } else {
      onChange(null);
    }
  };

  return (
    <>
      <Input
        id={id}
        type="file"
        onChange={onFileChange}
        disabled={uploading}
        accept="image/*"
      />
      {uploading && <FormDescription>Uploading...</FormDescription>}
      {errorMsg && <FormMessage>{errorMsg}</FormMessage>}
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="Preview"
          className="mt-2 max-h-40 rounded object-contain"
        />
      )}
    </>
  );
}
