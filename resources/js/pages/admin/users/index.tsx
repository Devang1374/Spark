import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, MoreHorizontal, Plus, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import CreateUserSheet from '@/components/admin/users/UserFormSheet';
import { useState } from 'react';

import { index as usersRoute } from '@/routes/admin/users';

type User = {
    id: number;
    name: string;
    email: string;
    is_active?: boolean;
    email_verified_at?: string | null;
    created_at?: string;
};

type UsersIndexProps = {
    users: {
        data: User[];
    };
};

export default function Index({ users }: UsersIndexProps) {

    const [isUserFormOpen, setIsUserFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const getInitials = (name: string) => {
        return (
            name
                .split(' ')
                .map((part) => part[0])
                .filter(Boolean)
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'U'
        );
    };

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
            <Head title="Users" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Users
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage all system users and accounts.
                        </p>
                    </div>

                    <Button onClick={() => {
                        setSelectedUser(null);
                        setIsUserFormOpen(true);
                    }} className="gap-2">
                        <Plus className="size-4" />
                        <span>Add User</span>
                    </Button>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="py-3.5 pl-6 font-semibold">Name</TableHead>
                                    <TableHead className="py-3.5 font-semibold">Email</TableHead>
                                    <TableHead className="py-3.5 font-semibold">Status</TableHead>
                                    <TableHead className="py-3.5 font-semibold">Verified</TableHead>
                                    <TableHead className="py-3.5 font-semibold">Created</TableHead>
                                    <TableHead className="py-3.5 pr-6 text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-28 text-center text-muted-foreground"
                                        >
                                            No users available.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="py-3.5 pl-6 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-8 border border-border/60">
                                                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-foreground">{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3.5 text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="py-3.5">
                                                {user.is_active ?? true ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300"
                                                    >
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-destructive/30 bg-destructive/10 font-medium text-destructive dark:border-destructive/40 dark:bg-destructive/15 dark:text-destructive-foreground"
                                                    >
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-3.5">
                                                {user.email_verified_at ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 className="size-3.5" />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                                        <XCircle className="size-3.5" />
                                                        Not Verified
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-3.5 text-sm text-muted-foreground">
                                                {formatDate(user.created_at)}
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
                                                            <Link href={''} className="cursor-pointer">
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Button variant="ghost" onClick={()=>{
                                                                setSelectedUser(user);
                                                                setIsUserFormOpen(true);
                                                            }} className="cursor-pointer w-full text-center">
                                                                Edit
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
            <CreateUserSheet open={isUserFormOpen} onOpenChange={setIsUserFormOpen} user={selectedUser} className="min-w-2xl" />
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: usersRoute(),
        },
    ],
};