import { useTheme } from '../context/ThemeContext';

interface ThemeImageProps {
  name: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

export default function ThemeImage({ name, alt, className = '', onLoad }: ThemeImageProps) {
  const { theme } = useTheme();
  const src = `/screenshots/${theme}/${name}`;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onLoad={onLoad}
    />
  );
}
