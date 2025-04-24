import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
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
import StatisticsPage from './pages/admin/StatisticsPage';
import StatisticsPageOwner from './pages/owner/StatisticsPage';
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
import { useEffect } from 'react';
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
import AdvertisementPage from './pages/admin/AdvertisementPage';
// import BusinessInfo from './pages/owner/BusinessInfo';
import AboutPage from './pages/about';
import PoliciesPage from './pages/policy';
import ReviewList from './components/ReviewList';
import { ToastContainer } from 'react-toastify';
import WriteReview from './components/shop/WriteReview';
import OpeningHoursPage from './pages/owner/OpeningHoursPage';
import ServicesList from './components/shop/Service';
import ServiceDetailPage from './components/shop/ServiceDetailPage';
import FavoriteStores from './components/shop/FavoritePage';
import AdvertisementPackageList from './pages/owner/AdvertisementPackageList';
import PaymentStatus from './pages/owner/PaymentCard';
import PaymentResult from './pages/owner/PaymentResult';

export default function App() {
    const dispatch = useDispatch();

    const fetchUser = async () => {
        try {
            const res = await userApi.getUser();
            if (res.data.success) {
                dispatch(setUser(res.data.data));
            } else {
                dispatch(setUser(null));
                localStorage.removeItem('access_token');
            }
        } catch (err) {
            console.error('Error fetching user:', err);
            dispatch(setUser(null));
            localStorage.removeItem('access_token');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser();
        }
    }, []);

    const NoFooterLayout = () => {
        return <Outlet />;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />}>
                    <Route index element={<HomePage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="detailPost/:id" element={<DetailPost />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="other-user/:idUser" element={<OtherUserPage />} />
                    <Route path="authenticate" element={<NoFooterLayout />}>
                        <Route index element={<Authenticate />} />
                    </Route>
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="policy" element={<PoliciesPage />} />
                    <Route path="/reviews" element={<ReviewList />} />
                    <Route path="write-review/shop/:shopId" element={<WriteReview />} />
                    <Route path="write-review/service/:serviceId" element={<WriteReview />} />
                    <Route path="/shop/:shopId/service" element={<ServicesList />} />
                    <Route path="/shop/service/:serviceId" element={<ServiceDetailPage />} />
                    <Route path="/favorites" element={<FavoriteStores></FavoriteStores>}></Route>
                </Route>
                <Route path="/auth" element={<AuthPage />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<RegisterPage />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="verfication" element={<VerificationCodePage />} />
                    <Route path="verify-account" element={<ActiveCodeUser />} />
                </Route>
                <Route path="/owner" element={<OwnerPage />}>
                    <Route path="payment-result" element={<PaymentResult />} />
                    <Route index element={<StatisticsPageOwner />} />
                    <Route path="profile" element={<OwnerProfile />} />
                    <Route path="business-info" element={<BusinessInfo />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="opening-hours" element={<OpeningHoursPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route
                        path="advertisement"
                        element={<AdvertisementPackageList></AdvertisementPackageList>}
                    ></Route>
                    <Route path="history" element={<PaymentStatus></PaymentStatus>}></Route>
                </Route>

                <Route path="/biz" element={<CreateShop />}>
                    <Route path="register-shop" element={<RegisterAccountShopPage />} />
                    <Route path="create-tag" element={<CreateTagPage />} />
                    <Route path="create-shop" element={<StoreCreationPage />} />
                    <Route path="upload-image" element={<UploadImagePage />} />
                </Route>
                <Route path="finish-create-shop" element={<FinishCreateShop />} />

                {/* <Route path="writeareview" element={<BusinessSearch />} /> */}
                <Route path="writeareview/biz/:id" element={<ReviewBusiness />} />
                <Route path="/admin" element={<AdminPage />}>
                    <Route index element={<StatisticsPage />} />
                    <Route path="moderation" element={<ModerationPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="advertisement" element={<AdvertisementPage />} />
                </Route>
            </Routes>
            <ToastContainer position="bottom-center" autoClose={3000} pauseOnFocusLoss={false} />
        </BrowserRouter>
    );
}
