import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authAPI from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import musicImg from "../../assets/img/doraemon-movie-44.jpg";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const token = response.data?.access_token;
      const refreshToken = response.data?.refresh_token;
      if (token) {
        localStorage.setItem("token", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        if (response.data?.user) {
          const userData = response.data.user;
          const userRole =
            userData.roles && userData.roles.length > 0
              ? userData.roles[0]
              : "user";
          const userInfo = {
            ...userData,
            role: userRole,
          };
          localStorage.setItem("user", JSON.stringify(userInfo));
          login(userInfo);
          const redirectPath = getRedirectPathByRole(userRole);
          navigate(redirectPath, { state: { loginSuccess: true } });
          toast.success(
            `Đăng nhập thành công! Chào mừng ${
              userData.full_name || userData.name || "bạn"
            }`,
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        } else {
          throw new Error("Không nhận được token từ server");
        }
      } else {
        throw new Error("Không nhận được token từ server");
      }
    } catch (error) {
      setLoading(false);
      let errorMessage = "Đăng nhập thất bại!";
      if (error.response) {
        const serverError = error.response.data;
        if (serverError.message) {
          errorMessage = serverError.message;
        } else if (serverError.error) {
          errorMessage = serverError.error;
        } else if (typeof serverError === "string") {
          errorMessage = serverError;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  const getRedirectPathByRole = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "booking_manager":
        return "/manage/dashboard";
      case "showtime_manager":
        return "/manage/dashboard";
      case "finance_manager":
        return "/finance/revenue";
      case "content_manager":
        return "/content/articles";
      case "district_manager":
        return "/district_manager/dashboard";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left: Image + Slogan */}
        <div
          className="w-1/2 flex flex-col justify-center items-center"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <img
            src={musicImg}
            alt="music"
            className="w-full object-cover rounded-2xl mb-10 shadow-lg"
          />
          {/* <h2 className="text-white text-3xl font-extrabold mb-2 text-center">
            Listen to your top musics <br />
            <span className="text-[#fff] text-4xl font-black">FOR FREE</span>
          </h2> */}
        </div>
        {/* Right: Login Form */}
        <div className="w-1/2 flex flex-col justify-center p-16">
          <h2
            className="text-4xl font-bold mb-8 text-center"
            style={{ color: "var(--color-blue)" }}
          >
            Sign In
          </h2>
          <form onSubmit={handleLogin} className="space-y-7">
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--color-blue)" }}
              >
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 pr-10"
                style={{
                  borderColor: "var(--color-blue)",
                  color: "var(--color-hover)",
                  background: "#fff",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--color-blue)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 pr-10"
                  style={{
                    borderColor: "var(--color-blue)",
                    color: "var(--color-hover)",
                    background: "#fff",
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  style={{ color: "var(--color-hover)" }}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span
                  className="text-xs"
                  style={{ color: "var(--color-blue)" }}
                >
                  Remember me
                </span>
              </div>
              <a
                href="#"
                className="text-xs hover:underline"
                style={{ color: "var(--color-hover)" }}
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full font-bold py-2 rounded transition cursor-pointer"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "black",
                border: "2px solid var(--color-primary)",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--color-hover)";
                e.target.style.color = "white";
                e.target.style.borderColor = "var(--color-hover)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "var(--color-primary)";
                e.target.style.color = "black";
                e.target.style.borderColor = "var(--color-primary)";
              }}
              disabled={loading}
            >
              {loading ? "ĐANG XỬ LÝ..." : "Sign In"}
            </button>
            <div className="flex items-center my-2">
              <div
                className="flex-grow h-px"
                style={{ background: "var(--color-blue)" }}
              ></div>
              <span className="mx-2 text-gray-400 text-xs">OR</span>
              <div
                className="flex-grow h-px"
                style={{ background: "var(--color-blue)" }}
              ></div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="border py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer"
                style={{
                  borderColor: "var(--color-blue)",
                  color: "var(--color-blue)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "var(--color-hover)";
                  e.target.style.color = "white";
                  e.target.style.borderColor = "var(--color-hover)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.color = "var(--color-blue)";
                  e.target.style.borderColor = "var(--color-blue)";
                }}
              >
                <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                  G
                </span>
                Sign in with Google
              </button>
              <button
                type="button"
                className="border py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer"
                style={{
                  borderColor: "var(--color-blue)",
                  color: "var(--color-blue)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "var(--color-hover)";
                  e.target.style.color = "white";
                  e.target.style.borderColor = "var(--color-hover)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.color = "var(--color-blue)";
                  e.target.style.borderColor = "var(--color-blue)";
                }}
              >
                <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                  f
                </span>
                Sign in with Facebook
              </button>
            </div>
            <div className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="hover:underline"
                style={{ color: "var(--color-hover)" }}
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
