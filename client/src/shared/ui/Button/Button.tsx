interface ButtonProps {
	children: React.ReactNode;
	disabled?: boolean;
}

export function Button({ children, disabled }: ButtonProps) {
	return (
		<button type="button" disabled={disabled}>
			{children}
		</button>
	);
}
