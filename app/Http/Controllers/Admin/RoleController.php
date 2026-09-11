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

    //add role store function
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:roles,name',
        ]);

        Role::create([
            'name' => $request->title,
            'guard_name' => 'web',
        ]);

        return redirect()->route('admin.roles.index');
    }
}
