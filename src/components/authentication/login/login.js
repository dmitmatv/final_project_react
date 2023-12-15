import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../../services/authService.js';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const history = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
           await authService.loginUser(formData);

            history('/');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div>
            <div>
                {/* Back to Home Link */}
                <Link to="/">Home</Link>
            </div>
            <br/>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/signup">Register here</Link>.
            </p>
        </div>
    );
};

export default LoginPage;