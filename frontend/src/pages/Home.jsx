import React from "react";
import useAuth from "../hooks/Auth/useAuth";
import { getGreeting } from "../services/getGreeting";
import { Clapperboard, User } from "lucide-react";

const Home = () => {
  const { currentUser } = useAuth();
  const user = currentUser?.user;

  const greeting = getGreeting();

  return (
    <div className="text-(--text-secondary)">
      

      

      

    </div>
  );
};

export default Home;
