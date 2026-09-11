import {
    SheetContent,
    Sheet,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { Shield, UserPlus } from "lucide-react";
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from "@inertiajs/react";
import { store } from '@/routes/admin/roles'

type RoleFormSheetProps = {
    className?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function RoleFormSheet({ className, open, onOpenChange }: RoleFormSheetProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // if (user) {
        //     put(update.url(user.id), {
        //         onSuccess: () => {
        //             reset();
        //             onOpenChange(false);
        //         },
        //     });

        //     return;
        // }


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
                                Add New Role
                            </SheetTitle>
                            <SheetDescription className="text-xs text-muted-foreground">
                                Create New Role
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
                            <Label htmlFor="title" className="text-xs font-medium text-foreground">
                                Role Tilte
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
                            <span>{processing ? 'Creating...' : 'Create Role'}</span>
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
