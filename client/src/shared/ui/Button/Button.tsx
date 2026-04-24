type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps {
	children: React.ReactNode;
	disabled?: boolean;
	variant?: ButtonVariant;
	size?: ButtonSize;
}

export function Button({ children, disabled, variant = 'primary', size = 'medium' }: ButtonProps) {
	const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };
	const variantSize = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg',
  };
	return (
		<button type="button" disabled={disabled} className={`${variantClass[variant]} ${variantSize[size]}`}>
			{children}
		</button>
	);
}
