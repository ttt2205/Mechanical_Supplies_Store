import { useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useToastStore } from '@/store/useToastStore';

export const useImageUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const addToast = useToastStore(state => state.addToast);

    const uploadImage = async (file: File, objectType: string = 'product', objectId: string = '0'): Promise<string | null> => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('objectType', objectType);
            formData.append('objectId', objectId);

            const res = await fetchApi<any>('/files/upload', { 
                method: 'POST', 
                body: formData 
            });

            const uploadedUrl = res?.url || res?.Url || res?.data?.url || res?.data?.Url;
            if (uploadedUrl) {
                addToast('Tải ảnh lên thành công', 'success');
                return uploadedUrl;
            }
            throw new Error('No URL returned from server');
        } catch (error: any) {
            console.error('Upload image error:', error);
            addToast(error?.message || 'Lỗi khi tải ảnh lên', 'error');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        isUploading,
        uploadImage
    };
};
