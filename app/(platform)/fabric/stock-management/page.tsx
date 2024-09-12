'use client';
import { Carousel } from '@trendyol-js/react-carousel';
import React from 'react';

function FabricStockManagementPage() {
  return (
    <div className="w-full">
      <Carousel
        leftArrow={<span>asdasd</span>}
        swiping
        show={3.5}
        slide={2}
        transition={0.5}
      >
        <div className="h-32 w-32 bg-blue-700">asdasd</div>
        <div className="h-32 w-32 bg-blue-700">asdasd</div>
        <div className="h-32 w-32 bg-blue-700">asdasd</div>
        <div className="h-32 w-32 bg-blue-700">asdasd</div>
        <div className="h-32 w-32 bg-blue-700">asdasd</div>
      </Carousel>
    </div>
  );
}

export default FabricStockManagementPage;
