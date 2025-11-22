import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function fetcher<T>(
	url: string,
	options?: RequestInit
): Promise<T> {
	const res = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options?.headers || {}),
		},
	});

	if (!res.ok) throw new Error(`Error: ${res.status}`);

	return res.json();
}
