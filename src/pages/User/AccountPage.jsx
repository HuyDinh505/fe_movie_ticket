import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import UserProfile from "../../components/users/UserProfile";
import { useGetCurrentUserUS, useUpdateUserUS } from "../../api/homePage";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { getApiMessage, handleApiError } from "../../Utilities/apiMessage";

const AccountPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();
  const { data: userData, isLoading, error } = useGetCurrentUserUS();
  const updateUserMutation = useUpdateUserUS({
    onSuccess: (data) => {
      const message = getApiMessage(data, "Cập nhật thông tin thành công!");
      toast.success(message);
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["GetCurrentUserAPI"] });
    },
    onError: (error) => {
      handleApiError(error, "Có lỗi xảy ra khi cập nhật thông tin!");
      console.error("Error updating profile:", error);
    },
  });

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
      // Error handling is done in the mutation's onError callback
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
    const errorMessage = getApiMessage(
      error,
      "Lỗi khi tải thông tin người dùng"
    );
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      </div>
    );
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
