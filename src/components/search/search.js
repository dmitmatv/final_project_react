import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            // Replace 'GOOGLE_BOOKS_API_KEY' with actual Google Books API key
            const API_KEY = 'AIzaSyAABgWJlEIH_N8NzP8-LnMcS6K2DTCr7Mo';
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`
            );

            // Extract relevant book information from the API response
            const books = response.data.items.map((item) => ({
                id: item.id,
                title: item.volumeInfo.title,
            }));

            setSearchResults(books);
        } catch (error) {
            console.error('Error searching books', error);
        }
    };

    return (
        <div>
            <div>
                {/* Back to Home Link */}
                <Link to="/">Home</Link>
            </div>
            <br/>
            <h2>Search for Books</h2>
            <div>
                <input
                    type="text"
                    placeholder="Enter book title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <ul>
                {searchResults.map((book) => (
                    <li key={book.id}>
                        {/* Use Link to navigate to the book details page */}
                        <Link to={`/details/${encodeURIComponent(book.title)}`}>{book.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchPage;