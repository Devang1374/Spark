import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    CheckCircle2,
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    RotateCcw,
    Search,
    XCircle,
} from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import CreateUserSheet from '@/components/admin/users/UserFormSheet';
import { useMemo, useState } from 'react';

import { index as usersRoute, destroy, show, status } from '@/routes/admin/users';
import { useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';

type User = {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: roles[];
    email_verified_at?: string | null;
    created_at?: string;
};

type roles = {
    id: number;
    name: string;
}

type UsersIndexProps = {
    users: {
        data: User[];
    };
    roles: roles[];
};

import ConfirmDialog from '@/components/comman/ConfirmDialog';

export default function Index({ users, roles }: UsersIndexProps) {

    const [isUserFormOpen, setIsUserFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { delete: deleteRequest, processing: deleting } = useForm();

    const auth = (usePage().props as unknown as {
        auth?: {
            permissions?: string[];
        };
    }).auth ?? {};

    const canCreate = auth.permissions?.includes('users.create') ?? false;
    const canUpdate = auth.permissions?.includes('users.update') ?? false;
    const canDelete = auth.permissions?.includes('users.delete') ?? false;
    const canChangeStatus = auth.permissions?.includes('users.status') ?? false;

    const handleToggleStatus = (user: User) => {
        if (!canChangeStatus) return;

        router.patch(status.url(user.id), {}, {
            preserveScroll: true,
        });
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortField, setSortField] = useState<'name' | 'email' | 'status' | 'created_at'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const hasActiveFilters = search.trim() !== '' || statusFilter !== 'all' || roleFilter !== 'all';

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setRoleFilter('all');
    };

    const handleSort = (field: 'name' | 'email' | 'status' | 'created_at') => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (field: 'name' | 'email' | 'status' | 'created_at') => {
        if (sortField !== field) {
            return (
                <ArrowUpDown className="size-3.5 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
            );
        }
        return sortDirection === 'asc' ? (
            <ArrowUp className="size-3.5 text-primary" />
        ) : (
            <ArrowDown className="size-3.5 text-primary" />
        );
    };

    const filteredAndSortedUsers = useMemo(() => {
        let list = [...(users.data ?? [])];

        if (search.trim()) {
            const query = search.trim().toLowerCase();
            list = list.filter(
                (u) =>
                    u.name.toLowerCase().includes(query) ||
                    u.email.toLowerCase().includes(query)
            );
        }

        if (statusFilter === 'active') {
            list = list.filter((u) => u.is_active);
        } else if (statusFilter === 'inactive') {
            list = list.filter((u) => !u.is_active);
        }

        if (roleFilter !== 'all') {
            list = list.filter((u) =>
                u.roles?.some((r) => r.id.toString() === roleFilter || r.name === roleFilter)
            );
        }

        list.sort((a, b) => {
            let valA: string | number = '';
            let valB: string | number = '';

            if (sortField === 'name') {
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
            } else if (sortField === 'email') {
                valA = a.email.toLowerCase();
                valB = b.email.toLowerCase();
            } else if (sortField === 'status') {
                valA = a.is_active ? 1 : 0;
                valB = b.is_active ? 1 : 0;
            } else if (sortField === 'created_at') {
                valA = new Date(a.created_at ?? 0).getTime();
                valB = new Date(b.created_at ?? 0).getTime();
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return list;
    }, [users.data, search, statusFilter, roleFilter, sortField, sortDirection]);

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

    const handleDelete = () => {
        if (!deleteUser) return;

        deleteRequest(destroy.url(deleteUser.id), {
            onSuccess: () => {
                setDeleteUser(null);
                setIsDeleteOpen(false);
            }
        })
    }

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

                    <div className="flex items-center gap-2.5">
                        <Button
                            variant={isFilterOpen ? 'default' : 'outline'}
                            onClick={() => setIsFilterOpen((prev) => !prev)}
                            className="gap-2"
                        >
                            <Filter className="size-4" />
                            <span>Filter</span>
                            {hasActiveFilters && (
                                <span className={cn(
                                    'flex size-2 rounded-full',
                                    isFilterOpen ? 'bg-background' : 'bg-primary'
                                )} />
                            )}
                        </Button>

                        {canCreate && (
                            <Button onClick={() => {
                                setSelectedUser(null);
                                setIsUserFormOpen(true);
                            }} className="gap-2">
                                <Plus className="size-4" />
                                <span>Add User</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Slide-down Filter Section */}
                <div
                    className={cn(
                        'grid transition-all duration-300 ease-in-out',
                        isFilterOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    )}
                >
                    <div className="min-h-0 overflow-hidden">
                        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                                <div className="flex items-center gap-2">
                                    <Filter className="size-4 text-primary" />
                                    <span className="text-sm font-semibold text-foreground">Filter & Search Users</span>
                                    {hasActiveFilters && (
                                        <Badge variant="secondary" className="text-[11px] font-normal">
                                            Active Filters
                                        </Badge>
                                    )}
                                </div>
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={resetFilters}
                                        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        <RotateCcw className="size-3.5" />
                                        <span>Reset Filters</span>
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2 lg:grid-cols-4">
                                {/* Search */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Search</Label>
                                    <div className="relative">
                                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Name or email..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="h-9 pl-9 text-xs"
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="h-9 w-full text-xs">
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="active">Active Only</SelectItem>
                                            <SelectItem value="inactive">Inactive Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Role */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Role</Label>
                                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                                        <SelectTrigger className="h-9 w-full text-xs">
                                            <SelectValue placeholder="All Roles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            {roles?.map((role) => (
                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sort By */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Sort By</Label>
                                    <Select
                                        value={`${sortField}-${sortDirection}`}
                                        onValueChange={(val) => {
                                            const [field, dir] = val.split('-');
                                            setSortField(field as 'name' | 'email' | 'status' | 'created_at');
                                            setSortDirection(dir as 'asc' | 'desc');
                                        }}
                                    >
                                        <SelectTrigger className="h-9 w-full text-xs">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="name-asc">Name (A to Z)</SelectItem>
                                            <SelectItem value="name-desc">Name (Z to A)</SelectItem>
                                            <SelectItem value="email-asc">Email (A to Z)</SelectItem>
                                            <SelectItem value="email-desc">Email (Z to A)</SelectItem>
                                            <SelectItem value="created_at-desc">Newest First</SelectItem>
                                            <SelectItem value="created_at-asc">Oldest First</SelectItem>
                                            <SelectItem value="status-desc">Active First</SelectItem>
                                            <SelectItem value="status-asc">Inactive First</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="py-3.5 pl-6 font-semibold">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('name')}
                                            className="group inline-flex cursor-pointer select-none items-center gap-1.5 hover:text-foreground focus-visible:outline-none"
                                        >
                                            <span>Name</span>
                                            {renderSortIcon('name')}
                                        </button>
                                    </TableHead>
                                    <TableHead className="py-3.5 font-semibold">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('email')}
                                            className="group inline-flex cursor-pointer select-none items-center gap-1.5 hover:text-foreground focus-visible:outline-none"
                                        >
                                            <span>Email</span>
                                            {renderSortIcon('email')}
                                        </button>
                                    </TableHead>
                                    <TableHead className="py-3.5 font-semibold">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('status')}
                                            className="group inline-flex cursor-pointer select-none items-center gap-1.5 hover:text-foreground focus-visible:outline-none"
                                        >
                                            <span>Status</span>
                                            {renderSortIcon('status')}
                                        </button>
                                    </TableHead>
                                    <TableHead className="py-3.5 font-semibold">Verified</TableHead>
                                    <TableHead className="py-3.5 font-semibold">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('created_at')}
                                            className="group inline-flex cursor-pointer select-none items-center gap-1.5 hover:text-foreground focus-visible:outline-none"
                                        >
                                            <span>Created</span>
                                            {renderSortIcon('created_at')}
                                        </button>
                                    </TableHead>
                                    <TableHead className="py-3.5 font-semibold">Role</TableHead>
                                    <TableHead className="py-3.5 pr-6 text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <p>No users found matching your filters.</p>
                                                {hasActiveFilters && (
                                                    <Button variant="outline" size="sm" onClick={resetFilters} className="h-8 text-xs">
                                                        Clear all filters
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAndSortedUsers.map((user) => (
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
                                                <button
                                                    type="button"
                                                    disabled={!canChangeStatus}
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={cn(
                                                        'rounded-md outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring',
                                                        canChangeStatus ? 'cursor-pointer active:scale-95' : 'cursor-default'
                                                    )}
                                                    title={canChangeStatus ? `Click to mark as ${user.is_active ? 'Inactive' : 'Active'}` : undefined}
                                                >
                                                    {user.is_active ? (
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                'border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300',
                                                                canChangeStatus && 'hover:bg-emerald-500/20'
                                                            )}
                                                        >
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                'border-destructive/30 bg-destructive/10 font-medium text-destructive dark:border-destructive/40 dark:bg-destructive/15 dark:text-destructive-foreground',
                                                                canChangeStatus && 'hover:bg-destructive/20'
                                                            )}
                                                        >
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </button>
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
                                            <TableCell className="py-3.5">{user.roles?.map((r) => r.name).join(', ') || '—'}</TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Link href={show.url(user.id)}>
                                                            <Eye className="size-4" />
                                                            <span className="sr-only">View</span>
                                                        </Link>
                                                    </Button>

                                                    {(canUpdate || canDelete) && (
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
                                                                {canUpdate && (
                                                                    <DropdownMenuItem asChild>
                                                                        <Button variant="ghost" onClick={() => {
                                                                            setSelectedUser(user);
                                                                            setIsUserFormOpen(true);
                                                                        }} className="cursor-pointer w-full text-center">
                                                                            Edit
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                )}

                                                                {canDelete && (
                                                                    <DropdownMenuItem asChild>
                                                                        <Button variant="destructive" onClick={() => {
                                                                            setDeleteUser(user);
                                                                            setIsDeleteOpen(true);
                                                                        }} className="cursor-pointer w-full text-center">
                                                                            Delete
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <CreateUserSheet open={isUserFormOpen} onOpenChange={setIsUserFormOpen} user={selectedUser} roles={roles} className="w-full sm:max-w-xl md:min-w-2xl" />
            <ConfirmDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title="Delete User?"
                description={`Are you sure you want to delete ${deleteUser?.name}? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={handleDelete}
                processing={deleting}
            />
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