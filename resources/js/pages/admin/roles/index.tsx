import { Head } from '@inertiajs/react';
import { index } from '@/routes/admin/roles';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import RoleFormSheet from '@/components/admin/roles/roleFormSheet';

type Role = {
    id: number;
    name: string;
    guard_name?: string;
    users_count?: number;
    created_at?: string;
};

export default function Index({
    roles = []
}: {
    roles: Role[];
}) {
    const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        try {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <>
            <Head title="Roles" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Roles
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage system roles and their assigned access.
                        </p>
                    </div>

                    <Button onClick={() => {setIsRoleFormOpen(true)}} className="gap-2">
                        <Plus className="size-4" />
                        <span>Add Role</span>
                    </Button>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="py-3.5 pl-6 font-semibold">Role Name</TableHead>
                                    <TableHead className="py-3.5 font-semibold">Guard</TableHead>
                                    <TableHead className="py-3.5 font-semibold">Users</TableHead>
                                    <TableHead className="py-3.5 font-semibold">Created</TableHead>
                                    <TableHead className="py-3.5 pr-6 text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-28 text-center text-muted-foreground"
                                        >
                                            No roles available.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    roles.map((role) => (
                                        <TableRow
                                            key={role.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="py-3.5 pl-6 font-medium">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                                                        <Shield className="size-4" />
                                                    </div>
                                                    <span className="text-foreground capitalize">{role.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3.5 text-muted-foreground">
                                                <Badge variant="secondary" className="font-mono text-xs">
                                                    {role.guard_name ?? 'web'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-3.5">
                                                <Badge variant="outline" className="text-xs">
                                                    {role.users_count ?? 0} {role.users_count === 1 ? 'user' : 'users'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-3.5 text-sm text-muted-foreground">
                                                {formatDate(role.created_at)}
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <MoreHorizontal className="size-4" />
                                                            <span className="sr-only">Actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-32">
                                                        <DropdownMenuItem asChild>
                                                            <Button variant="ghost" className="cursor-pointer w-full text-center">
                                                                View
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Button variant="ghost" className="cursor-pointer w-full text-center">
                                                                Edit
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Button variant="destructive" className="cursor-pointer w-full text-center">
                                                                Delete
                                                            </Button>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <RoleFormSheet open={isRoleFormOpen} onOpenChange={setIsRoleFormOpen} />
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Roles',
            href: index(),
        },
    ],
};
