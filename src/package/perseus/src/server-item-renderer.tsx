/**
 * Perseus Server Item Renderer
 * Stub implementation for server-side rendering of Perseus items
 */

import React from 'react';

export interface ServerItemRendererProps {
  item: any;
  problemNum?: number;
  dependencies?: any;
  apiOptions?: any;
  linterContext?: any;
  showSolutions?: string;
  hintsVisible?: number;
  reviewMode?: boolean;
}

export const ServerItemRenderer: React.FC<ServerItemRendererProps> = ({
  item,
  problemNum,
  showSolutions,
}) => {
  return (
    <div className="perseus-server-item-renderer">
      <div>Problem {problemNum}</div>
      {item?.question?.content && (
        <div dangerouslySetInnerHTML={{ __html: item.question.content }} />
      )}
    </div>
  );
};

export default ServerItemRenderer;
