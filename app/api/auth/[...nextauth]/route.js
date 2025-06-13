import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // use the path relative to your project

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
