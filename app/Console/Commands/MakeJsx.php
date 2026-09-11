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
     * Updated usage:
     *   php artisan make:tsx {path} {--admin}
     *   php artisan make:jsx {path} {--admin}
     *
     * Examples:
     *   php artisan make:tsx admin/posts/index
     *   php artisan make:tsx pages/admin/posts/index
     *   php artisan make:tsx components/admin/posts/PostCard
     */
    protected $signature = 'make:tsx {path : Path relative to resources/js or resources/js/pages (e.g. components/Header or admin/users/index)}
                            {--admin : Ensure the admin route helper is used for page templates}';

    /**
     * The console command aliases.
     *
     * @var array<int, string>
     */
    protected $aliases = ['make:jsx'];

    /**
     * The console command description.
     */
    protected $description = 'Scaffold a new React TSX file anywhere under resources/js';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $rawPath = $this->argument('path');

        // Remove any extension if user typed .tsx or .jsx or .ts or .js
        $rawPath = preg_replace('/\.(tsx|jsx|ts|js)$/i', '', $rawPath);

        // Normalize separators and split into segments.
        $segments = array_values(array_filter(preg_split('#[\\\\/]+#', trim($rawPath, '\\/'))));

        if (empty($segments)) {
            $this->error('Please specify a valid path.');

            return Command::FAILURE;
        }

        // If the path does not start with one of the standard resources/js folders,
        // and doesn't explicitly start with 'pages', default to 'pages' if it's like 'admin/...' or single name
        $knownRoots = ['pages', 'components', 'layouts', 'hooks', 'types', 'lib'];
        if (! in_array($segments[0], $knownRoots)) {
            array_unshift($segments, 'pages');
        }

        $fileBase = array_pop($segments);
        $componentName = Str::studly($fileBase);
        $fileName = $fileBase . '.tsx';

        $isPage = ($segments[0] ?? null) === 'pages';

        $basePath = base_path('resources/js');
        $targetDir = $basePath . '/' . implode('/', $segments);
        $targetPath = $targetDir . '/' . $fileName;

        // Ensure directory exists.
        if (! File::exists($targetDir)) {
            File::makeDirectory($targetDir, 0755, true);
        }

        if (File::exists($targetPath)) {
            $this->error("File {$targetPath} already exists.");

            return Command::FAILURE;
        }

        if ($isPage) {
            $isAdminFlag = $this->option('admin');
            $hasAdminSegment = in_array('admin', $segments);
            $useAdminRoutes = $isAdminFlag || $hasAdminSegment;
            $routesImportPath = $useAdminRoutes ? '@/routes/admin' : '@/routes';
            $routeHelperName = strtolower($fileBase);

            $stub = <<<TSX
import { Head } from '@inertiajs/react';
import { {$routeHelperName} } from '{$routesImportPath}';

export default function {$componentName}() {
    return (
        <>
            <Head title="{$componentName}" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
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
TSX;
        } else {
            $stub = <<<TSX
type {$componentName}Props = {
    className?: string;
};

export default function {$componentName}({ className }: {$componentName}Props) {
    return (
        <div className={className}>
            {/* {$componentName} */}
        </div>
    );
}
TSX;
        }

        File::put($targetPath, $stub . "\n");
        $this->info("Created {$targetPath}");

        return Command::SUCCESS;
    }
}
