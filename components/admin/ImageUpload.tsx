"use client";
import React, { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    currentImage?: string;
    onImageUploaded: (url: string) => void;
    onUpload: (file: File) => Promise<{ success: boolean; data?: { url: string }; message?: string }>;
    label?: string;
    className?: string;
}

export default function ImageUpload({
    currentImage,
    onImageUploaded,
    onUpload,
    label = "Imagen de portada",
    className = "",
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
        if (!validTypes.includes(file.type)) {
            setError("Formato no válido. Usa JPG, PNG, GIF, WEBP o SVG.");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError("La imagen es muy grande. Máximo 5MB.");
            return;
        }

        setError("");
        setIsUploading(true);

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        try {
            const response = await onUpload(file);

            if (response.success && response.data?.url) {
                onImageUploaded(response.data.url);
                setPreview(response.data.url);
            } else {
                setError(response.message || "Error al subir la imagen");
                setPreview(currentImage || null);
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("Error al subir la imagen");
            setPreview(currentImage || null);
        }

        setIsUploading(false);

        // Reset input
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageUploaded("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-sm font-medium text-foreground">{label}</label>

            <div className="relative">
                {preview ? (
                    <div className="relative rounded-xl overflow-hidden border border-border">
                        <div className="aspect-video relative">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-cover"
                                unoptimized={preview.startsWith("data:")}
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                        </div>

                        {!isUploading && (
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => inputRef.current?.click()}
                                    className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                                    title="Cambiar imagen"
                                >
                                    <Upload className="h-4 w-4 text-white" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                                    title="Eliminar imagen"
                                >
                                    <X className="h-4 w-4 text-white" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full aspect-video border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/50 transition-colors disabled:opacity-50"
                    >
                        {isUploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                            <>
                                <div className="p-3 bg-muted rounded-full">
                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-foreground">
                                        Haz clic para subir imagen
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        JPG, PNG, GIF, WEBP o SVG (máx. 5MB)
                                    </p>
                                </div>
                            </>
                        )}
                    </button>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
