'use client';

import Image from 'next/image';
// import 'react-medium-image-zoom/dist/styles.css';
// import Zoom from 'react-medium-image-zoom';
// import { UncontrolledProps } from 'react-medium-image-zoom';
import 'photoswipe/dist/photoswipe.css';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import React, { useEffect, useId, useState } from 'react';
import { Gallery, Item, ItemProps } from 'react-photoswipe-gallery';
import ThemedDialog from './themed-dialog';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from './ui/dialog';

// interface Props extends UncontrolledProps {
//   contentClass?: any;
//   children: React.ReactNode;
// }

// function ThemedZoom({ contentClass, ...rest }: Props) {
//   return <Zoom {...rest} zoomMargin={96} classDialog="custom-zoom" />;
// }

const ThemedZoom = ({ children, ...rest }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-full rounded-none border-none bg-transparent p-0">
        <DialogClose className="absolute left-0" />
        <img
          className="max-h-full max-w-full"
          src={children.props.src}
          alt=""
        />
      </DialogContent>
    </Dialog>
  );
};

export default ThemedZoom;
