import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { authKeys } from "@/features/auth/hooks/auth-query-keys";
import { fetchProfile, updateProfile } from "../service";
import type { ProfileUpdateRequest } from "../types";

export function useProfile() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: fetchProfile,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProfileUpdateRequest) => updateProfile(input),
    onSuccess: (profile) => {
      queryClient.setQueryData(authKeys.currentUser(), profile);
      toast.success("اطلاعات پروفایل به‌روزرسانی شد");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "به‌روزرسانی پروفایل ناموفق بود"));
    },
  });
}
