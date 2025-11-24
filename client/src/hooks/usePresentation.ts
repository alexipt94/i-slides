import { useCallback, useMemo, useReducer } from 'react';
import { PresentationState, SlideData } from '../types';

// 🎯 ТИПИЗИРОВАННЫЕ ДЕЙСТВИЯ
type PresentationAction =
  | { type: 'SET_CURRENT_SLIDE'; payload: number }
  | { type: 'ADD_SLIDE'; payload: SlideData }
  | { type: 'UPDATE_SLIDE'; payload: { index: number; slide: SlideData } }
  | { type: 'DELETE_SLIDE'; payload: number }
  | { type: 'REORDER_SLIDES'; payload: SlideData[] }
  | { type: 'TOGGLE_PLAYING' }
  | { type: 'TOGGLE_EDITING' }
  | { type: 'SET_SLIDES'; payload: SlideData[] };

const initialState: PresentationState = {
  currentSlideIndex: 0,
  slides: [],
  isPlaying: false,
  isEditing: false
};

// 🎯 РЕДЬЮСЕР ВНЕ ХУКА ДЛЯ СТАБИЛЬНОСТИ
function presentationReducer(
  state: PresentationState,
  action: PresentationAction
): PresentationState {
  switch (action.type) {
    case 'SET_CURRENT_SLIDE':
      return {
        ...state,
        currentSlideIndex: action.payload,
        isEditing: false
      };
    case 'ADD_SLIDE':
      return {
        ...state,
        slides: [...state.slides, action.payload],
        currentSlideIndex: state.slides.length,
        isEditing: true
      };
    case 'UPDATE_SLIDE':
      const newSlides = [...state.slides];
      newSlides[action.payload.index] = action.payload.slide;
      return {
        ...state,
        slides: newSlides,
        isEditing: false
      };
    case 'DELETE_SLIDE':
      if (state.slides.length <= 1) return state;
      const filteredSlides = state.slides.filter((_, index) => index !== action.payload);
      let newCurrentIndex = state.currentSlideIndex;
      
      if (action.payload === state.currentSlideIndex) {
        newCurrentIndex = state.currentSlideIndex >= filteredSlides.length
          ? filteredSlides.length - 1
          : state.currentSlideIndex;
      } else if (action.payload < state.currentSlideIndex) {
        newCurrentIndex = state.currentSlideIndex - 1;
      }
      
      return {
        ...state,
        slides: filteredSlides,
        currentSlideIndex: newCurrentIndex,
        isEditing: false
      };
    case 'TOGGLE_PLAYING':
      return {
        ...state,
        isPlaying: !state.isPlaying,
        isEditing: false
      };
    case 'TOGGLE_EDITING':
      return {
        ...state,
        isEditing: !state.isEditing
      };
    case 'SET_SLIDES':
      return {
        ...state,
        slides: action.payload,
        currentSlideIndex: 0,
        isEditing: false
      };
    default:
      return state;
  }
}

export const usePresentation = (initialSlides: SlideData[] = []) => {
  const [state, dispatch] = useReducer(presentationReducer, {
    ...initialState,
    slides: initialSlides
  });

  // 🎯 МЕМОИЗИРОВАННЫЕ ДЕЙСТВИЯ
  const setCurrentSlide = useCallback((index: number) => {
    dispatch({ type: 'SET_CURRENT_SLIDE', payload: index });
  }, []);

  const addSlide = useCallback((slide: SlideData) => {
    dispatch({ type: 'ADD_SLIDE', payload: slide });
  }, []);

  const updateSlide = useCallback((index: number, slide: SlideData) => {
    dispatch({ type: 'UPDATE_SLIDE', payload: { index, slide } });
  }, []);

  const deleteSlide = useCallback((index: number) => {
    dispatch({ type: 'DELETE_SLIDE', payload: index });
  }, []);

  const togglePlaying = useCallback(() => {
    dispatch({ type: 'TOGGLE_PLAYING' });
  }, []);

  const toggleEditing = useCallback(() => {
    dispatch({ type: 'TOGGLE_EDITING' });
  }, []);

  const setSlides = useCallback((slides: SlideData[]) => {
    dispatch({ type: 'SET_SLIDES', payload: slides });
  }, []);

  // 🎯 МЕМОИЗИРОВАННЫЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  const goToNextSlide = useCallback(() => {
    const nextIndex = Math.min(state.currentSlideIndex + 1, state.slides.length - 1);
    setCurrentSlide(nextIndex);
  }, [state.currentSlideIndex, state.slides.length, setCurrentSlide]);

  const goToPrevSlide = useCallback(() => {
    const prevIndex = Math.max(state.currentSlideIndex - 1, 0);
    setCurrentSlide(prevIndex);
  }, [state.currentSlideIndex, setCurrentSlide]);

  const createNewSlide = useCallback(() => {
    const maxId = state.slides.reduce((max, slide) => Math.max(max, slide.id), 0);
    const newSlide: SlideData = {
      id: maxId + 1,
      title: `Новый слайд ${maxId + 1}`,
      content: "Редактируйте содержимое этого слайда"
    };
    addSlide(newSlide);
  }, [state.slides, addSlide]);

  // 🎯 МЕМОИЗИРОВАННОЕ ТЕКУЩЕЕ СОСТОЯНИЕ
  const currentSlide = useMemo(() => 
    state.slides[state.currentSlideIndex], 
    [state.slides, state.currentSlideIndex]
  );

  // 🎯 ВОЗВРАЩАЕМ МЕМОИЗИРОВАННЫЙ ОБЪЕКТ
  return useMemo(() => ({
    // СОСТОЯНИЕ
    ...state,
    currentSlide,
    
    // ДЕЙСТВИЯ
    setCurrentSlide,
    addSlide,
    updateSlide,
    deleteSlide,
    togglePlaying,
    toggleEditing,
    setSlides,
    
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    goToNextSlide,
    goToPrevSlide,
    createNewSlide
  }), [
    state,
    currentSlide,
    setCurrentSlide,
    addSlide,
    updateSlide,
    deleteSlide,
    togglePlaying,
    toggleEditing,
    setSlides,
    goToNextSlide,
    goToPrevSlide,
    createNewSlide
  ]);
};