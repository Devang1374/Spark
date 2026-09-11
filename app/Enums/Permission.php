<?php

namespace App\Enums;

enum Permission: string
{
    case UsersView = 'users.view';
    case UsersCreate = 'users.create';
    case UsersUpdate = 'users.update';
    case UsersDelete = 'users.delete';

    case RolesView = 'roles.view';
    case RolesCreate = 'roles.create';
    case RolesUpdate = 'roles.update';
    case RolesDelete = 'roles.delete';

    public function group(): string
    {
        return match ($this) {
            self::UsersView,
            self::UsersCreate,
            self::UsersUpdate,
            self::UsersDelete => 'Users',

            self::RolesView,
            self::RolesCreate,
            self::RolesUpdate,
            self::RolesDelete => 'Roles',
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::UsersView,
            self::RolesView => 'View',

            self::UsersCreate,
            self::RolesCreate => 'Create',

            self::UsersUpdate,
            self::RolesUpdate => 'Update',

            self::UsersDelete,
            self::RolesDelete => 'Delete',
        };
    }
}
