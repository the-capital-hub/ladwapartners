"use client";

import React, { useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/ladwapartners.png";

const Home = () => {
	const router = useRouter();

	// On page mount redirect to /home
	useEffect(() => {
		router.push("/home");
	});

	return (
		<div className="flex items-center justify-center h-screen">
			<Image src={Logo} alt="Logo" width={400} height={400} />
		</div>
	);
};

// const Home = () => {
// 	redirect("/home");
// };

export default Home;
