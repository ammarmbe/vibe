"use client";
import ReactDOM from "react-dom";

export function PreloadResources() {
	ReactDOM.preconnect("https://clerk.ambe.dev");

	return null;
}
