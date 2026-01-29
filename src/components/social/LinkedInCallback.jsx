import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const LinkedInCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing login...');

   // LinkedInCallback.jsx में useEffect के अंदर
useEffect(() => {
    const handleCallback = async () => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('LinkedIn error:', error);
            navigate('/login?error=linkedin_failed');
            return;
        }

        if (!code) {
            console.error('No authorization code received');
            navigate('/login?error=no_code');
            return;
        }

        try {
            setStatus('Verifying LinkedIn authentication...');
            
            // ✅ CORRECT Backend URL
            const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-q0wc.onrender.com';
            const apiUrl = `${backendUrl}/api/linkedin/callback?code=${code}`;
            
            console.log('🔗 Sending code to backend:', apiUrl);
            
            const response = await fetch(apiUrl);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Backend response:', data);
            
            // ✅ Check response structure
            if (data.success && data.token) {
                // Save tokens
                localStorage.setItem('accessToken', data.token);
                
                if (data.user) {
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                }
                
                console.log('✅ LinkedIn login successful!');
                navigate('/dashboard');
            } else {
                throw new Error(data.message || 'Login failed');
            }
            
        } catch (error) {
            console.error('❌ LinkedIn callback error:', error);
            navigate('/login?error=auth_failed');
        }
    };

    handleCallback();
}, [searchParams, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
            <div className="spinner"></div>
            <h2>{status}</h2>
            <style>{`.spinner { border: 4px solid #f3f3f3; border-top: 4px solid #0077B5; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default LinkedInCallback;