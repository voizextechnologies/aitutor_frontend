/**
 * Perseus Renderer Component
 * Stub implementation for rendering Perseus questions
 */

import React from 'react';

export interface RendererProps {
  content: string;
  widgets?: Record<string, any>;
  images?: Record<string, { width: number; height: number }>;
  rendererDependencies?: any;
  apiOptions?: any;
  linterContext?: any;
  useV2Keypad?: boolean;
  onFocusChange?: (focused: boolean) => void;
  findInternalWidgets?: () => any[];
  findExternalWidgets?: () => any[];
}

export const Renderer: React.FC<RendererProps> = ({ content, widgets }) => {
  return (
    <div className="perseus-renderer">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default Renderer;
