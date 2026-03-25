import { useQuery } from "@tanstack/react-query";
import { getOrderOnboardingData } from "../services/actions";

export const useOrderOnboardingData = () => {
  return useQuery({
    queryKey: ["order-onboarding"],
    queryFn: getOrderOnboardingData,
  });
};
