import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';

type FileResponseData = { publicUrl: string, filePath: string, fileName: string, bucket: string }
type UseFileUploader = { foldername: string, filename: string, onUpdate: (fileResponse: FileResponseData) => void, bucket: string }

export function useFileUploader(options: UseFileUploader) {
  const handleFile = async (file: File | null) => {
    if (!file) {
      toast("No se seleccionó ningún archivo", {
        description: "Por favor, elige una imagen para subir.",
      });
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${options.filename}-${Date.now()}.${fileExt}`;
    const filePath = `templates/${options.foldername}/${fileName}`;

    const { error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      toast("Error al subir imagen", { description: error.message });
      return;
    }

    const { data } = supabase.storage.from(options.bucket).getPublicUrl(filePath);
    if (data?.publicUrl) {
      options.onUpdate({ publicUrl: data.publicUrl, filePath, fileName, bucket: options.bucket });
      toast("✅ Imagen subida con éxito", {
        description: "La imagen ha sido cargada y la URL actualizada.",
      });
    } else {
      toast("⚠️ No se pudo obtener la URL pública", {
        description: "La imagen se subió, pero no se pudo recuperar la URL.",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFile(file);
  };

  return { handleFileChange, handleFile };
}