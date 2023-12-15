import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authService from "../../services/authService.js";

const HomePage = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Fetch books from  API
        const fetchBooks = async () => {
            try {
                // Placeholder book, replace with actual data from API
                const placeholderBook = {
                    id: 1,
                    title: 'Sword Catcher',
                    author: 'Cassandra Clare',
                    // Add more details as needed
                };

                setBooks([placeholderBook]);
            } catch (error) {
                console.error('Error fetching books', error);
            }
        };

        fetchBooks();
    }, []);

    const isAuthenticated = authService.isAuthenticated();

    return (
        <div>
            <div>
                {/* Login/Signup Links */}
                <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
            </div>
            <h2>Welcome to BookWeb</h2>
            <h3>Featured Books</h3>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <strong>{book.title}</strong> by {book.author}
                        {/* Can include more details about each book */}
                    </li>
                ))}
            </ul>
            <div>
                {/* Search Page Link */}
                <Link to="/search">Search for more books</Link>
            </div>
            {isAuthenticated && (
                <div>
                    {/* User Profile Link (conditional based on user authentication) */}
                    <Link to="/profile">My Profile</Link>
                </div>
            )}
        </div>
    );
};

export default HomePage;