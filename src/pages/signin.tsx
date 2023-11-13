import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  Stack,
  Center,
  VStack,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  useToast,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signInSchema } from "~/modules/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthenticateNotUser } from "~/utils/Authenticate";
import { User } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";

export default function SignInPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signInSchema) });
  const [currentUser, setCurrentUser] = useState<Omit<User, "password">>();
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const submitSignIn = handleSubmit(async (values) => {
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (res?.error) {
      toast({
        title: `Login Failed`,
        description: res["error"],
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    } else {
      toast({
        title: `Login Successful`,
        description: `You successfully logged in`,
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });

      router.push("/admin");
    }
    setLoading(false);
  });

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"gray.50"}>
        <Stack spacing={5} mx={"auto"} py={12} px={6}>
          <Box
            rounded={"lg"}
            bg={"white"}
            boxShadow={"lg"}
            p={8}
            minWidth={["-moz-max-content", "450px"]}
          >
            <VStack spacing={4}>
              <Heading size={"md"} mb={5}>
                Login!
              </Heading>

              {/* Email */}
              <FormControl
                isRequired={true}
                isInvalid={errors?.email != null}
                id="email"
              >
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register("email")} />
                <FormErrorMessage>
                  {errors?.email && String(errors?.email?.message)}
                </FormErrorMessage>
              </FormControl>

              {/* Password */}
              <FormControl
                isRequired={true}
                isInvalid={errors?.password != null}
                id="password"
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? `text` : `password`}
                    {...register("password")}
                  />
                  <InputRightElement
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <ViewOffIcon fontSize={20} color="blue.700" />
                    ) : (
                      <ViewIcon fontSize={20} color="blue.700" />
                    )}
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors?.password && String(errors?.password?.message)}
                </FormErrorMessage>
              </FormControl>

              <Button
                bg={"blue.700"}
                color={"white"}
                mt={4}
                _hover={{
                  bg: "blue.800",
                }}
                isLoading={loading}
                onClick={() => submitSignIn()}
                w={"100%"}
              >
                Login
              </Button>
              <Link href="/signup" style={{ textDecoration: "underline" }}>
                Sign Up here
              </Link>
            </VStack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export async function getServerSideProps(context: any) {
  return await AuthenticateNotUser(context);
}
