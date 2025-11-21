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

interface PresentationsResponse {
  presentations: Presentation[];
}

interface DeleteResponse {
  success: boolean;
}

export const usePresentationApi = () => {
  // Убираем дженерик из useApi, так как он будет определяться в каждом вызове request
  const api = useApi();

  const savePresentation = async (presentationData: SavePresentationRequest): Promise<Presentation | null> => {
    const result = await api.request('/api/presentations', {
      method: 'POST',
      body: JSON.stringify(presentationData)
    });
    return result as Presentation | null;
  };

  const updatePresentation = async (id: string, presentationData: SavePresentationRequest): Promise<Presentation | null> => {
    const result = await api.request(`/api/presentations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(presentationData)
    });
    return result as Presentation | null;
  };

  const getPresentation = async (id: string): Promise<Presentation | null> => {
    const result = await api.request(`/api/presentations/${id}`);
    return result as Presentation | null;
  };

  const getAllPresentations = async (): Promise<Presentation[] | null> => {
    const result = await api.request('/api/presentations') as PresentationsResponse | null;
    return result?.presentations || null;
  };

  const deletePresentation = async (id: string): Promise<boolean> => {
    const result = await api.request(`/api/presentations/${id}`, {
      method: 'DELETE'
    }) as DeleteResponse | null;
    return result?.success || false;
  };

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