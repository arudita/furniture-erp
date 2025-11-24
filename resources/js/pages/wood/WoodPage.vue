<template>
    <Head title="Wood" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <!-- Alert Dialog: Archive & Delete -->
        <AlertDialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <template v-if="actionType === 'destroy'">
                            you want to delete it?
                        </template>
                        <template v-else-if="actionType === 'archive'">
                            you want to archive it?
                        </template>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel @click="isDialogOpen = false">Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="handleConfirmationAction">
                        {{ actionType === 'destroy' ? 'Delete' : 'Archive' }}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-[5%] text-center">
                            #
                        </TableHead>
                        <TableHead class="w-[15%] cursor-pointer" title="sort by name">
                            <div @click="handleSort('name')" class="flex justify-between items-center">
                                Name
                                <template v-if="sortDirection == 'asc'">
                                    <ArrowDownAZ class="ml-2 h-4 w-4" />
                                </template>
                                <template v-if="sortDirection == 'desc'">
                                    <ArrowDownZA class="ml-2 h-4 w-4" />
                                </template>
                            </div>
                        </TableHead>
                        <TableHead class="w-[70%]">
                            Description
                        </TableHead>
                        <TableHead class="w-[10%] text-center">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="data_wood.data.length == 0">
                        <TableCell></TableCell>
                        <TableCell class="text-left text-gray-600 dark:text-gray-300" colspan="2">— data is empty —</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow v-else v-for="(item, index) in data_wood.data" :key="index">
                        <TableCell class="font-medium text-center">
                            {{ index + 1 }}
                        </TableCell>
                        <TableCell class="text-left">
                            <Link :href="`/wood/${item.public_id}`" class="block w-full cursor-pointer hover:underline underline-offset-4">
                                {{ item.name }}
                            </Link>
                        </TableCell>
                        <TableCell class="text-left">
                            <p class="line-clamp-1 transition-all duration-300 ease-out">
                                {{ item.description }}
                            </p>
                        </TableCell>
                        <TableCell class="text-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Ellipsis class="text-gray-600 hover:cursor-pointer"/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link :href="`/wood/${item.public_id}`" class="block w-full cursor-pointer px-2 py-1.5">Details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <button @click="triggerConfirmation(item.public_id, 'archive')" type="button" class="block w-full text-left cursor-pointer px-2 py-1.5">Archive</button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <button @click="triggerConfirmation(item.public_id, 'destroy')" type="button" class="block w-full text-left cursor-pointer px-2 py-1.5">Delete</button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <!-- Pagination -->
            <Pagination v-slot="{ page }" @update:page="handlePageChange" :items-per-page="data_wood.per_page" :total="data_wood.total" :default-page="data_wood.current_page">
                <PaginationContent v-slot="{ items }">
                    <PaginationPrevious />
                    <template v-for="(item, index) in items" :key="index">
                        <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
                            {{ item.value }}
                        </PaginationItem>
                    </template>
                    <PaginationEllipsis v-if="data_wood.links.length > 5" :index="4" />
                    <PaginationNext />
                </PaginationContent>
            </Pagination>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { ArrowDownAZ, ArrowDownZA, Ellipsis } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

interface Wood {
    id: number;
    public_id: string;
    name: string;
    description: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

interface InertiaPaginated<T> {
    current_page: number;
    data: T[];
    links: PaginationLink[];
    total: number;
    per_page: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wood',
        href: '#',
    },
];

const props = defineProps<{
    data_wood: InertiaPaginated<Wood>
}>();

const page = usePage();
const data = ref<Wood[]>([]);
const isDialogOpen = ref(false);
const sortColumn = ref<string>(page.props.sort_by as string);
const sortDirection = ref<'asc' | 'desc'>(page.props.sort_direction as 'asc' | 'desc');
const actionType = ref<'archive' | 'destroy' | null>(null);
const targetPublicId = ref<string | null>(null);
const data_wood = ref<InertiaPaginated<Wood>>(props.data_wood);

onMounted(async () => {
    data.value = await getData();
})

async function getData(): Promise<Wood[]> {
    return props.data_wood.data
}

const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortDirection.value == 'asc') {
        direction = 'desc';
    } else {
        direction = 'asc';
    }

    sortColumn.value = column;
    sortDirection.value = direction;

    const params: Record<string, string | number> = {
        page: data_wood.value.current_page,
    };

    if (column && direction) {
        params.sort = column;
        params.direction = direction;
    } else {
        delete params.sort;
        delete params.direction;
    }

    router.get(`/wood`, params, {
        preserveState: true,
        onSuccess: (page: any) => {
            if (page.props.data_wood) {
                data_wood.value = page.props.data_wood;
            }
        }
    });
}

const handlePageChange = (page: number) => {
    const params: Record<string, string | number | null> = { page: page };

    if (sortColumn.value && sortDirection.value) {
        params.sort = sortColumn.value;
        params.direction = sortDirection.value;
    }

    router.get('/wood', params, {
            only: ['data_wood'],
            preserveScroll: true,
        }
    );
};

const triggerConfirmation = (publicId: string, type: 'archive' | 'destroy') => {
    targetPublicId.value = publicId;
    actionType.value = type;
    isDialogOpen.value = true;
};

const handleConfirmationAction = () => {
    isDialogOpen.value = false;

    if (!targetPublicId.value || !actionType.value) return;

    const public_id = targetPublicId.value;
    const type = actionType.value;

    const successCallback = (page: any) => {
        if (page.props.data_wood) {
            data_wood.value = page.props.data_wood;
        }
    };

    if (type === 'archive') {
        router.patch(`/wood/${public_id}/archive`, {}, {
            preserveScroll: true,
            onSuccess: successCallback,
        });
    } else if (type === 'destroy') {
        router.delete(`/wood/${public_id}`, {
            preserveState: true,
            onSuccess: successCallback,
        });
    }

    targetPublicId.value = null;
    actionType.value = null;
};
</script>
