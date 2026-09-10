<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Permission as SpatiePermission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;
use App\Enums\Permission;
use App\Enums\Role as RoleEnum;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = Permission::cases();

        foreach ($permissions as $permission) {
            SpatiePermission::firstOrCreate([
                'name' => $permission->value,
            ]);
        }

        $superAdmin = Role::firstOrCreate([
            'name' => RoleEnum::SuperAdmin->value,
        ]);

        $admin = Role::firstOrCreate([
            'name' => RoleEnum::Admin->value,
        ]);

        $moderator = Role::firstOrCreate([
            'name' => RoleEnum::Moderator->value,
        ]);

        $superAdmin->syncPermissions(
            collect($permissions)->map->value->all()
        );

        $admin->syncPermissions([
            Permission::UsersView->value,
            Permission::UsersCreate->value,
            Permission::UsersUpdate->value,
        ]);

        $moderator->syncPermissions([
            Permission::UsersView->value,
            Permission::UsersUpdate->value,
        ]);
    }
}
