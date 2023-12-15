import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../../services/authService.js';

const SignupPage = () => {
    const [formData, setFormData] = useState({
                                                 firstName: '',
                                                 lastName: '',
                                                 email: '',
                                                 password: '',
                                                 role: 'Reader', // Default role for new users
                                             });
    const history = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await authService.registerUser(formData);
            history('/');
        } catch (error) {
            console.error('Signup failed', error);
        }
    };

    return (
        <div>
            <div>
                {/* Back to Home Link */}
                <Link to="/">Home</Link>
            </div>
            <br/>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <label>First Name:</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                <label>Last Name:</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                <label>Role:</label>
                <select name="role" value={formData.password} onChange={handleChange}>
                    <option value = "Reader">Reader</option>
                    <option value = "Author">Author</option>
                    <option value = "Admin">Admin</option>
                </select>
                <button type="submit">Signup</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link>.
            </p>
        </div>
    );
};

export default SignupPage;