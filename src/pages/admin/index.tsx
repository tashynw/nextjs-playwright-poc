import { Button, HStack, Heading, Spacer, VStack } from "@chakra-ui/react";
import MainLayout from "~/components/Layout/Sidebar";
import React from "react";
import { User } from "@prisma/client";
import { AuthenticateUser } from "~/utils/Authenticate";
import { signOut } from "next-auth/react";

type Props = {
  user: User;
};

const AdminBasePage = ({ user }: Props) => {
  return (
    <VStack w="100%" alignItems="flex-start">
      <HStack alignItems="center" w="100%">
        <Heading size="lg">Hello, {user?.name}</Heading>
        <Spacer />
        <Button colorScheme="red" onClick={() => signOut({ callbackUrl: "/" })}>
          Log out
        </Button>
      </HStack>
    </VStack>
  );
};

export default AdminBasePage;

AdminBasePage.getLayout = function getLayout(page: any) {
  return <MainLayout pageTitle="Prisoner">{page}</MainLayout>;
};

export async function getServerSideProps(context: any) {
  return await AuthenticateUser(context);
}
