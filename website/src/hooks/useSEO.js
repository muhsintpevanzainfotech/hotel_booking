import { useEffect } from 'react';

const useSEO = (title, description) => {
    useEffect(() => {
        const baseTitle = 'Lake Breeze Resorts';
        document.title = title ? `${title} | ${baseTitle}` : baseTitle;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute(
                'content', 
                description || 'Experience unrivaled luxury at Lake Breeze Resorts. A sanctuary where architectural brilliance meets the wild beauty of the valley. Book your signature suite today.'
            );
        }
    }, [title, description]);
};

export default useSEO;
