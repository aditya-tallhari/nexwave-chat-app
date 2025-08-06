import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // don't retry if unauthenticated
  });

  // Normalize user data and fix typo
  const rawUser = authUserQuery.data?.user;
  const normalizedUser = rawUser
    ? {
        ...rawUser,
        isOnboarded: rawUser.isOnboarded ?? rawUser.isOnBorded ?? false, // ✅ typo fallback
      }
    : null;

  return {
    isLoading: authUserQuery.isLoading,
    authUser: normalizedUser,
  };
};

export default useAuthUser;
