import {mapState} from "vuex"
import {Address, AliasType, MosaicId} from "nem2-sdk"
import {Component, Vue, Watch} from 'vue-property-decorator'
import EditDialog from './mosaic-edit-dialog/MosaicEditDialog.vue'
import {formatNumber} from '@/core/utils'
import {mosaicSortType} from "@/config/view/mosaic"
import {networkConfig} from "@/config"
import {MosaicNamespaceStatusType, StoreAccount, AppInfo, AppMosaic, AppNamespace} from "@/core/model"
import {sortMosaicList} from "@/core/services"
import Alias from '@/components/forms/alias/Alias.vue'

@Component({
    components: {
        Alias,
        EditDialog
    },
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class MosaicListTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    isLoadingConfirmedTx = false
    currentTab: number = 0
    currentPage: number = 1
    pageSize: number = networkConfig.namespaceListSize
    rootNameList: any[] = []
    screenMosaic: any = {}
    showCheckPWDialog = false
    showMosaicEditDialog = false
    showMosaicAliasDialog = false
    showMosaicUnAliasDialog = false
    mosaicMapInfo: any = {}
    selectedMosaic: AppMosaic = null
    currentSortType = mosaicSortType.byId
    mosaicSortType = mosaicSortType
    currentMosaicList = []
    isShowExpiredMosaic = false
    sortDirection = true
    showAliasDialog: boolean = false
    bind: boolean = false
    namespace: AppNamespace = null
    mosaic: string = null
    address: string = null

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get mosaicsLoading() {
        return this.app.mosaicsLoading
    }

    get namespaceMap() {
        let namespaceMap = {}
        this.activeAccount.namespaces.forEach((item) => {
            switch (item.alias.type) {
                case (AliasType.Address):

                    namespaceMap[item.alias.address.plain()] = item
                    break
                case (AliasType.Mosaic):
                    namespaceMap[item.alias.mosaicId.toHex()] = item
            }
        })
        return namespaceMap
    }

    mosaicSupplyAmount(value) {
        if (!value.mosaicInfo) return 0
        const formatNumber: string = this.formatNumber(value.mosaicInfo.supply.compact()) + ''
        return formatNumber.substring(0, formatNumber.indexOf('.'))
    }

    toggleChange(page) {
        this.currentPage = page
    }

    formatNumber(number) {
        return formatNumber(number)
    }

    bindItem(mosaic: AppMosaic) {
        this.bind = true
        this.namespace = null
        this.mosaic = mosaic.hex
        this.address = null
        this.showAliasDialog = true
    }

    unbindItem(mosaic: AppMosaic) {
        const {namespaces} = this.activeAccount
        this.bind = false
        this.namespace = namespaces.find(({name}) => name === mosaic.name)
        this.mosaic = mosaic.hex
        this.address = null
        this.showAliasDialog = true
    }

    showEditDialog(item: AppMosaic) {
        this.selectedMosaic = item
        this.showMosaicEditDialog = true
    }

    computeDuration(item: AppMosaic) {
        if (!item.mosaicInfo) return 'Loading...'
        const {properties, mosaicInfo} = item
        const duration = properties.duration
        if (duration === 0) return 'Forever'
        return (mosaicInfo.height.compact() + duration) - this.currentHeight
    }

    getSortType(type: number) {
        const preSortType = this.currentSortType
        this.currentSortType = type
        if (preSortType == type) {
            this.currentMosaicList.sort(() => -1)
            this.sortDirection = !this.sortDirection
            return
        }
        this.sortDirection = true
        const currentMosaicList = [...this.currentMosaicList]
        this.currentMosaicList = sortMosaicList(type,currentMosaicList)
    }

    toggleIsShowExpiredMosaic() {
        const {isShowExpiredMosaic, currentHeight} = this
        const list = Object.values(this.mosaics)
        this.currentMosaicList = list.filter((item: any) => isShowExpiredMosaic || item.expirationHeight == MosaicNamespaceStatusType.FOREVER || item.expirationHeight > currentHeight)
        this.isShowExpiredMosaic = !this.isShowExpiredMosaic
    }

    intiMosaics() {
        this.getSortType(this.currentSortType)
        this.currentMosaicList = Object.values(this.mosaics)
    }

    @Watch('mosaics', {deep: true})
    onMosaicChange() {
        this.intiMosaics()
    }

    mounted() {
        this.intiMosaics()
    }


}