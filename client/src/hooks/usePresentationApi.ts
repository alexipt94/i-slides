import { useCallback } from 'react';
import { SlideData } from '../types';
import { useApi } from './useApi';

interface Presentation {
  id: string;
  title: string;
  slides: SlideData[];
  createdAt: string;
  updatedAt: string;
}

interface SavePresentationRequest {
  title: string;
  slides: SlideData[];
}

export const usePresentationApi = () => {
  const api = useApi();

  // 🎯 СОХРАНЕНИЕ ПРЕЗЕНТАЦИИ
  const savePresentation = useCallback(async (
    presentationData: SavePresentationRequest
  ): Promise<Presentation | null> => {
    console.log('💾 Saving presentation:', presentationData);
    
    const result = await api.request('/api/presentations', {
      method: 'POST',
      body: JSON.stringify(presentationData)
    });
    
    console.log('✅ Save result:', result);
    return result as Presentation | null;
  }, [api]);

  // 🎯 ОБНОВЛЕНИЕ ПРЕЗЕНТАЦИИ
  const updatePresentation = useCallback(async (
    id: string,
    presentationData: SavePresentationRequest
  ): Promise<Presentation | null> => {
    console.log('✏️ Updating presentation:', id, presentationData);
    
    const result = await api.request(`/api/presentations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(presentationData)
    });
    
    return result as Presentation | null;
  }, [api]);

  // 🎯 ПОЛУЧЕНИЕ ПРЕЗЕНТАЦИИ
  const getPresentation = useCallback(async (id: string): Promise<Presentation | null> => {
    console.log('📥 Getting presentation:', id);
    
    const result = await api.request(`/api/presentations/${id}`);
    console.log('📄 Get result:', result);
    
    return result as Presentation | null;
  }, [api]);

  // 🎯 ПОЛУЧЕНИЕ ВСЕХ ПРЕЗЕНТАЦИЙ
  const getAllPresentations = useCallback(async (): Promise<Presentation[] | null> => {
    console.log('📚 Getting all presentations...');
    
    const result = await api.request('/api/presentations') as { presentations: Presentation[] } | null;
    console.log('📋 Get all result:', result);
    
    if (!result || !result.presentations) {
      console.log('❌ No presentations found in response');
      return null;
    }
    
    return result.presentations;
  }, [api]);

  // 🎯 УДАЛЕНИЕ ПРЕЗЕНТАЦИИ
  const deletePresentation = useCallback(async (id: string): Promise<boolean> => {
    console.log('🗑️ Deleting presentation:', id);
    
    const result = await api.request(`/api/presentations/${id}`, {
      method: 'DELETE'
    }) as { success: boolean } | null;
    
    return result?.success || false;
  }, [api]);

  return {
    savePresentation,
    updatePresentation,
    getPresentation,
    getAllPresentations,
    deletePresentation,
    loading: api.loading,
    error: api.error,
    clearError: api.clearError,
    abortRequest: api.abortRequest
  };
};