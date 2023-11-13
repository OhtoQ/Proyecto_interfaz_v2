import React from "react";
import Layout from "/src/components/Layout";
import StudentPage from "/src/components/StudentPage/StudentPage";
import ProfessorPage from "/src/components/ProfessorPage/ProfessorPage";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Index() {
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const { status, data: session } = useSession();
  const router = useRouter();
  const isPracticeDevelopment = process.env.NEXT_PUBLIC_PRACTICE === 1;

  React.useEffect(() => {
    if (status !== "authenticated" && !isRedirecting) {
      const redirectUrl = isPracticeDevelopment ? "direct" : "login";
      router.push(redirectUrl);
      setIsRedirecting(true);
    }
  }, [status, router, isRedirecting, isPracticeDevelopment]);

  if (status !== "authenticated") {
    return <Layout loading />;
  }

  return session.user.type === "student" ? <StudentPage /> : <ProfessorPage />;
}
