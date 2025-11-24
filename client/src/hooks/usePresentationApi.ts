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
    try {
      const result = await api.request('/api/presentations', {
        method: 'POST',
        body: JSON.stringify(presentationData)
      });
      console.log('✅ Save result:', result);
      return result as Presentation | null;
    } catch (error) {
      console.error('❌ Save error:', error);
      return null;
    }
  }, [api]);

  // 🎯 ОБНОВЛЕНИЕ ПРЕЗЕНТАЦИИ
  const updatePresentation = useCallback(async (
    id: string,
    presentationData: SavePresentationRequest
  ): Promise<Presentation | null> => {
    console.log('✏️ Updating presentation:', id, presentationData);
    try {
      const result = await api.request(`/api/presentations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(presentationData)
      });
      return result as Presentation | null;
    } catch (error) {
      console.error('❌ Update error:', error);
      return null;
    }
  }, [api]);

  // 🎯 ПОЛУЧЕНИЕ ПРЕЗЕНТАЦИИ
  const getPresentation = useCallback(async (id: string): Promise<Presentation | null> => {
    console.log('📥 Getting presentation:', id);
    try {
      const result = await api.request(`/api/presentations/${id}`);
      console.log('📄 Get result:', result);
      return result as Presentation | null;
    } catch (error) {
      console.error('❌ Get error:', error);
      return null;
    }
  }, [api]);

  // 🎯 ПОЛУЧЕНИЕ ВСЕХ ПРЕЗЕНТАЦИЙ
  const getAllPresentations = useCallback(async (): Promise<Presentation[] | null> => {
    console.log('📚 Getting all presentations...');
    try {
      const result = await api.request('/api/presentations') as { presentations: Presentation[] } | null;
      console.log('📋 Get all result:', result);
      
      if (!result) {
        console.log('❌ No response from server');
        return null;
      }
      
      if (!result.presentations) {
        console.log('❌ No presentations array in response');
        return null;
      }
      
      return result.presentations;
    } catch (error) {
      console.error('❌ Get all error:', error);
      return null;
    }
  }, [api]);

  // 🎯 УДАЛЕНИЕ ПРЕЗЕНТАЦИИ
  const deletePresentation = useCallback(async (id: string): Promise<boolean> => {
    console.log('🗑️ Deleting presentation:', id);
    try {
      const result = await api.request(`/api/presentations/${id}`, {
        method: 'DELETE'
      }) as { success: boolean } | null;
      
      console.log('✅ Delete response:', result);
      return result?.success || false;
    } catch (error) {
      console.error('❌ Delete error:', error);
      return false;
    }
  }, [api.request]);

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