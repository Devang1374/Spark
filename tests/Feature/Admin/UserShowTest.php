<?php

use App\Enums\Permission;
use App\Models\User;
use Spatie\Permission\Models\Permission as SpatiePermission;

beforeEach(function () {
    $this->withoutVite();
    SpatiePermission::firstOrCreate(['name' => Permission::UsersView->value]);
});

test('unauthenticated users cannot view user details', function () {
    $user = User::factory()->create();

    $this->get(route('admin.users.show', $user))
        ->assertRedirect(route('login'));
});

test('users without users.view permission cannot view user details', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('admin.users.show', $user))
        ->assertForbidden();
});

test('users with users.view permission can view user details', function () {
    $admin = User::factory()->create();
    $admin->givePermissionTo(Permission::UsersView->value);

    $user = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('admin.users.show', $user))
        ->assertOk();
});
