import React from 'react';
import styled from '@emotion/styled/macro';
import SkeletonList from './pages/SkeletonList';
import InfinityScroll from './component/InfinityScroll';

function App() {
  return (
    <div>
      <InfinityScroll />
    </div>
  );
}

export default App;
