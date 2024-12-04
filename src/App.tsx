
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import VerificationCodePage from "./pages/auth/VerificationCodePage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import AuthPage from "./pages/auth/AuthPage"
import SearchPage from "./pages/searchPage/SearchPage"
import Main from "./pages/home"
import HomePage from "./pages/home/HomePage"
import DetailPost from "./pages/detailPost/DetailPost"
import ProfilePage from "./pages/auth/ProfilePage"
import OtherUserPage from "./pages/auth/OtherUserPage"
import AdminPage from "./pages/admin"
import PostsPage from "./pages/admin/PostsPage"
import StatisticsPage from "./pages/admin/StatisticsPage"
import ModerationPage from "./pages/admin/ModerationPage"
import CategoriesPage from "./pages/admin/CategoriesPage"
import UsersPage from "./pages/admin/UsersPage"
import OverviewPage from "./pages/admin/OverviewPage"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Main />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="detailPost" element={<DetailPost />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="other-user/:idUser" element={<OtherUserPage />} />

        </Route>
        <Route path="/auth" element={<AuthPage />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<RegisterPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="verfication" element={<VerificationCodePage />} />
        </Route>
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
  )
}