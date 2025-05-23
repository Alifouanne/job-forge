import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Github, Google],
});

export const reqUser = async () => {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }
  return session.user;
};
