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
          
          const response = await fetch(`http://localhost:3435/linkedin/callback?code=${code}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const data = await response.json();
          console.log('Backend response:', data);
          
          if (data.success) {
            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            
            console.log('✅ LinkedIn login successful');
            navigate('/dashboard');
          } else {
            throw new Error(data.message || 'Login failed');
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-700">Completing LinkedIn login...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait while we authenticate you</p>
      </div>
    </div>
  );
};

export default LinkedInCallback;











// import { useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";

// export default function LinkedInCallback() {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const code = params.get("code");

//     if (!code) return navigate("/login");

//     fetch(`http://localhost:3435/api/auth/linkedin/callback?code=${code}`)
//       .then(res => res.json())
//       .then(data => {
//         localStorage.setItem("accessToken", data.token);
//         localStorage.setItem("refreshToken", data.refreshToken);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         navigate("/dashboard");
//       });
//   }, []);

//   return <p>Logging in...</p>;
// }









