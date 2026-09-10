import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Mail, Shield, User as UserIcon, XCircle, Calendar, Clock } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { index as usersRoute } from '@/routes/admin/users';

type Role = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    roles?: Role[];
};

type ShowProps = {
    user: User;
};

export default function Show({ user }: ShowProps) {
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
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <>
            <Head title={`User - ${user.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header & Back Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" asChild className="size-9 shrink-0">
                            <Link href={usersRoute()}>
                                <ArrowLeft className="size-4" />
                                <span className="sr-only">Back to Users</span>
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {user.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                View detailed information and account status.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* User Profile Card */}
                    <Card className="md:col-span-1">
                        <CardHeader className="text-center">
                            <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-border/80 bg-primary/10">
                                <Avatar className="size-20">
                                    <AvatarFallback className="text-2xl font-bold text-primary">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="mt-3 text-lg font-semibold">{user.name}</CardTitle>
                            <CardDescription className="text-sm">{user.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 border-t border-border/60 pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Account Status</span>
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
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Email Verification</span>
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details and Roles */}
                    <div className="space-y-6 md:col-span-2">
                        {/* Account Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Account Information</CardTitle>
                                <CardDescription>System records and identifiers for this account.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1 rounded-lg border border-border/60 p-3.5 bg-muted/20">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <UserIcon className="size-3.5" />
                                        <span>User ID</span>
                                    </div>
                                    <p className="font-semibold text-foreground">{user.id}</p>
                                </div>

                                <div className="space-y-1 rounded-lg border border-border/60 p-3.5 bg-muted/20">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <Mail className="size-3.5" />
                                        <span>Email</span>
                                    </div>
                                    <p className="font-semibold text-foreground truncate">{user.email}</p>
                                </div>

                                <div className="space-y-1 rounded-lg border border-border/60 p-3.5 bg-muted/20">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <Calendar className="size-3.5" />
                                        <span>Joined Date</span>
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">{formatDate(user.created_at)}</p>
                                </div>

                                <div className="space-y-1 rounded-lg border border-border/60 p-3.5 bg-muted/20">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <Clock className="size-3.5" />
                                        <span>Last Updated</span>
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">{formatDate(user.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Assigned Roles Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Assigned Roles</CardTitle>
                                <CardDescription>Roles and permissions granted to this user.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {user.roles && user.roles.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.map((role) => (
                                            <Badge
                                                key={role.id}
                                                variant="secondary"
                                                className="gap-1.5 px-3 py-1 text-sm font-medium"
                                            >
                                                <Shield className="size-3.5 text-primary" />
                                                <span>{role.name}</span>
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No roles assigned to this user.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: usersRoute(),
        },
        {
            title: 'User Details',
            href: '#',
        },
    ],
};