<template>
    <Head title="Create New Category" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <form @submit.prevent="submit" autocomplete="off">
            <div class="flex flex-col p-6">
                <section class="max-w-xl space-y-6">
                    <HeadingSmall title="Create New Category" description="Ensure your account is using a long, random password to stay secure" />
                    <div class="space-y-6">
                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input id="name" name="name" v-model="form_category.name" type="text" class="mt-1 block w-full" :class="errors?.name ? 'border-red-500': ''" placeholder="Name" />
                            <InputError :message="errors?.name || errors?.slug" />
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
                        </div>
                        <div class="flex items-center gap-4">
                            <Button :disabled="form_category.processing" data-test="update-password-button" class="cursor-pointer">Save</Button>
                            <Transition enter-active-class="transition ease-in-out" enter-from-class="opacity-0" leave-active-class="transition ease-in-out" leave-to-class="opacity-0">
                                <p v-show="form_category.recentlySuccessful" class="text-sm text-neutral-600">
                                    Saved.
                                </p>
                            </Transition>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { computed, ref, watch } from 'vue';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Head, useForm } from '@inertiajs/vue3';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type BreadcrumbItem } from '@/types';
import { type Category, CategoryForm } from '@/types/category';

const props = defineProps<{
    data_category: Category[];
    errors: Category;
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

const openCommand = ref(false);
const selectedParentId = ref<number | null>(null);

const form_category = useForm<CategoryForm>({
    name: '',
    slug: '',
    parent_id: null,
})

const selectedParentCategory = computed(() =>
    props.data_category.find(category => category.id === selectedParentId.value),
)
const selectCategory = (selectedValue: number | null) => {
    const new_parent_id = selectedValue == selectedParentId.value ? null : selectedValue;
    selectedParentId.value = new_parent_id;
    form_category.parent_id = new_parent_id;
    openCommand.value = false;
}

watch(() => form_category.name, (new_name) => {
    form_category.slug = GenerateSlug(new_name);
})

const GenerateSlug = (text: string) => {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-+|-+$/g, '');;
}

const submit = () => {
    form_category.post('/category', { preserveScroll: true, onSuccess: () => form_category.reset() });
}
</script>
