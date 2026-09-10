import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, UserPlus, User } from 'lucide-react';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';

import { store, update } from '@/routes/admin/users'

type User = {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
};

export default function CreateUserSheet({
    open,
    onOpenChange,
    user,
    className,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    className?: string;
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        is_active: user?.is_active ?? true,
    });

    useEffect(() => {
        setData({
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
            password_confirmation: '',
            is_active: user?.is_active ?? true,
        })
    }, [user, open]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            put(update.url(user.id), {
                onSuccess: () => {
                    reset();
                    onOpenChange(false);
                },
            });

            return;
        }


        post(store.url(), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className={cn(
                    'flex h-full w-full flex-col gap-0 p-0 sm:max-w-md',
                    className
                )}
            >
                {/* Header */}
                <SheetHeader className="border-b border-border/70 px-4 py-4 pr-12 sm:px-6 sm:py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                            <UserPlus className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <SheetTitle className="truncate text-base font-semibold tracking-tight sm:text-lg">
                                {user ? 'Edit User' : 'Add New User'}
                            </SheetTitle>
                            <SheetDescription className="text-xs text-muted-foreground">
                                {user ? 'Update the user details.' : ' Create a new account and set their access status.'}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col justify-between overflow-y-auto"
                >
                    <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-medium text-foreground">
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Jane Doe"
                                    className="h-9.5 pl-9 text-sm"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-medium text-foreground">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="jane.doe@example.com"
                                    className="h-9.5 pl-9 text-sm"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-medium text-foreground">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="h-9.5 pr-10 pl-9 text-sm"
                                    required={!user}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground/70 transition-colors hover:text-foreground focus:outline-hidden"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password_confirmation" className="text-xs font-medium text-foreground">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="h-9.5 pr-10 pl-9 text-sm"
                                    required={!user}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground/70 transition-colors hover:text-foreground focus:outline-hidden"
                                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        {/* Status Toggle Card */}
                        <div className="mt-2 flex items-center justify-between rounded-xl border border-border/80 bg-muted/30 p-3.5 transition-colors hover:bg-muted/40">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex size-7 items-center justify-center rounded-md bg-background text-muted-foreground shadow-2xs">
                                    <ShieldCheck className="size-4 text-primary" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label htmlFor="is_active" className="text-xs font-medium cursor-pointer">
                                        Account Active
                                    </Label>
                                    <p className="text-[11px] leading-tight text-muted-foreground">
                                        Allow this user immediate login access.
                                    </p>
                                </div>
                            </div>

                            <Switch
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(value) => setData('is_active', value)}
                            />
                        </div>
                        <InputError message={errors.is_active} />
                    </div>

                    {/* Footer Actions */}
                    <SheetFooter className="border-t border-border/70 bg-muted/20 px-4 py-4 sm:flex-row sm:justify-end sm:gap-2.5 sm:px-6">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 w-full sm:w-auto"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>

                        <Button disabled={processing} type="submit" size="sm" className="h-9 w-full gap-1.5 shadow-xs sm:w-auto">
                            <UserPlus className="size-4" />
                            <span>{processing ? user ? 'Updating...' : 'Creating...' : user ? 'Update User' : 'Create User'}</span>
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}