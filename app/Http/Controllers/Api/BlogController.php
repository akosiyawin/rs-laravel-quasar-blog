<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Http\Resources\Api\BlogResource;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search', '');
        
        $blogs = auth()->user()->blogs();
        $query = $blogs->with('creator');
        
        // Apply search if provided
        if (!empty($search)) {
            $query->where('title', 'like', "%{$search}%");
        }
        
        // Apply sorting
        if ($sortBy) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->latest();
        }
        
        $blogs = $query->paginate($perPage);
            
        return BlogResource::collection($blogs)->withQueryString();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published'
        ]);

        $blog = Blog::create([
            'title' => $request->title,
            'content' => $request->content,
            'status' => $request->status,
            'created_by' => auth()->id(),
        ]);

        return new BlogResource($blog->load('creator'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        return new BlogResource($blog->load('creator'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published'
        ]);

        $blog->update($request->all());
        return new BlogResource($blog->load('creator'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        $blog->delete();
        return response()->json(null, 204);
    }

    public function changeStatus(Blog $blog, Request $request)
    {
        $request->validate([
            'status' => 'required|in:draft,published'
        ]);

        $blog->update(['status' => $request->status]);
        return new BlogResource($blog->load('creator'));
    }

    public function archive(Blog $blog)
    {
        $blog->delete();
        return response()->json(['message' => 'Blog archived successfully']);
    }

    public function restore($id)
    {
        $blog = Blog::withTrashed()->findOrFail($id);
        $blog->restore();
        return new BlogResource($blog->load('creator'));
    }

    /**
     * Get dashboard statistics for blogs.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function dashboardStats()
    {
        $blogs = auth()->user()->blogs();


        $totalBlogs = $blogs->count();
        $publishedBlogs = $blogs
            ->where('status', 'published')
            ->count();
        $draftBlogs = $blogs
            ->where('status', 'draft')
            ->count();
        
        return response()->json([
            'total' => $totalBlogs,
            'published' => $publishedBlogs,
            'draft' => $draftBlogs
        ]);
    }
}
