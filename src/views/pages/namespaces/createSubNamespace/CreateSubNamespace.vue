<template>
    <AssetFormPageWrap>
        <template v-slot:form-section>
            <FormNamespaceRegistrationTransaction v-if="ownedNamespaces.length > 0" :registration-type="1" />
            <div v-else class="no-data">
                {{ $t('no_data_namespace_tips') }}
            </div>
        </template>
        <template v-slot:form-description>
            <div class="asset-description-sub-title">
                {{ $t('namespace_name') }}
            </div>
            <div class="asset-description-text">
                {{ $t('namespace_tips_key_1') }}
            </div>
            <div class="asset-description-text">
                {{ $t('namespace_tips_value_1') }}
            </div>
            <div class="asset-description-text">
                {{ $t('namespace_tips_key_2') }}
            </div>
            <div class="asset-description-text">
                {{ $t('namespace_tips_value_2') }}
            </div>
            <div class="asset-description-text">
                {{ $t('namespace_tips_key_3') }}
            </div>
        </template>
    </AssetFormPageWrap>
</template>
<script lang="ts">
import { CreateSubNamespaceTs } from './CreateSubNamespaceTs';
export default class CreateSubNamespace extends CreateSubNamespaceTs {}
</script>
<style lang="less" scoped>
@import './CreateSubNamespace.less';
</style>

<style lang="less" scoped>
/deep/ .namespace-transaction-form-wrapper {
    max-width: 14rem;
}
</style>
