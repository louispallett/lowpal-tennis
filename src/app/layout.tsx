import type { Metadata } from "next";
import "./styles/index.css";

export const metadata:Metadata = {
	title: "TTS",
	description: "",
};

export default function RootLayout({
  	children,
}:Readonly<{
  	children:React.ReactNode;
}>) {
	return (
		<html lang="en">
			<link rel="icon" type="image/svg+xml" href="/assets/images/racket-red.svg" />
			<body
			>
				{children}
			</body>
		</html>
	);
}
