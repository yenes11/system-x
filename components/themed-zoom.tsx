'use client';

import 'react-medium-image-zoom/dist/styles.css';
import Zoom from 'react-medium-image-zoom';
import { UncontrolledProps } from 'react-medium-image-zoom';

function ThemedZoom(props: UncontrolledProps) {
  return <Zoom {...props} zoomMargin={96} classDialog="custom-zoom" />;
}

export default ThemedZoom;
