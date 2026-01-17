import { useTheme } from '../context/ThemeContext';

interface ThemeImageProps {
  name: string;
  alt: string;
  className?: string;
}

export default function ThemeImage({ name, alt, className = '' }: ThemeImageProps) {
  const { theme } = useTheme();
  const src = `/screenshots/${theme}/${name}`;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}
