import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';

type FileResponseData = {
  id: string;          // media record id
  publicUrl: string;
  filePath: string;
  fileName: string;
  bucket: string;
};

type UseFileUploader = {
  origin: string;
  foldername: string;
  filename: string;
  onUpdate: (fileResponse: FileResponseData) => void;
  bucket: string;
  templateId?: string | null;  // optional link to template
  eventId?: string | null;     // optional link to event
};

export function useFileUploader(options: UseFileUploader) {
  const handleFile = async (file: File | null) => {
    if (!file) {
      toast("No se seleccionó ningún archivo", {
        description: "Por favor, elige un archivo para subir.",
      });
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${options.filename}-${Date.now()}.${fileExt}`;
    const filePath = `${options.origin}/${options.foldername}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      toast("Error al subir archivo", { description: uploadError.message });
      return;
    }

    const { data: urlData } = supabase.storage.from(options.bucket).getPublicUrl(filePath);
    if (!urlData?.publicUrl) {
      toast("⚠️ No se pudo obtener la URL pública", {
        description: "El archivo se subió, pero no se pudo recuperar la URL.",
      });
      return;
    }

    // Insert media record
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .insert({
        template_id: options.templateId ?? null,
        event_id: options.eventId ?? null,
        publicUrl: urlData.publicUrl,
        type: file.type,           // e.g. 'image/png' or 'audio/mpeg'
        filePath,
        fileName,
        bucket: options.bucket,
      })
      .select()
      .single();

    if (mediaError || !mediaData) {
      toast("Error al registrar media en base de datos", {
        description: mediaError.message,
      });
      return;
    }

    options.onUpdate({
      id: mediaData.id,
      publicUrl: mediaData.publicUrl!,
      filePath: mediaData.filePath!,
      fileName: mediaData.fileName!,
      bucket: mediaData.bucket!,
    });

    toast("✅ Archivo subido y registrado con éxito");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFile(file);
  };

  return { handleFileChange, handleFile };
}
