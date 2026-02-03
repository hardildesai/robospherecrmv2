// ============================================
// Avatar Component
// ============================================

import { forwardRef } from 'react';
import { cn, initials } from '../../lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    name: string;
    size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, name, size = 'md', ...props }, ref) => {
        const avatarInitials = initials(name);

        return (
            <div
                ref={ref}
                className={cn(
                    'relative flex items-center justify-center',
                    'rounded-full bg-grid text-text-muted font-display font-semibold',
                    'border-2 border-void',
                    'overflow-hidden',
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {src ? (
                    <img
                        src={src}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    avatarInitials
                )}
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';
