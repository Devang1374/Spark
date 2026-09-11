<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {

        $roles = Role::withCount('users')->orderBy('name')->get();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
        ]);
    }
}
