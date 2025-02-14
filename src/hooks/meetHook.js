import { createToken } from "../services/meetApi";
import { useMutation } from "@tanstack/react-query";

export const useCreateToken = () => {
    return useMutation({
      mutationFn: createToken,
    });
  };