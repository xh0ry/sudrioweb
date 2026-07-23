<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Setting;
use App\Models\News;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class RestoreBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:restore {file? : Path to backup JSON file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restaura la configuración y noticias desde backup.json al iniciar';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file') ?: base_path('backup.json');

        if (!File::exists($filePath)) {
            $this->warn("El archivo {$filePath} no existe.");
            return 0;
        }

        $contents = File::get($filePath);
        $data = json_decode($contents, true);

        if (!$data || (!isset($data['settings']) && !isset($data['news']))) {
            $this->error("El archivo {$filePath} no tiene un formato válido de respaldo.");
            return 1;
        }

        $this->info("Iniciando restauración automática desde {$filePath}...");

        try {
            DB::transaction(function () use ($data) {
                if (isset($data['settings']) && is_array($data['settings'])) {
                    Setting::truncate();
                    foreach ($data['settings'] as $s) {
                        Setting::create([
                            'key' => $s['key'],
                            'value' => $s['value']
                        ]);
                    }
                }

                if (isset($data['news']) && is_array($data['news'])) {
                    News::truncate();

                    $newsStoragePath = public_path('storage/news');
                    if (is_dir($newsStoragePath)) {
                        $files = glob($newsStoragePath . '/*');
                        foreach ($files as $f) {
                            if (is_file($f)) {
                                @unlink($f);
                            }
                        }
                    } else {
                        @mkdir($newsStoragePath, 0755, true);
                    }

                    foreach ($data['news'] as $n) {
                        $imagePath = $n['image_path'] ?? null;

                        if (isset($n['image_base64']) && $n['image_base64']) {
                            try {
                                if (preg_match('/^data:image\/(\w+);base64,/', $n['image_base64'], $type)) {
                                    $dataImg = substr($n['image_base64'], strpos($n['image_base64'], ',') + 1);
                                    $extension = strtolower($type[1]);
                                    $dataImg = base64_decode($dataImg);

                                    if ($dataImg !== false) {
                                        $newFileName = 'news/' . uniqid() . '.' . $extension;
                                        if (!is_dir($newsStoragePath)) {
                                            @mkdir($newsStoragePath, 0755, true);
                                        }
                                        file_put_contents(public_path('storage/' . $newFileName), $dataImg);
                                        $imagePath = $newFileName;
                                    }
                                }
                            } catch (\Exception $imgEx) {
                                // Fallback
                            }
                        }

                        News::create([
                            'title' => $n['title'],
                            'content' => $n['content'],
                            'image_path' => $imagePath,
                            'youtube_url' => $n['youtube_url'] ?? null
                        ]);
                    }
                }
            });

            $this->info("¡Restauración de respaldo completada exitosamente!");
            return 0;
        } catch (\Exception $e) {
            $this->error("Error al restaurar respaldo: " . $e->getMessage());
            return 1;
        }
    }
}
