import { createChannel, joinChannel } from "../services/meetApi";
import { useMutation } from "@tanstack/react-query";

export const useCreateChannel = () => {
    return useMutation({
      mutationFn: createChannel,
    });
  };

  export const useJoinChannel = () => {
    return useMutation({
      mutationFn: joinChannel,
    });
  };
