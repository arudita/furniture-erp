<template>
    <Head title="Create New Category" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <Form v-bind="ProductController.store.form()" :options="{preserveScroll: true}" reset-on-success reset-on-error v-slot="{ errors, processing, recentlySuccessful }" autocomplete="off">
            <div class="flex flex-col p-6">
                <section class="max-w-xl space-y-6">
                    <HeadingSmall title="Create New Category" description="Ensure your account is using a long, random password to stay secure" />
                    <div class="space-y-6">
                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input id="name" name="name" v-model="form_category.name" type="text" class="mt-1 block w-full" :class="errors.name ? 'border-red-500': ''" placeholder="Name" />
                            <InputError :message="errors.name || errors.slug" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="slug">Slug</Label>
                            <Input id="slug" name="slug" v-model="form_category.slug" type="text" class="mt-1 block w-full bg-accent focus-visible:ring-0 focus-visible:border-input cursor-no-drop" placeholder="Slug" readonly aria-readonly />
                        </div>
                        <div class="grid gap-2">
                            <Label for="parent_id">Parent</Label>
                            <Input id="parent_id" name="parent_id" :value="form_category.parent_id" type="hidden" class="sr-only hidden" />
                            <Popover v-model:open="openCommand">
                                <PopoverTrigger as-child>
                                    <Button variant="outline" role="combobox" :aria-expanded="openCommand" class="w-full justify-between">
                                        {{ selectedParentCategory?.name || "Select parent category..." }}
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
                                                <CommandItem v-for="item in data_category" :key="item.id" :value="item.id" @select="(ev) => { selectCategory(ev.detail.value as number) }">
                                                    {{ item.name }}
                                                    <CheckIcon :class="cn('ml-auto', selectedParentId === item.id ? 'opacity-100' : 'opacity-0')" />
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <p class="text-sm text-muted-foreground">
                                Optional. Categories, can have a hierarchy. You might have a Table category, and under that have children categories for Dining and Living Room.
                            </p>
                            <InputError :message="errors.parent_id" />
                        </div>
                        <div class="flex items-center gap-4">
                            <Button :disabled="processing" data-test="update-password-button" class="cursor-pointer">Save</Button>
                            <Transition enter-active-class="transition ease-in-out" enter-from-class="opacity-0" leave-active-class="transition ease-in-out" leave-to-class="opacity-0">
                                <p v-show="recentlySuccessful" class="text-sm text-neutral-600">
                                    Saved.
                                </p>
                            </Transition>
                        </div>
                    </div>
                </section>
            </div>
        </Form>
    </AppLayout>
</template>

<script setup lang="ts">
import ProductController from '@/actions/App/Http/Controllers/ProductController';
import AppLayout from '@/layouts/AppLayout.vue';
import { Form, Head, useForm, usePage } from '@inertiajs/vue3';
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';
import { computed, ref, watch } from 'vue';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface Category {
    id: number;
    public_id: string;
    name: string;
    slug: string;
}

interface ProductAttribute {
    name: string;
    value: string;
}

interface FormProduct {
    category_id: number | '';
    name: string;
    description: string | null;
    product_code: string | null;
    unit_price: number | string | null;
    attributes: ProductAttribute[];
    images: File[];
    main_image_index: number;
}

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

const openCommand = ref(false);
const selectedParentId = ref<number | null>(null);
const data_category = usePage().props.data_category as Category[];

const form_product = useForm<FormProduct>({
    product: {
        category_id: 0,
        name: '',
        description: '',
        product_code: '',
        unit_price: 0,
    },
    attributes: [
        {
            name: '',
            value: '',
        }
    ],
    images: [],
})

const selectedParentCategory = computed(() =>
    data_category.find(category => category.id === selectedParentId.value),
)
const selectCategory = (selectedValue: number | null) => {
    const new_parent_id = selectedValue == selectedParentId.value ? null : selectedValue;
    selectedParentId.value = new_parent_id;
    openCommand.value = false;
}

// --- Attribute Management ---
const addAttribute = () => {
    form_product.attributes.push({ name: '', value: '' });
};

const removeAttribute = (index: number) => {
    form_product.attributes.splice(index, 1);
};

// --- Image Management ---
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

// Function to remove an image by index
const removeImage = (index) => {
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
</script>
