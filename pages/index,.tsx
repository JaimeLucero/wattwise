// pages/index.tsx
import { GetServerSideProps } from "next";

const Index = () => {
  return null; // Empty return since we redirect
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/home", // Redirect to the /home folder route
      permanent: false, // Temporary redirect (307)
    },
  };
};

export default Index;
