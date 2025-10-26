import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "STUDENT" | "TEACHER";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string;
    role: "STUDENT" | "TEACHER";
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: "STUDENT" | "TEACHER";
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
