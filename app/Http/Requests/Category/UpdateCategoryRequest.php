<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    /* Determine if the user is authorized to make this request. */
    public function authorize(): bool
    {
        return true;
    }

    /* Get the validation rules that apply to the request. */
    public function rules(): array
    {
        $categoryId = $this->route('category');
        return [
            'name' => 'required|string|max:100',
            'slug' => ['required', 'string', 'max:120', Rule::unique('categories', 'slug')->ignore($categoryId)],
            'parent_id' => 'nullable|integer|exists:categories,id',
        ];
    }

    // Get the error messages for the defined validation rules.
    public function messages(): array
    {
        return [
            'name.required' => 'name is required',
            'name.max' => 'maximum value 100 characters',
            'slug.required' => 'slug is required',
            'slug.max' => 'maximum value 120 characters',
            'slug.unique' => 'category already exists',
        ];
    }
}
