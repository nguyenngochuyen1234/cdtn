import { jwtDecode } from 'jwt-decode';
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
export function logout(navigate: any) {
    navigate('/login');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
}
