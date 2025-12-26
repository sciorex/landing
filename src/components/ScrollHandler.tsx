import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollHandler() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // If there's a hash, wait a bit for the content to render then scroll
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);

            if (element) {
                // Use a small timeout to ensure the element is in the DOM
                const timeoutId = setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                return () => clearTimeout(timeoutId);
            }
        } else {
            // If no hash, scroll to top on page change
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return null;
}
