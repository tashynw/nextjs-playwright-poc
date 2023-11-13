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
import { SignUpType, signUpSchema } from "~/modules/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthenticateNotUser } from "~/utils/Authenticate";
import { User } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpType>({ resolver: zodResolver(signUpSchema) });
  const toast = useToast();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutate, isLoading } = api.auth.signUp.useMutation({
    onSuccess() {
      toast({
        title: `Account created successfully. Login now`,
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      router.push(`/signin`);
    },
    onError(err) {
      toast({
        title: `Signup Failed`,
        description: err?.message ?? err?.toString(),
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    },
  });

  const submitSignUp = handleSubmit(async (values) => {
    mutate(values);
  });

  return (
    <>
      <Head>
        <title>Sign up</title>
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
                Sign Up!
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

              <FormControl
                isRequired={true}
                isInvalid={errors?.name != null}
                id="name"
              >
                <FormLabel>Name</FormLabel>
                <Input type="name" {...register("name")} />
                <FormErrorMessage>
                  {errors?.name && String(errors?.name?.message)}
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
                isLoading={isLoading}
                onClick={() => submitSignUp()}
                w={"100%"}
              >
                Sign up
              </Button>
              <Link href="/signin" style={{ textDecoration: "underline" }}>
                Log in here
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
