<template>
    <section class="com-json-edit" ref="$jsonEdit"></section>
</template>

<script setup>
import { ref, getCurrentInstance, defineEmits, defineProps, onMounted } from 'vue'
import JSONEditor from 'jsoneditor'
import { parse } from '@/store/modules/apis'
const instance = getCurrentInstance()
const jonedit = ref({})
const props = defineProps({
    value: Object
})
const emit = defineEmits(['update:value', 'change'])

onMounted(() => {
    const dom = instance.refs['$jsonEdit']
    jonedit.value = new JSONEditor(dom, {
        mode: 'code',
        onChange() {
            const textValue = jonedit.value.getText()
            emit('update:value', textValue)
            emit('change', textValue)
        }
    })
    if (typeof props.value === 'object') {
        jonedit.value.set = props.value
        return
    }
    jonedit.value.set(parse(props.value))
})
</script>

<style scope lang="scss">
.com-json-edit {
    width: 100%;
    height: 300px;
}
</style>