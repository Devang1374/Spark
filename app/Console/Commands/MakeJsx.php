<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeJsx extends Command
{
    /**
     * The name and signature of the console command.
     *
     * Updated usage: php artisan make:jsx {path} {--admin}
     *   {path} can be a nested path like "admin/users/index".
     */
    protected $signature = 'make:jsx {path : Relative path inside resources/js/pages (e.g., admin/users/index)} {--admin : Ensure the admin route helper is used (optional if path already includes admin)}';

    /**
     * The console command description.
     */
    protected $description = 'Scaffold a new Inertia‑React JSX page anywhere under resources/js/pages';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $rawPath = $this->argument('path');
        // Normalize separators and split into segments.
        $segments = preg_split('#[\\/]+#', trim($rawPath, "\\/"));
        $fileBase = array_pop($segments); // e.g., "index" or "Dashboard"
        $componentName = Str::studly($fileBase);
        $fileName = $fileBase . '.jsx';

        $isAdminFlag = $this->option('admin');
        // Determine if the path already includes an "admin" segment.
        $hasAdminSegment = in_array('admin', $segments);

        $basePath = base_path('resources/js/pages');
        // Build target directory from remaining segments.
        $targetDir = $basePath;
        if (!empty($segments)) {
            $targetDir .= '/' . implode('/', $segments);
        }
        $targetPath = $targetDir . '/' . $fileName;

        // Ensure directory exists.
        if (!File::exists($targetDir)) {
            File::makeDirectory($targetDir, 0755, true);
        }

        if (File::exists($targetPath)) {
            $this->error("File {$targetPath} already exists.");
            return Command::FAILURE;
        }

        // Choose the correct routes import: admin if needed, otherwise default.
        $useAdminRoutes = $isAdminFlag || $hasAdminSegment;
        $routesImportPath = $useAdminRoutes ? "@/routes/admin" : "@/routes";
        $routeHelperName = strtolower($fileBase);
        $routeHelperImport = "import { {$routeHelperName} } from '{$routesImportPath}';";

        $stub = <<<JSX
import { Head } from '@inertiajs/react';
{$routeHelperImport}

export default function {$componentName}() {
    return (
        <>
            <Head title="{$componentName}" />
            <div className="p-6">
                {/* TODO: Build the {$componentName} page */}
            </div>
        </>
    );
}

{$componentName}.layout = {
    breadcrumbs: [
        {
            title: '{$componentName}',
            href: {$routeHelperName}(),
        },
    ],
};
JSX;

        File::put($targetPath, $stub);
        $this->info("Created {$targetPath}");
        return Command::SUCCESS;
    }
}
