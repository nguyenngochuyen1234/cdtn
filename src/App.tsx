import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerificationCodePage from './pages/auth/VerificationCodePage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AuthPage from './pages/auth/AuthPage';
import SearchPage from './pages/searchPage/SearchPage';
import Main from './pages/home';
import HomePage from './pages/home/HomePage';
import DetailPost from './pages/detailPost/DetailPost';
import ProfilePage from './pages/auth/ProfilePage';
import OtherUserPage from './pages/auth/OtherUserPage';
import AdminPage from './pages/admin';
import PostsPage from './pages/admin/PostsPage';
import StatisticsPage from './pages/admin/StatisticsPage';
import ModerationPage from './pages/admin/ModerationPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import UsersPage from './pages/admin/UsersPage';
import OverviewPage from './pages/admin/OverviewPage';
import RegisterAccountShopPage from './pages/createShop/RegisterAccountShopPage';
import StoreCreationPage from './pages/createShop/StoreCreationPage';
import CreateShop from './pages/createShop/CreateShop';
import CreateTagPage from './pages/createShop/CreateTagPage';
import UploadImagePage from './pages/createShop/UploadImagePage';
import FinishCreateShop from './pages/createShop/FinishCreateShop';
import { useEffect, useState } from 'react';
import { User } from './models';
import userApi from './api/userApi';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/userSlice';
import ActiveCodeUser from './pages/auth/ActiveUser';
import BusinessSearch from './pages/reviewShop/BusinessSearch';
import Authenticate from './pages/auth/Authenticate';
import ReviewBusiness from './pages/reviewShop/ReviewBusiness';
import OwnerPage from './pages/owner/index';
import ServicesPage from './pages/owner/ServicesPage';
import ReviewsPage from './pages/owner/ReviewsPage';
import OwnerProfile from './pages/owner/ProfilePage';
import BusinessInfo from './pages/owner/BusinessInfo';
export default function App() {
    const dispatch = useDispatch();
    const fetchUser = async () => {
        try {
            const res = await userApi.getUser();
            if (res.data.success) {
                dispatch(setUser(res.data.data));
            }
        } catch (err) {}
    };
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />}>
                    <Route index element={<HomePage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="detailPost" element={<DetailPost />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="other-user/:idUser" element={<OtherUserPage />} />
                    <Route path='authenticate' element ={<Authenticate></Authenticate>}></Route>
                </Route>
                <Route path="/auth" element={<AuthPage />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<RegisterPage />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="verfication" element={<VerificationCodePage />} />
                    <Route
                        path="verify-account"
                        element={<ActiveCodeUser></ActiveCodeUser>}
                    ></Route>
                </Route>
                <Route path="/owner" element={<OwnerPage />}>
                    <Route path="profile" element={<OwnerProfile />} />
                    <Route path="business-info" element={<BusinessInfo />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                </Route>
                <Route path="/biz" element={<CreateShop />}>
                    <Route path="register-shop" element={<RegisterAccountShopPage />} />
                    <Route path="create-tag" element={<CreateTagPage />} />
                    <Route path="create-shop" element={<StoreCreationPage />} />
                    <Route path="upload-image" element={<UploadImagePage />} />
                </Route>
                <Route path="finish-create-shop" element={<FinishCreateShop />} />
                <Route path="writeareview" element={<BusinessSearch />} />
                <Route path="writeareview/biz/:id" element={<ReviewBusiness />} />
                <Route path="/admin" element={<AdminPage />}>
                    <Route index element={<OverviewPage />} />
                    <Route path="posts" element={<PostsPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="moderation" element={<ModerationPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="users" element={<UsersPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
