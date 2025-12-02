import { ReactNode, createContext, useContext, useState } from 'react';

export type LayoutType = 'home' | 'gallery' | 'editor' | 'presenter' | 'settings';

interface LayoutContextType {
  currentLayout: LayoutType;
  setLayout: (layout: LayoutType) => void;
  isLeftPanelOpen: boolean;
  isRightPanelOpen: boolean;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  closePanels: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('home');
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const toggleLeftPanel = () => setIsLeftPanelOpen(prev => !prev);
  const toggleRightPanel = () => setIsRightPanelOpen(prev => !prev);
  const closePanels = () => {
    setIsLeftPanelOpen(false);
    setIsRightPanelOpen(false);
  };

  return (
    <LayoutContext.Provider
      value={{
        currentLayout,
        setLayout: setCurrentLayout,
        isLeftPanelOpen,
        isRightPanelOpen,
        toggleLeftPanel,
        toggleRightPanel,
        closePanels
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};