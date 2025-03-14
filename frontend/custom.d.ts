import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// This file is needed to make TypeScript happy with JSX elements
// when there are type issues in older Next.js versions
