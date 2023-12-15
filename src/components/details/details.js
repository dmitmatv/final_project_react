import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import authService from '../../services/authService.js';

const DetailsPage = () => {
    const { bookName } = useParams();
    const history = useNavigate();

    const [bookDetails, setBookDetails] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userReview, setUserReview] = useState('');
    const [userRating, setUserRating] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Fetch book details from Google Books API
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookName)}`
                );
                setBookDetails(response.data.items[0].volumeInfo);
            } catch (error) {
                console.error('Error fetching book details', error);
            }
        };

        // Fetch reviews from backend API
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/reviews/${bookName}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews', error);
            }
        };

        const userR = authService.getUserRole();
        setUserRole(userR);

        fetchBookDetails();
        fetchReviews();
    }, [bookName]);

    const handleSaveToReviewList = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const useRev = userReview;

            await axios.post(`http://localhost:4000/reviews/${userId}/review-list/${useRev}`, {
                useRev,
            });

            console.log('Review saved to review list');
        } catch (error) {
            console.error('Error saving review to review list', error);
        }
    };

    const handleSaveToReadingList = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const bookTitle = bookDetails.title;

            await axios.post(`http://localhost:4000/${userId}/reading-list/${bookTitle}`, {
                bookTitle,
            });

            console.log('Book saved to reading list');
        } catch (error) {
            console.error('Error saving book to reading list', error);
        }
        try {
            await createBook();
        } catch (error) {
            console.error('Error writing book', error);
        }
    };

    const createBook = async  () => {
        try {
            await axios.post('http://localhost:4000/', {
                title: bookDetails.title,
                author: bookDetails.authors[0],
            });
        } catch (error){
            console.error('Error writing book', error);
        }
    }

    const handleWriteReview = async () => {
        if (!userReview) {
            console.error('Review content is required');
            return;
        }

        try {
            // Send the review to backend API
            await axios.post('http://localhost:4000/reviews', {
                rating: userRating,
                body: userReview,
                bookTitle: bookName,
            });

            // Fetch updated reviews
            const response = await axios.get(`http://localhost:4000/reviews/${bookName}`);
            setReviews(response.data);

            // Clear the user's review input
            setUserReview('');
        } catch (error) {
            console.error('Error writing review', error);
        }
        try{
            await handleSaveToReviewList();
        } catch (error) {
            console.error('Error writing review to list', error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            // Send a request to backend API to delete the review
            await axios.delete(`http://localhost:4000/reviews/${reviewId}`);

            // Fetch updated reviews
            const response = await axios.get(`http://localhost:4000/reviews/${bookName}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error deleting review', error);
        }
    };

    return (
        <div>
            <h2>Book Details</h2>
            {bookDetails && (
                <div>
                    <h3>{bookDetails.title}</h3>
                    <p>Author: {bookDetails.authors && bookDetails.authors.join(', ')}</p>
                    <p>Description: {bookDetails.description}</p>
                    <p>Published Date: {bookDetails.publishedDate}</p>
                    {/* Display more book details as needed */}
                </div>
            )}
            <div>
                {/* Save to Reading List Button */}
                {(
                    <button onClick={handleSaveToReadingList}>Save to Reading List</button>
                )}
            </div>
            <div>
                {/* Write Review Section */}
                {(
                    <div>
                        <h3>Write a Review</h3>
                        <textarea
                            value={userReview}
                            onChange={(e) => setUserReview(e.target.value)}
                            placeholder="Write your review..."
                        />
                        <br/>
                        <label>
                            Rating:
                            <input
                                type="number"
                                name="rating"
                                onChange={(e) => setUserRating(e.target.value)}
                            />
                        </label>
                        <br/>
                        <button onClick={handleWriteReview}>Submit Review</button>
                    </div>
                )}
            </div>
            <div>
                {/* Display Reviews */}
                <h3>Reviews</h3>
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id}>
                            <p>{review.body}</p>
                            <p>Rating: {review.rating}</p>
                            <p>Id: {review._id}</p>
                            {(
                                <button onClick={() => handleDeleteReview(review._id)}>Delete Review</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                {/* Back to Search Link */}
                <Link to="/search">Back to Search</Link>
            </div>
        </div>
    );
};

export default DetailsPage;