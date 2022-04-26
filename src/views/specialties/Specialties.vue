<template>
<div>
    <v-card :loading="$store.state.loading" elevation="0" class="transparent">
        <v-card-title>
            <h3>الإختصاصات</h3>
            <v-spacer></v-spacer>
            <v-btn @click="openAddDialog()" color="primary">
                <v-icon>mdi-plus</v-icon>
                إضافة
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-data-table :headers="headers" :ripple="false" :items="subs" hide-default-footer :loading="$store.state.loading" no-data-text="لا يوجد" loading-text="جار التحميل...">
                        <template v-slot:item.created="{ item }">
                            {{ $service.formatDate(new Date(item.createdAt), false) }}
                        </template>
                        <template v-slot:item.status="{ item }">
                            <v-chip label :color="status[item.status].color">
                                {{ status[item.status].text }}
                            </v-chip>
                            <!-- {{ sub.status }} -->
                        </template><template v-slot:item.phone_number="{ item }">
                            <span dir="ltr">
                                {{ item.phone_number }}
                            </span>
                            <!-- {{ sub.status }} -->
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <div class="d-flex align-center">
                                <v-btn @click="showEditDialog(item)" color="orange" text>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn @click="showDeleteDialog(item)" color="error" icon>
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </div>
                        </template>
                    </v-data-table>
                </v-col>
                <v-col cols="12">
                    <div class="d-flex justify-center">
                        <v-pagination v-model="options.pagination.page" :length="parseInt(total / options.pagination.pageSize) + 1" />
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    <v-dialog v-model="deleteDialog" width="400">
        <v-card>
            <v-card-title>
                هل انت متأكد من حذف الإختصاص؟
            </v-card-title>

            <v-card-text>
                سيتم حذف الإختصاص وجميع التفاصيل المرتبطة به
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="deleteItem()">
                    <v-icon>mdi-delete</v-icon>
                    حذف
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" width="700">
        <v-card>
            <v-container fluid>
                <v-toolbar class="mb-4 " outlined flat>
                    <v-toolbar-title>
                        <span class="title">
                            {{ dialogType == 'add' ? 'إضافة إختصاص' : 'تعديل إختصاص' }}
                        </span>
                    </v-toolbar-title>
                    <v-spacer />
                    <v-btn icon color="red" @click="reset()">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </v-toolbar>
                <v-row>
                    <v-col>
                        <v-text-field v-model="body.title" label="إسم الإختصاص" required outlined />
                    </v-col>
                    <v-col>
                        <v-text-field v-model="body.description" label="وصف الإختصاص" required outlined />
                    </v-col>
                    <v-col cols="12">
                        <v-btn v-if="dialogType == 'add'" @click="addItem()" large color="primary" :loading="addItemLoading">
                            <h3>حفظ</h3>
                        </v-btn>
                        <v-btn v-if="dialogType == 'edit'" @click="editItem()" large color="primary" :loading="addItemLoading">
                            <h3>تعديل</h3>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar">
        تم الحفظ بنجاح
        <!-- <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                mdi-close
            </v-btn>
        </template> -->
    </v-snackbar>

</div>
</template>

<script>
import qs from "qs";
export default {
    components: {},
    data() {
        return {
            body: {},
            dialog: false,
            dialogType: 'add',
            snackbar: false,
            addItemLoading: false,
            status: {
                pending: {
                    color: "warning",
                    text: "قيد المراجعة",
                },
                approved: {
                    color: "success",
                    text: "تمت الموافقة",
                },
                accepted: {
                    color: "success",
                    text: "مقبول",
                },
                rejected: {
                    color: "error",
                    text: "مرفوض",
                },
            },
            provinecs: [],
            subs: [],
            total: 1,
            headers: [{
                    text: "الاسم",
                    value: "title"
                },
                {
                    text: "وصف عن الإختصاص",
                    value: "description"
                },
                // { text: "رقم الهاتف", value: "phone_number" },
                // { text: "البريد", value: "email" },
                // { text: "تاريخ التقديم", value: "created" },
                // { text: "الحالة", value: "status" },
                // { text: "الكورس", value: "course.data.title" },
                {
                    text: "الاجراءات",
                    value: "actions"
                },
            ],
            deleteDialog: false,
            toDelete: {},
            options: {
                populate: "*",
                pagination: {
                    page: 1,
                    pageSize: 15,
                },
            },
        };
    },
    created() {
        this.getSubs();
    },
    methods: {
        showEditDialog(item) {
            this.dialogType = 'edit';
            this.dialog = true;
            this.body.title = item.title
            this.body.description = item.description
            this.body.id = item.id
        },
        openAddDialog() {
            this.dialogType = 'add';
            this.dialog = true;
            this.body = {
                "title": "",
                "description": "",
            }
        },
        addItem() {
            this.addItemLoading = true;
            var data = {
                data: this.body
            }
            this.$http.post("/specialties", data).then(() => {
                this.reset();
                this.snackbar = true;
                this.getSubs()
            }).finally(() => {
                this.addItemLoading = false;
            })
        },
        editItem() {
            this.addItemLoading = true;
            var data = {
                data: this.body
            }
            this.$http.put("/specialties/" + this.body.id, data).then(() => {
                this.reset();
                this.snackbar = true;
                this.getSubs()
            }).finally(() => {
                this.addItemLoading = false;
            })
        },
        reset() {
            this.dialog = false
            this.body = {
                "title": "",
                "description": "",
            }
        },
        showDeleteDialog(item) {
            this.toDelete = item;
            this.deleteDialog = true;
        },
        deleteItem() {
            this.$http.delete("/specialties/" + this.toDelete.id).then(() => {
                this.deleteDialog = false;
                this.getSubs();
            });
        },
        getSubs() {
            this.$store.commit("setLoading", true);
            this.$http
                .get("/specialties", {
                    params: this.options,
                    paramsSerializer: function paramsSerializer(params) {
                        return qs.stringify(params);
                    },
                })
                .then((response) => {
                    this.subs = response.data.data;
                    this.total = response.data.meta.pagination.total;
                    this.$store.commit("setLoading", false);
                });
        },
    },
    watch: {
        options: {
            handler() {
                this.getSubs();
            },
            deep: true,
        },
    },
};
</script>
