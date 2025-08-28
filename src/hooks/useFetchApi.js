import { useState, useEffect } from "react";

function useFetchApi(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            console.log('useFetchApi: Starting fetch for:', url);
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(url);
                console.log('useFetchApi: Response status:', response.status);
                console.log('useFetchApi: Response ok:', response.ok);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('useFetchApi: Raw result:', result);

                if (isMounted) {
                    if (result && typeof result === 'object' && 'data' in result) {
                        console.log('useFetchApi: Setting structured data:', result);
                        setData(result);
                    } else {
                        console.log('useFetchApi: Setting direct data:', result);
                        setData(result);
                    }
                }
            } catch (err) {
                console.error('useFetchApi: Error occurred:', err);
                if (isMounted) {
                    setError(err);
                }
            } finally {
                if (isMounted) {
                    console.log('useFetchApi: Fetch completed');
                    setLoading(false);
                }
            }
        };
        fetchData();
        return () => {
            console.log('useFetchApi: Cleanup called');
            isMounted = false;
        };
    }, [url]);

    return { data, loading, error, setData };
}

export default useFetchApi;