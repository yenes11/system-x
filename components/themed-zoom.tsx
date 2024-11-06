'use client';

import 'react-medium-image-zoom/dist/styles.css';
import Zoom from 'react-medium-image-zoom';
import { UncontrolledProps } from 'react-medium-image-zoom';

interface Props extends UncontrolledProps {
  contentClass?: any;
  children: React.ReactNode;
}

function ThemedZoom({ contentClass, ...rest }: Props) {
  return <Zoom {...rest} zoomMargin={96} classDialog="custom-zoom" />;
}

export default ThemedZoom;
