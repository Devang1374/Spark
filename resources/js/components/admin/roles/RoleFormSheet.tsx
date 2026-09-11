import {
    SheetContent,
    Sheet,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet";

import { Checkbox } from "@/components/ui/checkbox";

import { cn } from "@/lib/utils";
import { Shield, ShieldCheck } from "lucide-react";
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo } from 'react';
import { useForm } from "@inertiajs/react";
import { store } from '@/routes/admin/roles';
import { update } from '@/routes/admin/roles';

type RoleFormSheetProps = {
    className?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    permissions: Permission[];
    role: role | null;
};

type Permission = {
    id: number,
    name: string,
}

type role = {
    id: number,
    name: string,
    permissions: Permission[]
}

export default function RoleFormSheet({ className, open, onOpenChange, permissions = [], role }: RoleFormSheetProps) {
    const { data, setData, put, post, processing, errors, reset } = useForm<{
        title: string;
        permissions: number[];
    }>({
        title: role?.name || '',
        permissions: role?.permissions.map((p) => p.id) || [],
    });

    useEffect(() => {
        setData({
            title: role?.name || '',
            permissions: role?.permissions.map((p) => p.id) || [],
        })
    }, [role, open]);

    const togglePermission = (id: number) => {
        setData(
            'permissions',
            data.permissions.includes(id)
                ? data.permissions.filter((pId) => pId !== id)
                : [...data.permissions, id]
        );
    };

    const toggleAll = () => {
        if (data.permissions.length === permissions.length) {
            setData('permissions', []);
        } else {
            setData('permissions', permissions.map((p) => p.id));
        }
    };

    const groupedPermissions = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        (permissions ?? []).forEach((permission) => {
            const [group = 'general'] = permission.name.split('.');
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(permission);
        });
        return groups;
    }, [permissions]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.title) return;

        if (role) {
            put(update.url(role.id), {
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
                            <ShieldCheck className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <SheetTitle className="truncate text-base font-semibold tracking-tight sm:text-lg">
                                {role ? 'Edit Role' : 'Add New Role'}
                            </SheetTitle>
                            <SheetDescription className="text-xs text-muted-foreground">
                                {role ? 'Update Role Details' : 'Create New Role'}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col justify-between overflow-y-auto"
                >
                    <div className="space-y-6 px-4 py-4 sm:px-6 sm:py-5">
                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-xs font-medium text-foreground">
                                Role Title
                            </Label>

                            <div className="relative">
                                <Shield className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Super Admin"
                                    className="h-9.5 pl-9 text-sm"
                                    required
                                />
                            </div>
                            <InputError message={errors.title} />
                        </div>

                        {/* Permissions Field */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-xs font-medium text-foreground">
                                        Role Permissions
                                    </Label>
                                    <p className="text-[11px] text-muted-foreground">
                                        Select the permissions granted to this role.
                                    </p>
                                </div>
                                {permissions?.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={toggleAll}
                                        className="text-xs font-medium text-primary hover:underline"
                                    >
                                        {data.permissions.length === permissions.length ? 'Deselect all' : 'Select all'}
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {Object.entries(groupedPermissions).map(([group, perms]) => (
                                    <div
                                        key={group}
                                        className="overflow-hidden rounded-lg border border-border/60 bg-muted/20"
                                    >
                                        <div className="flex items-center justify-between border-b border-border/50 bg-muted/40 px-3 py-1.5">
                                            <span className="text-xs font-semibold capitalize text-foreground">
                                                {group}
                                            </span>
                                            <span className="text-[10px] font-medium text-muted-foreground">
                                                {perms.filter((p) => data.permissions.includes(p.id)).length} / {perms.length} selected
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 p-2.5">
                                            {perms.map((permission) => {
                                                const isChecked = data.permissions.includes(permission.id);
                                                const action = permission.name.includes('.')
                                                    ? permission.name.split('.').slice(1).join(' ')
                                                    : permission.name;

                                                return (
                                                    <label
                                                        key={permission.id}
                                                        htmlFor={`permission-${permission.id}`}
                                                        className={cn(
                                                            'flex cursor-pointer select-none items-center gap-2.5 rounded-md border p-2 text-xs transition-colors',
                                                            isChecked
                                                                ? 'border-primary/40 bg-primary/10 font-medium text-foreground dark:bg-primary/20'
                                                                : 'border-border/60 bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                                        )}
                                                    >
                                                        <Checkbox
                                                            id={`permission-${permission.id}`}
                                                            checked={isChecked}
                                                            onCheckedChange={() => togglePermission(permission.id)}
                                                        />
                                                        <span className="truncate capitalize">
                                                            {action}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <InputError message={errors.permissions} />
                        </div>
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
                            <ShieldCheck className="size-4" />
                            <span>{processing ? role ? 'Updating...' : 'Creating...' : role ? 'Update Role' : 'Create Role'}</span>
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
