import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const LinkedInCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing LinkedIn login...');

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');
            const state = searchParams.get('state');

            console.log('🔗 LinkedIn callback received:');
            console.log('Code:', code ? '✓ Present' : '✗ Missing');
            console.log('Error:', error || 'None');
            console.log('State:', state || 'None');

            if (error) {
                setStatus(`LinkedIn error: ${error}. Redirecting...`);
                console.error('LinkedIn error:', error);
                setTimeout(() => {
                    navigate('/login?error=linkedin_failed');
                }, 2000);
                return;
            }

            if (!code) {
                setStatus('No authorization code received. Redirecting...');
                console.error('No code received');
                setTimeout(() => {
                    navigate('/login?error=no_code');
                }, 2000);
                return;
            }

            try {
                setStatus('Verifying LinkedIn authentication...');
                
                // ✅ CORRECT ENDPOINT:
                const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-q0wc.onrender.com';
                const apiUrl = `${backendUrl}/api/linkedin/callback?code=${code}`;
                
                console.log('🔗 Calling backend:', apiUrl);
                
                const response = await fetch(apiUrl);
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server error response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('✅ Backend response:', data);
                
                if (data.success) {
                    setStatus('Login successful! Redirecting...');
                    
                    // Save tokens
                    localStorage.setItem('accessToken', data.token);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    
                    console.log('✅ LinkedIn login successful');
                    console.log('User data saved:', data.user);
                    
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1000);
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('❌ Callback error:', error);
                setStatus(`Error: ${error.message}. Redirecting...`);
                
                setTimeout(() => {
                    navigate('/login?error=auth_failed');
                }, 2000);
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f3f4f6'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                width: '100%'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#0077B5',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg width="30" height="30" fill="white" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </div>
                
                <h3 style={{ marginBottom: '10px', color: '#1f2937' }}>
                    {status}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                    Please wait while we complete your login
                </p>
                
                <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginTop: '20px'
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: '#0077B5',
                        animation: 'loading 1.5s infinite'
                    }}></div>
                </div>
                
                <style>{`
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
                
                {/* Debug info */}
                <div style={{
                    marginTop: '30px',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    fontSize: '12px',
                    textAlign: 'left',
                    color: '#4b5563'
                }}>
                    <p><strong>Debug Info:</strong></p>
                    <p>Backend URL: {import.meta.env.VITE_API_BASE_URL || 'Not set'}</p>
                    <p>Environment: {import.meta.env.MODE}</p>
                </div>
            </div>
        </div>
    );
};

export default LinkedInCallback;





























































































































































// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';

// const LinkedInCallback = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState('Processing LinkedIn login...');
  
//   const code = searchParams.get('code');
//   const error = searchParams.get('error');
//   const state = searchParams.get('state');

//   useEffect(() => {
//     const handleCallback = async () => {
//       if (error) {
//         console.error('❌ LinkedIn OAuth error:', error);
//         setStatus('Login failed. Redirecting...');
//         setTimeout(() => {
//           navigate('/login?error=linkedin_failed');
//         }, 2000);
//         return;
//       }

//       if (!code) {
//         console.error('❌ No authorization code found');
//         setStatus('No code received. Redirecting...');
//         setTimeout(() => {
//           navigate('/login?error=no_code');
//         }, 2000);
//         return;
//       }

//       try {
//         console.log('🔐 LinkedIn callback received with code:', code);
//         setStatus('Verifying LinkedIn authentication...');
        
//         // IMPORTANT: Use the correct backend endpoint
//         const response = await fetch(`http://localhost:3435/api/linkedin/callback?code=${code}&state=${state || ''}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           }
//         });
        
//         const data = await response.json();
//         console.log('Backend response:', data);
        
//         if (!response.ok) {
//           throw new Error(data.message || `HTTP error! status: ${response.status}`);
//         }
        
//         if (data.success && data.token) {
//           // Save tokens & user data
//           localStorage.setItem("accessToken", data.token);
//           localStorage.setItem("currentUser", JSON.stringify(data.user));
          
//           console.log('✅ LinkedIn login successful');
//           setStatus('Login successful! Redirecting...');
          
//           setTimeout(() => {
//             navigate('/dashboard');
//           }, 1000);
//         } else {
//           throw new Error(data.message || 'Authentication failed');
//         }
//       } catch (error) {
//         console.error('❌ LinkedIn callback error:', error);
//         setStatus(`Error: ${error.message}. Redirecting...`);
        
//         setTimeout(() => {
//           navigate('/login?error=linkedin_auth_failed');
//         }, 2000);
//       } finally {
//         setLoading(false);
//       }
//     };

//     handleCallback();
//   }, [code, error, state, navigate]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
//         {loading ? (
//           <>
//             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-6 text-lg font-medium text-gray-800">{status}</p>
//             <p className="mt-2 text-sm text-gray-500">Please wait while we authenticate you</p>
//           </>
//         ) : (
//           <>
//             <div className="h-16 w-16 mx-auto mb-4">
//               <div className="text-4xl">✅</div>
//             </div>
//             <p className="text-lg font-medium text-gray-800">{status}</p>
//             <p className="mt-2 text-sm text-gray-500">You will be redirected shortly</p>
//           </>
//         )}
        
//         {/* Debug info */}
//         <div className="mt-8 p-4 bg-gray-100 rounded text-left">
//           <p className="text-xs text-gray-600 font-mono">
//             Code: {code ? '✓ Received' : '✗ Missing'}<br/>
//             Error: {error || 'None'}<br/>
//             State: {state || 'None'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LinkedInCallback;

















