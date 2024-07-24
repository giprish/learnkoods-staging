import { headers } from "@/next.config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const sendData = async ({ url, method, body, headers }) => {
  const options = {
    method,
    headers: {
      ...headers,
    },
    body: body,
  };

  const resposne = await fetch(url, options);

  return resposne.json();
};

const useMutate = (onSuccess, onError) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: sendData,
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);

      //   console.log("response from api", data);
    },
    onError: (error) => {
      if (onError) onError(error);
      //   console.log("ERROR", err);
    },
  });

  return mutation;
};

export { useMutate };
