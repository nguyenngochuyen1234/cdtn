import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/userSlice';
export interface JwtPayLoad {
    id: any;
    role: string;
    avatar: string;
    lastname: string;
    enabled: boolean;
}
export const isTokenExpired = (token: string) => {
    const decodedToken = jwtDecode(token);
    if (!decodedToken.exp) {
        return false;
    }
    const currentTime = Date.now() / 1000; //Thời gian hiện tại tính bằng giây
    return currentTime < decodedToken.exp;
};
export const isToken = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        return true;
    }
    return false;
};
export function getAvatarByToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
        const decodedToken = jwtDecode(token) as JwtPayLoad;
        return decodedToken.avatar;
    }
}
export function getLastNameByToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
        const decodedToken = jwtDecode(token) as JwtPayLoad;
        return decodedToken.lastname;
    }
}

export function getUsernameByToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
        return jwtDecode(token).sub;
    }
}

export function getIdUserByToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
        const decodedToken = jwtDecode(token) as JwtPayLoad;
        return decodedToken.id;
    }
}

export function getRoleByToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
        const decodedToken = jwtDecode(token) as JwtPayLoad;
        return decodedToken.role;
    }
}
export function logoutAPI(navigate: any) {
    const dispatch = useDispatch(); // Use dispatch to clear Redux state
    const token = localStorage.getItem('access_token');

    if (token) {
        fetch('http://localhost:8080/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
        })
            .then((response) => {
                if (!response.ok) {
                    console.error('Logout API failed:', response.statusText);
                }
                localStorage.removeItem('access_token');
                dispatch(logout()); // Dispatch the logout action to clear Redux state
                navigate('/auth/login');
            })
            .catch((error) => {
                console.error('Error calling logout API:', error);
                localStorage.removeItem('access_token');
                dispatch(logout()); // Also clear Redux state on error
                navigate('/auth/login');
            });
    } else {
        localStorage.removeItem('access_token');
        dispatch(logout()); // Clear Redux state even if no token exists
        navigate('/auth/login');
    }
}
export function logoutAPI1(navigate: any, dispatch: any) { // Add dispatch as a parameter
    const token = localStorage.getItem('access_token');
    
    if (token) {
      fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error('Logout API failed:', response.statusText);
          }
          localStorage.removeItem('access_token');
          dispatch(logout()); // Use the passed dispatch function
          navigate('/auth/login');
        })
        .catch((error) => {
          console.error('Error calling logout API:', error);
          localStorage.removeItem('access_token');
          dispatch(logout()); // Use the passed dispatch function
          navigate('/auth/login');
        });
    } else {
      localStorage.removeItem('access_token');
      dispatch(logout()); // Use the passed dispatch function
      navigate('/auth/login');
    }
  }
  