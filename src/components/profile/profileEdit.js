import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

const ProfileEdit = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const [newBookTitle, setNewBookTitle] = useState('');
    const history = useNavigate();
    const request = axios.create({
                                     withCredentials: true,
                                 });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId')


                const response = await axios.get(`${API_URL}/profile/${userId}`);
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUser();
    }, [userId]);

    const handleInputChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const handleDeleteFromList = async (listType, itemId) => {
        const userId = localStorage.getItem('userId')
        if (listType === "reviewList"){
            await axios.patch(`${API_URL}/profile/${userId}/${listType}/remove/${itemId}`, editedUser);
            /*setEditedUser({
                              ...editedUser,
                              [listType]: (editedUser[listType] || []).filter((review) => review.review !== itemId),
                          });*/
        } else {
            await axios.patch(`${API_URL}/profile/${userId}/${listType}/remove/${itemId}`, editedUser);
            /*setEditedUser({
                              ...editedUser,
                              [listType]: (editedUser[listType] || []).filter(
                                  (book) => book.book !== itemId),
                          });*/
        }
    };

    const handleAddToWrittenList = async () => {
        // Check if the user is an author
        if (user.role === 'Author') {
                try {
                    const userId = localStorage.getItem('userId');
                    const bookTitle = newBookTitle;

                    await axios.post(`http://localhost:4000/${userId}/written-list/${bookTitle}`, {
                        bookTitle,
                    });

                    console.log('Book saved to written list');
                } catch (error) {
                    console.error('Error saving book to written list', error);
                }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId')

        try {
            const userUp = await axios.patch(`${API_URL}/profile/${userId}`, {editedUser});
            console.log('Profile updated successfully');
            //history(`/profile/${userId}`); // Redirect to the profile page after editing
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstName"
                        value={editedUser.firstName || user.firstName}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Last Name:
                    <input
                        type="text"
                        name="lastName"
                        value={editedUser.lastName || user.lastName}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={editedUser.email || user.email}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={editedUser.password || user.password}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Reading List:
                    {user.readingList.map((book) => (
                        <div >
                            {book.book}
                            <button type="button" onClick={() => handleDeleteFromList('readingList', book.book)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </label>
                <br />
                <label>
                    Written List:
                    {user.writtenList.map((book) => (
                        <div >
                            {book.book}
                            <button type="button" onClick={() => handleDeleteFromList('writtenList', book.book)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </label>
                <br />
                {/* Input field for adding new books to the Written List (for Authors only) */}
                {user.role === 'Author' && (
                    <label>
                        New Book Title:
                        <input
                            type="text"
                            name="newBookTitle"
                            value={newBookTitle}
                            onChange={(e) => setNewBookTitle(e.target.value)}
                        />
                        {/* Button to add new book to Written List */}
                        <button type="button" onClick={handleAddToWrittenList}>
                            Add to Written List
                        </button>
                    </label>
                )}
                <br />
                <label>
                    Review List:
                    {user.reviewList.map((review) => (
                        <div >
                            {review.review}
                            <button type="button" onClick={() => handleDeleteFromList('reviewList', review.review)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </label>
                <br />
                <button type="submit">Save Changes</button>
                <br/>
                <Link to={`/profile/${userId}`}>
                    Back to profile
                </Link>
            </form>
        </div>
    );
};

export default ProfileEdit;
