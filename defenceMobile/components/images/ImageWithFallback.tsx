import React, { useState } from 'react';
import { Image, View, StyleSheet, ImageProps } from 'react-native';

const ERROR_IMG_SRC = 'https://via.placeholder.com/88?text=Image+Error';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

export function ImageWithFallback({ source, fallbackSrc = ERROR_IMG_SRC, style, ...rest }: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  return (
    <Image
      source={didError ? { uri: fallbackSrc } : (source as any)}
      style={style}
      onError={() => setDidError(true)}
      {...rest}
    />
  );
}
