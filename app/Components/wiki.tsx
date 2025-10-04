'use client'
import React, { useEffect, useState } from 'react';

// Define type for a single Wikipedia page - OBJECT definition
interface WikiPage {
    pageId: number;
    ns: number;
    title: string;
    index: number;
}

// Define the type for Wikipedia API response... this is what the API will be returned by the API when we call it.. response structure
interface WikiResponse {
    batchcomplete?: string;
    continue?: any;
    query: {
        pages: {
            [key: string]: WikiPage;
        };
    };
}

const WikiComponent = () => {
    const [pages, setPages] = useState<WikiPage[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchWikipediaData = async () => {
        // various url examples.. just change search term at end
        //const url = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=5&gsrsearch=La%20Trobe%20University';
        const url = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=5&gsrsearch=Bundoora';

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response did not return ok code.')

            // Else - otherwise
            const data: WikiResponse = await response.json();
            const pagesArray = Object.values(data.query.pages);
            setPages(pagesArray);
        //} catch (err: any) {
        } catch (err) {
            //setError(err.message);
            setError((err as Error).message) // original block was invalid in typescript
            console.error('Fetch error: ', err);
        }
    };

    useEffect(() => {
        fetchWikipediaData()
    }, []);

    return (
        <div>
            <h2>Wikipedia Search Results for "La Trobe University"</h2>
            {error && <p style={{ color: 'red'}}>Error: {error}</p>}
            <ul style={{ color: 'blue'}}>
                {pages.map((page) => (
                    <li key={page.pageId}>
                      <a
                        href={`https://en.wikipedia.org/?curid=${page.pageId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {page.title}
                      </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WikiComponent;


