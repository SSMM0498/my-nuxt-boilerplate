import { type UserModel } from '~~/types/'

export const useAuth = () => {
  const authUser = useAuthUser();
  const { handleAuthError } = useApiErrorHandler()

  const setUser = (user: UserModel | null) => {
    authUser.value = user;
  };

  /**
   * Logs in the user by calling our server API endpoint.
   * @param credentials - The user's email and password.
   * @returns The authenticated user model.
   */
  const login = async (credentials: { email?: string; password?: string }) => {
    try {
      const response = await $fetch<UserModel>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });
      setUser(response.user);
      return response.user;
    } catch (error: any) {
      throw error
    }
  };

  /**
   * Registers a new user by calling our server API endpoint.
   * @param details - The user's details for registration.
   * @returns The newly created user model.
  */
  const register = async (details: Record<string, any>) => {
    try {
      const response = await $fetch<UserModel>('/api/auth/register', {
        method: 'POST',
        body: details,
      });
      setUser(response.user);
      return response.user;
    } catch (error: any) {
      throw error
    }
  };

  /**
   * Logs out the current user by calling the server endpoint.
  */
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error: any) {
      // Even if logout fails, clear local state
      console.warn('Logout request failed, but clearing local state:', error)
    } finally {
      setUser(null);
    }
  };

  /**
   * Fetches the current user from the server to validate the session.
   * This is the key to synchronizing the client state with the server.
   */
  const checkAuth = async (): Promise<UserModel | null> => {
    try {
      const response = await $fetch<UserModel>('/api/auth/me');
      // Update the local persisted state with the fresh user data from the server.
      setUser(response.user);
      return response.user;
    } catch (error: any) {
      // For other errors, just clear state but don't redirect
      setUser(null);
      return null;
    }
  };

  /**
   * Updates the user's profile information (name and/or avatar).
   * @param data - The new profile data containing name and/or avatar file.
   * @returns The updated user model.
   */
  const updateProfile = async (data: Partial<UserModel> | FormData) => {
    try {
      const response = await $fetch<UserModel>('/api/auth/profile', {
        method: 'PATCH',
        body: data,
      });
      setUser(response.user);
      return response.user;
    } catch (error: any) {
      handleAuthError(error, 'profile update')
      throw error
    }
  };

  /**
   * Updates the user's password.
   * @param passwords - An object containing the old password, new password, and confirmation.
   * * This function does not return the updated user model, as the response is not needed.
   */
  const changePassword = async (passwords: Record<string, any>) => {
    try {
      // We don't need the response, but fetching it confirms success.
      await $fetch<UserModel>('/api/auth/change-password', {
        method: 'POST',
        body: passwords,
      });
    } catch (error: any) {
      handleAuthError(error, 'password change')
      throw error
    }
  };

  /**
   * Sends a request to change the user's email address.
   * @param newEmail - The new email address to request.
   * @returns A success message indicating the request was sent.
   */
  const requestEmailChange = async (newEmail: string) => {
    try {
      return await $fetch<{ success: boolean; message: string }>('/api/auth/request-email-change', {
        method: 'POST',
        body: { newEmail },
      });
    } catch (error: any) {
      handleAuthError(error, 'email change request')
      throw error
    }
  };

  /**
   * Permanently deletes the user's account.
   */
  const deleteAccount = async () => {
    try {
      const response = await $fetch('/api/auth/delete-account', {
        method: 'DELETE',
      });

      setUser(null);
      await navigateTo('/');
      return response;
    } catch (error: any) {
      handleAuthError(error, 'account deletion')
      throw error
    }
  };

  /**
   * Requests a password reset email to be sent to the user.
   * @param email - The user's email address.
   * @returns A success message indicating the reset email was sent.
   */
  const requestPasswordReset = async (email: string) => {
    try {
      return await $fetch<{ success: boolean; message: string }>('/api/auth/request-password-reset', {
        method: 'POST',
        body: { email },
      });
    } catch (error: any) {
      handleAuthError(error, 'password reset request')
      throw error
    }
  };


  // Expose the user state and auth functions
  return {
    setUser,
    checkAuth,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestEmailChange,
    deleteAccount,
    requestPasswordReset
  };
};