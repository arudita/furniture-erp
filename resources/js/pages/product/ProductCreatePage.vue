<template>
    <Head title="Create New Category" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <form @submit.prevent="submit" autocomplete="off">
            <div class="flex flex-col p-6 space-y-6">
                <HeadingSmall title="Create New Category" description="Ensure your account is using a long, random password to stay secure" />
                <div class="flex flex-col lg:flex-row gap-6">
                    <div class="flex-1 max-w-xl space-y-6">
                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input id="name" name="name" v-model="form_product.name" type="text" class="mt-1 block w-full" :class="errors?.name ? 'border-red-500': ''" placeholder="Name" />
                            <InputError :message="errors?.name" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="product_code">Product Code</Label>
                            <Input id="product_code" name="product_code" v-model="form_product.product_code" type="text" class="mt-1 block w-full" :class="errors?.product_code ? 'border-red-500': ''" placeholder="Product Code" required />
                            <InputError :message="errors?.product_code" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="unit_price">Product Code</Label>
                            <Input id="unit_price" name="unit_price" v-model="form_product.unit_price" type="number" class="mt-1 block w-full" :class="errors?.unit_price ? 'border-red-500': ''" placeholder="Unit Price" required />
                            <InputError :message="errors?.unit_price" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="category_id">Category</Label>
                            <Input id="category_id" name="category_id" :value="form_product.category_id" type="hidden" class="sr-only hidden" />
                            <Popover v-model:open="openCommand">
                                <PopoverTrigger as-child>
                                    <Button variant="outline" role="combobox" :aria-expanded="openCommand" class="w-full justify-between">
                                        {{ selectedCategory?.name || "Select parent category..." }}
                                        <ChevronsUpDownIcon class="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent class="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Search parent..." />
                                        <CommandList>
                                            <CommandEmpty>No category found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem value="" @select="(ev) => { selectCategory(null) }">None</CommandItem>
                                                <CommandItem v-for="item in props.data_category" :key="item.id" :value="item.id" @select="(ev) => { selectCategory(ev.detail.value as number) }">
                                                    {{ item.name }}
                                                    <CheckIcon :class="cn('ml-auto', selectedCategoryId === item.id ? 'opacity-100' : 'opacity-0')" />
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError :message="errors?.category_id" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="description">Description</Label>
                            <Textarea id="description" name="description" v-model="form_product.description" type="text" rows="5" class="mt-1 block w-full" :class="errors?.description ? 'border-red-500': ''" placeholder="Description" />
                            <InputError :message="errors?.description" />
                        </div>
                    </div>
                    <div class="flex-1 max-w-xl space-y-6">
                        <div class="grid gap-2">
                            <Label for="name">Attribute</Label>
                            <p class="text-sm text-muted-foreground">E.g., Color, Size, Material.</p>
                            <div v-for="(attribute, index) in form_product.attributes" :key="index" class="flex flex-row gap-2">
                                <div class="flex-1">
                                    <Label :for="`attr-name-${index}`" value="Name" :class="{'sr-only': index > 0}" />
                                    <Input :id="`attr-name-${index}`" type="text" class="mt-1 block w-full" v-model="attribute.name" placeholder="e.g., Color" />
                                    <!-- <InputError class="mt-2" :message="errors[`attributes.${index}.name`]" /> -->
                                </div>
                                <div class="flex-1">
                                    <Label :for="`attr-value-${index}`" value="Value" :class="{'sr-only': index > 0}" />
                                    <Input :id="`attr-value-${index}`" type="text" class="mt-1 block w-full" v-model="attribute.value" placeholder="e.g., Red" />
                                    <!-- <InputError class="mt-2" :message="form.errors[`attributes.${index}.value`]" /> -->
                                </div>
                                <div class="flex items-center">
                                    <Button @click="removeAttribute(index)" type="button" variant="outline" size="icon" class="cursor-pointer">
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
                            <Button @click="addAttribute" type="button" class="cursor-pointer">
                                + Add Attribute
                            </Button>
                        </div>
                        <div class="grid gap-2">
                            <Label for="image_upload">Images</Label>
                            <p class="text-sm text-muted-foreground">
                                Images (Required: Min 1, Max 5). Formats: JPEG, PNG, JPG, GIF. Max size: 2MB per image.
                            </p>
                            <Label for="image_upload" :class="{ 'dragging': isDragging }" @dragover.prevent @dragenter="handleDragOver" @drop="handleDrop($event)" class="flex flex-col items-center file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input rounded-md border bg-transparent p-6 text-base shadow-xs transition-[color,box-shadow] outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive mt-1 w-full">
                                <ImageUp />
                                <span class="mt-4 font-medium dark:text-white"> Upload your file(s) </span>
                                <span class="mt-2 inline-block rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-center text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                                    Browse files
                                </span>
                                <Input
                                    type="file"
                                    id="image_upload"
                                    ref="imageFileInput"
                                    multiple
                                    @change="handleImageUpload"
                                    class="sr-only mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
                                    :disabled="maxImagesReached"
                                    accept="image/jpeg,image/png,image/jpg,image/gif"
                                />
                                <p v-if="maxImagesReached" class="text-sm text-red-500 mt-2">Maximum 5 images reached.</p>
                            </label>
                            <InputError class="mt-2" :message="errors?.images" />
                            <div v-if="form_product.images.length > 0" class="mt-4">
                                <Label value="Selected Images" class="mb-2" />
                                <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div v-for="(previewUrl, index) in imagePreviews" :key="index" class="relative group">
                                        <img :src="previewUrl" alt="Product Image Preview" class="w-full aspect-square object-cover" />
                                        <Badge v-if="form_product.main_image_index === index" variant="secondary" class="absolute top-0 left-0 rounded-none bg-blue-500 text-white text-xs px-2 py-0.5 dark:bg-blue-600">
                                            <BadgeCheckIcon />
                                            Verified
                                        </Badge>
                                        <Button type="button" @click="removeImage(index)" size="icon" variant="ghost" class="absolute top-1 right-1 size-5 hover:bg-red-500 text-white hover:text-white rounded-full transition cursor-pointer">
                                            <X />
                                        </Button>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <Label for="main_image_index" value="Select Main Image (Index)" required />
                                    <select id="main_image_index" v-model="form_product.main_image_index" class="mt-1 block w-full md:w-1/3 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" required>
                                        <option v-for="i in form_product.images.length" :key="i - 1" :value="i - 1">
                                            Image {{ i }} (Index {{ i - 1 }})
                                        </option>
                                    </select>
                                    <InputError class="mt-2" :message="errors?.main_image_index" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <Button :disabled="form_product.processing" data-test="update-password-button" class="cursor-pointer">Save</Button>
                    <Transition enter-active-class="transition ease-in-out" enter-from-class="opacity-0" leave-active-class="transition ease-in-out" leave-to-class="opacity-0">
                        <p v-show="form_product.recentlySuccessful" class="text-sm text-neutral-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </div>
        </form>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';
