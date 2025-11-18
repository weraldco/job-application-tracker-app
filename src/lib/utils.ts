import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function fetcher(url: string) {
	const response = await fetch(url);
	if (!response.ok) throw new Error('Network response was not ok!');
	return response.json();
}
