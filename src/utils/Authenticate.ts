/* eslint-disable */
import { User } from "@prisma/client";
import { getSession } from "next-auth/react";

export const AuthenticateUser = async (context: any) => {
  const session = await getSession(context);
  const user = session?.user as User;

  if (!session) {
    return {
      redirect: {
        destination: `/signin`,
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
};

export const AuthenticateNotUser = async (context: any) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