import { computed, ref } from 'vue';
import { CheckIcon, ChevronsUpDownIcon, ImageUp, Trash2, X } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { type Category } from '@/types/category';
import { type Product, ProductAttribute, ProductForm } from '@/types/product';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const props = defineProps<{
    data_category: Category[];
    errors: ProductForm;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wood',
        href: '/wood',
    },
    {
        title: 'Create New',
        href: '#',
    },
];

const isDragging = ref(false);
const openCommand = ref(false);
const selectedCategoryId = ref<number | null>(null);

const form_product = useForm<ProductForm>({
    category_id: 0,
    name: '',
    description: '',
    product_code: '',
    unit_price: 0,
    attributes: [
        { name: '', value: '' }
    ],
    images: [],
    main_image_index: -1,
})

const selectedCategory = computed(() =>
    props.data_category.find(category => category.id === selectedCategoryId.value),
)
const selectCategory = (selectedValue: number | null) => {
    const new_parent_id = selectedValue == selectedCategoryId.value ? null : selectedValue;
    selectedCategoryId.value = new_parent_id;
    openCommand.value = false;
}

// --- Attribute Management ---
const addAttribute = () => {
    form_product.attributes.push({ name: '', value: '' } as ProductAttribute);
};

const removeAttribute = (index: number) => {
    form_product.attributes.splice(index, 1);
};

// --- Image Management ---
const maxImagesReached = computed<boolean>(() => form_product.images.length >= 5);

const handleImageUpload = (event: any) => {
    const files = Array.from(event.target.files);

    const filesToAdd = files.slice(0, 5 - form_product.images.length);

    filesToAdd.forEach((file: any) => {
        form_product.images.push(file);
    });

    event.target.value = '';

    if (form_product.main_image_index < 0 || form_product.main_image_index >= form_product.images.length) {
        form_product.main_image_index = 0;
    }
};

function handleDragOver() {
    isDragging.value = true
}
function handleDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();

    isDragging.value = false
}
// Function to remove an image by index
const removeImage = (index: number) => {
    form_product.images.splice(index, 1);

    if (form_product.main_image_index === index) {
        form_product.main_image_index = form_product.images.length > 0 ? 0 : -1;
    } else if (form_product.main_image_index > index) {
        form_product.main_image_index--;
    }
};

const imagePreviews = computed(() => {
    return form_product.images.map(image => {
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return null;
    }).filter(url => url !== null);
});

const submit = () => {
    const filteredAttributes = form_product.attributes.filter(
        attr => attr.name?.trim() !== '' || attr.value?.trim() !== ''
    );

    form_product.transform(data => ({
        ...data,
        attributes: filteredAttributes,
        unit_price: data.unit_price == 0 ? null : data.unit_price,
    })).post('/product', {
        preserveScroll: true,
        forceFormData: true,
    })
}
</script>
<style scoped>
.dragging { border-color: rgb(59 130 246); }
</style>
