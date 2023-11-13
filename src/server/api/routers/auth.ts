import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hash, compare } from "bcrypt";
import {
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "~/modules/Auth";

export const authRouter = createTRPCRouter({
  signIn: publicProcedure.input(signInSchema).query(async ({ ctx, input }) => {
    try {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (!user) throw new Error("Invalid email or password");

      const isMatch = await compare(input.password, user.password);
      if (!isMatch) throw new Error("Invalid email or password");

      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }),
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: {
            email: input.email,
          },
        });
        if (user) throw new Error("The email address is already taken.");

        const hashedPassword = await hash(input.password, 10);

        await ctx.db.user.create({
          data: {
            email: input.email,
            name: input.name,
            password: hashedPassword,
            emailConfirmed: false,
            role: "Member",
          },
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),
  setNewPassword: protectedProcedure
    .input(resetPasswordSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findFirstOrThrow({
          where: {
            id: input.id,
          },
        });

        const hashedPassword = await hash(input.password, 10);

        await ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            password: hashedPassword,
            emailConfirmed: true,
          },
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),
  getAllUsers: protectedProcedure.query(async ({ ctx, input }) => {
    try {
      const users = await ctx.db.user.findMany({
        select: {
          email: true,
          emailConfirmed: true,
          id: true,
          name: true,
          role: true,
        },
      });
      return users;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }),
  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.delete({
          where: {
            id: input.id,
          },
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),
});
