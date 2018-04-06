<template>
    <details>
        <summary>View map data</summary>

            <div class="summary">
                <table id="map-table" class="table table-striped" v-if="config">
        <thead>
            <tr>
                <th>Longitude <span class="sorting-cnt"><span class="sorting-icons"></span></span></th>
                <th>Latitude <span class="sorting-cnt"><span class="sorting-icons"></span></span></th>
                <th>Value <span class="sorting-cnt"><span class="sorting-icons"></span></span></th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
            </div>
    </details>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Inject } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';

@Component
export default class MapTable extends Vue {
    @Prop() config: any;
    @State timeSlice: number;
    table: any;

    /** 
     * Handles data transformation from API to the table for CMIP5 
    */
    CMIP5( json: CMIP5_Data ): [any[]] {
        let b: any = [];

        json.data.forEach((yl, yi) => {
            yl.forEach((xl, xi) => {
                b.push([json.xmin + xi, json.ymin + yi, json.data[yi][xi]]);
            });
        });
        
        return b;
    }

    CMIP5_Url(timeSlice: number): string {
        const timePeriods = ['2021-2040', '2041-2060', '2061-2080', '2081-2100'];
        return `https://cmip5dev.azurewebsites.net/map_average/sic/rcp85/spring/${timePeriods[timeSlice]}`;
    }
    
    mounted(): void {
        this.table = (<any>$('#map-table')).DataTable({
            "dom": 'ilftpr',
            "ajax": {
                "url": this.CMIP5_Url(this.timeSlice),
                "dataSrc": (json: CMIP5_Data) => {
                    return this.CMIP5(json);
                }
            },
            "oLanguage": {
                "sSearch": "Filter items "
            }
        });
    }

    @Watch('timeSlice')
    onTimeChanged(newValue: string) {
        this.table.ajax.url(this.CMIP5_Url(parseInt(newValue)));
        this.table.ajax.reload();
    }
}

interface CMIP5_Data {
    xmin: number,
    xmax: number,
    ymin: number,
    ymax: number,
    data: [number[]]
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