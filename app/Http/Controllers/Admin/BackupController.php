<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BackupController extends Controller
{
    /**
     * Export all settings and news as a JSON file.
     */
    public function export()
    {
        $data = [
            'settings' => Setting::all()->map(function ($s) {
                return [
                    'key' => $s->key,
                    'value' => $s->value,
                ];
            })->toArray(),
            'news' => News::all()->map(function ($n) {
                // If there's an image, convert it to Base64 to include it in the backup JSON
                $imageBase64 = null;
                if ($n->image_path) {
                    $absolutePath = public_path('storage/' . $n->image_path);
                    if (file_exists($absolutePath)) {
                        $fileData = file_get_contents($absolutePath);
                        $mimeType = mime_content_type($absolutePath);
                        $imageBase64 = 'data:' . $mimeType . ';base64,' . base64_encode($fileData);
                    }
                }

                return [
                    'title' => $n->title,
                    'content' => $n->content,
                    'image_path' => $n->image_path,
                    'image_base64' => $imageBase64, // Included in JSON
                    'youtube_url' => $n->youtube_url,
                ];
            })->toArray()
        ];

        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $filename = 'sudrio_respaldo_' . date('Y-m-d_H-i-s') . '.json';

        return response($json, 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Import settings and news from a JSON file.
     */
    public function import(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file|max:20480', // Max 20MB backup
        ]);

        $file = $request->file('backup_file');
        $contents = file_get_contents($file->getRealPath());
        $data = json_decode($contents, true);

        if (!$data || (!isset($data['settings']) && !isset($data['news']))) {
            return redirect()->back()->with('error', 'El archivo no tiene un formato de respaldo válido de Sud Río.');
        }

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
                    
                    // Clear old news directory in public/storage to prevent leftover junk
                    $newsStoragePath = public_path('storage/news');
                    if (is_dir($newsStoragePath)) {
                        $files = glob($newsStoragePath . '/*');
                        foreach ($files as $f) {
                            if (is_file($f)) {
                                unlink($f);
                            }
                        }
                    } else {
                        @mkdir($newsStoragePath, 0755, true);
                    }

                    foreach ($data['news'] as $n) {
                        $imagePath = $n['image_path'] ?? null;

                        // Restructure and save Base64 news image if available
                        if (isset($n['image_base64']) && $n['image_base64']) {
                            try {
                                if (preg_match('/^data:image\/(\w+);base64,/', $n['image_base64'], $type)) {
                                    $dataImg = substr($n['image_base64'], strpos($n['image_base64'], ',') + 1);
                                    $extension = strtolower($type[1]); // png, jpg, jpeg, gif
                                    $dataImg = base64_decode($dataImg);
                                    
                                    if ($dataImg !== false) {
                                        $newFileName = 'news/' . uniqid() . '.' . $extension;
                                        $newsStoragePath = public_path('storage/news');
                                        if (!is_dir($newsStoragePath)) {
                                            @mkdir($newsStoragePath, 0755, true);
                                        }
                                        file_put_contents(public_path('storage/' . $newFileName), $dataImg);
                                        $imagePath = $newFileName;
                                    }
                                }
                            } catch (\Exception $imgEx) {
                                // Fallback to whatever path was saved if base64 reconstruction fails
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

            return redirect()->back()->with('success', '¡Copia de seguridad importada exitosamente! Toda la configuración, contactos y noticias (incluyendo imágenes) han sido restablecidos.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un error al procesar el archivo: ' . $e->getMessage());
        }
    }
}
