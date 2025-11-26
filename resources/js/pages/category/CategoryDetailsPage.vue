<template>
    <Head :title="data_category.name" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <form @submit.prevent="submit" v-on:finish="editMode = false" autocomplete="off">
            <div class="flex flex-col p-6">
                <section class="max-w-xl space-y-6">
                    <HeadingSmall :title="'Category: ' + data_category.name" description="Ensure your account is using a long, random password to stay secure" />
                    <div class="space-y-6">
                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input v-if="editMode" id="name" name="name" v-model="form_category.name" type="text" class="mt-1 block w-full" :class="errors?.name ? 'border-red-500': ''" placeholder="Name" />
                            <p v-else class="mt-1 block w-full leading-7 text-sm/relaxed">
                                {{ props.data_category.name }}
                            </p>
                            <InputError :message="errors?.name || errors?.slug" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="slug">Slug</Label>
                            <Input id="slug" name="slug" v-model="form_category.slug" type="text" class="mt-1 block w-full bg-accent focus-visible:ring-0 focus-visible:border-input cursor-no-drop" placeholder="Slug" readonly aria-readonly />
                        </div>
                        <div class="grid gap-2">
                            <Label for="parent_id">Parent</Label>
                            <Input id="parent_id" name="parent_id" :value="form_category.parent_id" type="hidden" class="sr-only hidden" />
                            <Popover v-if="editMode" v-model:open="openCommand">
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
                                                <CommandItem v-for="item in data_categories" :key="item.id" :value="item.id" @select="(ev) => { selectCategory(ev.detail.value as number) }">
                                                    {{ item.name }}
                                                    <CheckIcon :class="cn('ml-auto', selectedParentId === item.id ? 'opacity-100' : 'opacity-0')" />
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <p v-else class="mt-1 block w-full leading-7 text-sm/relaxed">
                                {{ props.data_category.parent?.name ?? '-' }}
                            </p>
                            <p v-if="editMode" class="text-sm text-muted-foreground">
                                Optional. Categories, can have a hierarchy. You might have a Table category, and under that have children categories for Dining and Living Room.
                            </p>
                        </div>
                        <div class="flex items-center gap-4">
                            <Button v-if="editMode" :disabled="form_category.processing" class="cursor-pointer">Save</Button>
                            <Button v-else @click="editMode = true" class="cursor-pointer">Edit</Button>
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
import { Head, useForm } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { computed, onMounted, ref, watch } from 'vue';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { type BreadcrumbItem } from '@/types';
import { type Category, CategoryForm } from '@/types/category';

const props = defineProps<{
    data_category: Category;
    data_categories: Category[];
    errors: Category;
}>();

const editMode = ref(false);
const openCommand = ref(false);
const selectedParentId = ref<number | null>(null);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wood',
        href: '/wood',
    },
    {
        title: props.data_category.name,
        href: '#',
    },
];

const form_category = useForm<CategoryForm>({
    id: props.data_category.id,
    public_id: props.data_category.public_id,
    name: props.data_category.name,
    slug: props.data_category.slug,
    parent_id: props.data_category.parent_id ?? null,
    parent: props.data_category.parent ?? null,
});

const selectedParentCategory = computed(() =>
    props.data_categories.find(category => category.id === selectedParentId.value),
)

const selectCategory = (selectedValue: number | null) => {
    const new_parent_id = selectedValue == selectedParentId.value ? null : selectedValue;
    selectedParentId.value = new_parent_id;
    form_category.parent_id = new_parent_id;
    openCommand.value = false;
}

onMounted(() => {
    if (props.data_category.parent_id) {
        selectedParentId.value = props.data_category.parent_id
    }
})

watch(() => form_category.name, (new_name) => {
    form_category.slug = GenerateSlug(new_name);
})

const GenerateSlug = (text: string) => {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-+|-+$/g, '');;
}

const submit = () => {
    form_category.put(`/category/${props.data_category.public_id}`, {
        preserveScroll: true,
        onSuccess: () => {
            editMode.value = false;
        }
    })
}
</script>

