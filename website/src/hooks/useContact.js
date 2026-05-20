import { useState, useEffect } from 'react';

const useContact = () => {
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE}/contact`);
                if (response.ok) {
                    const data = await response.json();
                    setContact(data);
                }
            } catch (error) {
                console.error("Failed to fetch contact info", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContact();
    }, []);

    return { contact, loading };
};

export default useContact;
