import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

const Profile = () => {
    const [user, setUser] = useState(null);
    //const { userId } = useParams();
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId')


                const response = await axios.get(`${API_URL}/profile/${userId || 'current'}`);
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUser();
    }, [userId]);

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`${API_URL}/profile/${userId}`);
            // Need to handle successful deletion, e.g., redirect to home
            console.log('Account deleted successfully');
        } catch (error) {
            console.error('Error deleting account', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                {/* Back to Home Link */}
                <Link to="/">Home</Link>
            </div>
            <br/>
            <h2>Profile</h2>
            <p>
                Name: {user.firstName} {user.lastName}
                {(
                    <Link to={`/profile/${userId}/edit`}>
                        <button>Edit</button>
                    </Link>
                )}
            </p>
            {<div>
                <h3>Reading List</h3>
                    {user.readingList.map((book) => (
                        <div>
                            {book.book}
                        </div>
                    ))}
            </div>
            }
            {<div>
                <h3>Written List</h3>
                {user.writtenList.map((book) => (
                    <div>
                        {book.book}
                    </div>
                ))}

            </div>
            }
            {user.role === 'Admin' && (
                <div>
                    <h3>Admin Panel</h3>
                    <button onClick={() => handleDeleteAccount(userId)}>Delete User Account</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
