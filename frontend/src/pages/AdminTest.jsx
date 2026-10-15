import { useState, useEffect } from 'react';
import { authUtils } from '../utils/auth';

export default function AdminTest() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const currentUser = authUtils.getUser();
    const currentToken = authUtils.getToken();
    setUser(currentUser);
    setToken(currentToken);
    console.log('User:', currentUser);
    console.log('Token:', currentToken);
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Admin Test Page</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">User Info:</h2>
          <pre className="bg-zinc-800 p-4 rounded text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Token:</h2>
          <p className="bg-zinc-800 p-4 rounded text-sm break-all">
            {token || 'No token found'}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Is Admin:</h2>
          <p className="text-lg">
            {user?.role === 'admin' ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
    </div>
  );
}