import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/users/UserProfile";
import { useGetCurrentUserUS } from "../api/homePage";
import { useUpdateUserUS } from "../api/homePage";
import { useAuth } from "../contexts/AuthContext";

const AccountPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { data: userData, isLoading, error } = useGetCurrentUserUS();
  const updateUserMutation = useUpdateUserUS();

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleUpdateProfile = async (formData) => {
    try {
      await updateUserMutation.mutateAsync({
        userId: userData?.data?.user_id,
        userData: formData,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = () => {
    // Implement password change logic here
    console.log("Change password clicked");
  };

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4">Error loading user data</div>;
  }

  return (
    <div className="container mx-auto">
      <UserProfile
        user={userData?.data}
        onUpdate={handleUpdateProfile}
        onChangePassword={handleChangePassword}
      />
    </div>
  );
};

export default AccountPage;
