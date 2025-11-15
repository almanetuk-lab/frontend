import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  useEffect(() => {
    const handleCallback = async () => {
      if (error) {
        console.error('LinkedIn OAuth error:', error);
        navigate('/login?error=linkedin_failed');
        return;
      }

      if (code) {
        try {
          console.log('📨 LinkedIn callback received with code:', code);
          
          // Backend API call
          const response = await fetch(`/api/auth/linkedin/callback?code=${code}`);
          const data = await response.json();
          
          if (data.success) {
            // Save tokens & user data
            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            
            console.log('✅ LinkedIn login successful');
            navigate('/dashboard');
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error('❌ LinkedIn callback error:', error);
          navigate('/login?error=linkedin_auth_failed');
        }
      } else {
        console.error('❌ No authorization code found');
        navigate('/login?error=no_code');
      }
    };

    handleCallback();
  }, [code, error, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-4 text-amber-700">Completing LinkedIn login...</p>
        <p className="mt-2 text-sm text-amber-600">Please wait while we authenticate you</p>
      </div>
    </div>
  );
};

export default LinkedInCallback;