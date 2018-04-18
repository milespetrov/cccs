<template>
    <details>
        <summary>View map data</summary>

            <div class="summary">
                <table id="map-table" class="table table-striped">
                    <thead>
                        <tr>
                            <th v-for="col in mapTableColumns" :key="col">{{col}}<span class="sorting-cnt"><span class="sorting-icons"></span></span></th>
                        </tr>
                    </thead>
                </table>
            </div>
    </details>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

@Component
export default class MapTable extends Vue {
    @State timeSlice: number | null;
    @State variableId: string | null;
    @State datasetId: string | null;
    @State rcpId: string | null;

    @Getter datasetApi: any;
    @Getter mapTableColumns: string[];
    table: any;

    columns = ['Longitude', 'Latitude', 'Value'];

    @Watch('timeSlice')
    onTimeChanged() {
        this.updateTable();
    }

    @Watch('variableId')
    onVariableChanged() {
        this.updateTable();
    }

    @Watch('datasetId')
    onDatasetChanged() {
        this.updateTable();
    }

    @Watch('rcpId')
    onRcpChanged() {
        this.updateTable();
    }

    async mounted(): Promise<void> {
        const tableData = await this.datasetApi.getTableData();

        this.table = (<any>$('#map-table')).DataTable({
            // dom elements in order:
            // [i]nfo summary (showing x of y), [l]ength change (show z entries), [f]ilter
            // [t]able, [p]agination, p[r]ocessing
            dom: 'ilftpr',
            data: tableData,
            oLanguage: {
                sSearch: 'Filter items '
            }
        });
    }

    async updateTable() {
        const tableData = await this.datasetApi.getTableData();
        this.table.clear();
        this.table.rows.add(tableData);
        this.table.draw();
    }
}
</script>

<style lang="css" scoped>
table.dataTable thead .sorting-cnt {
    white-space: nowrap;
}

table.dataTable thead .sorting-cnt:before {
    content: " ";
}

table.dataTable thead .sorting .sorting-icons, table.dataTable thead .sorting_asc .sorting-icons, table.dataTable thead .sorting_asc_disabled .sorting-icons, table.dataTable thead .sorting_desc .sorting-icons, table.dataTable thead .sorting_desc_disabled .sorting-icons {
    display: inline-block;
}
table.dataTable thead .sorting-icons {
    margin-top: 2px;
}

table.dataTable thead .sorting_asc .sorting-icons:before, table.dataTable thead .sorting_desc .sorting-icons:after {
    background: #ccc;
    border: 1px solid #111;
}
table.dataTable thead .sorting-icons:before {
    content: "\e093";
    padding: 0 .1em 0 0;
}
.dataTables_wrapper .dataTables_paginate .paginate_button.next:after, .dataTables_wrapper .dataTables_paginate .paginate_button.previous:before, .pager>li:first-child [rel=prev]:before, .pager>li:last-child [rel=next]:after, .pagination>li:first-child [rel=prev]:before, .pagination>li:last-child [rel=next]:after, [dir=rtl] .dataTables_wrapper .dataTables_paginate .paginate_button.next:before, [dir=rtl] .dataTables_wrapper .dataTables_paginate .paginate_button.previous:after, [dir=rtl] .pager [rel=next]:before, [dir=rtl] .pager [rel=prev]:after, [dir=rtl] .pagination [rel=next]:before, [dir=rtl] .pagination [rel=prev]:after, table.dataTable thead .sorting-icons:after, table.dataTable thead .sorting-icons:before {
    font-family: "Glyphicons Halflings";
    font-weight: 400;
    line-height: 1em;
    position: relative;
    top: .1em;
}

table.dataTable thead .sorting .sorting-icons:after, table.dataTable thead .sorting .sorting-icons:before, table.dataTable thead .sorting_asc .sorting-icons:after, table.dataTable thead .sorting_desc .sorting-icons:before {
    background: #fff;
    border: 1px solid #aaa;
    color: #757575;
}
table.dataTable thead .sorting-icons:after {
    content: "\e094";
    padding: 0 .04em 0 .06em;
}
.dataTables_wrapper .dataTables_paginate .paginate_button.next:after, .dataTables_wrapper .dataTables_paginate .paginate_button.previous:before, .pager>li:first-child [rel=prev]:before, .pager>li:last-child [rel=next]:after, .pagination>li:first-child [rel=prev]:before, .pagination>li:last-child [rel=next]:after, [dir=rtl] .dataTables_wrapper .dataTables_paginate .paginate_button.next:before, [dir=rtl] .dataTables_wrapper .dataTables_paginate .paginate_button.previous:after, [dir=rtl] .pager [rel=next]:before, [dir=rtl] .pager [rel=prev]:after, [dir=rtl] .pagination [rel=next]:before, [dir=rtl] .pagination [rel=prev]:after, table.dataTable thead .sorting-icons:after, table.dataTable thead .sorting-icons:before {
    font-family: "Glyphicons Halflings";
    font-weight: 400;
    line-height: 1em;
    position: relative;
    top: .1em;
}

table.dataTable thead .sorting {
    background-image: none;
}
table.dataTable thead .sorting_asc {
    background-image: none;
}
table.dataTable thead .sorting_desc {
    background-image: none;
}
</style>
