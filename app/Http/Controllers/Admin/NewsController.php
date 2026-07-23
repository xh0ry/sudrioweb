<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::latest()->get();
        return Inertia::render('Admin/News/Index', ['news' => $news]);
    }

    public function create()
    {
        return Inertia::render('Admin/News/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'youtube_url' => 'nullable|string|url'
        ]);

        $news = new News();
        $news->title = $validated['title'];
        $news->content = $validated['content'];
        $news->youtube_url = $validated['youtube_url'] ?? null;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('news', 'public');
            $news->image_path = $path;
        }

        $news->save();

        return redirect()->route('admin.news.index')->with('success', 'Noticia creada exitosamente.');
    }

    public function edit(News $news)
    {
        return Inertia::render('Admin/News/Edit', ['news' => $news]);
    }

    public function update(Request $request, News $news)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'youtube_url' => 'nullable|string|url',
            'remove_image' => 'nullable|boolean'
        ]);

        $news->title = $validated['title'];
        $news->content = $validated['content'];
        $news->youtube_url = $validated['youtube_url'] ?? null;

        if ($request->hasFile('image')) {
            // Delete old image
            if ($news->image_path) {
                Storage::disk('public')->delete($news->image_path);
            }
            $path = $request->file('image')->store('news', 'public');
            $news->image_path = $path;
        } elseif ($request->boolean('remove_image')) {
            if ($news->image_path) {
                Storage::disk('public')->delete($news->image_path);
            }
            $news->image_path = null;
        }

        $news->save();

        return redirect()->route('admin.news.index')->with('success', 'Noticia actualizada exitosamente.');
    }

    public function destroy(News $news)
    {
        if ($news->image_path) {
            Storage::disk('public')->delete($news->image_path);
        }
        $news->delete();

        return redirect()->route('admin.news.index')->with('success', 'Noticia eliminada exitosamente.');
    }
}
