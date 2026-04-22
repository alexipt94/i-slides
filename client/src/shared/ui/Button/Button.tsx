interface ButtonProps {
	label: string;
	disabled?: boolean;
}

export function Button({ label, disabled }: ButtonProps) {
	return (
		<button type="button" disabled={disabled}>
			{label}
		</button>
	);
}
